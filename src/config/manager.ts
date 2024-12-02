import * as vscode from "vscode";
import {
    CommentVerbosity,
    PromptConfig,
    PromptTemplate,
    CustomPrompts
} from "../types/prompts";
import { DEFAULT_PROMPTS } from "./prompts";

export class PromptManager {
    private config: PromptConfig;

    constructor(customConfig?: Partial<PromptConfig>) {
        const vsConfig = vscode.workspace.getConfiguration('autocom');
        const importedCustomPrompts = vsConfig.get<CustomPrompts>('customPrompts') ?? {};
        this.validateCustomPrompts(importedCustomPrompts);
        const customPrompts = this.convertCustomPrompts(importedCustomPrompts);

        this.config = {
            ...DEFAULT_PROMPTS,
            ...customConfig,
            templates: {
                ...DEFAULT_PROMPTS.templates,
                ...customConfig?.templates,
                ...customPrompts
            }
        };
    }

    public getPrompt(
        type: keyof PromptConfig['templates'],
        verbosity: CommentVerbosity = CommentVerbosity.Standard,
        language?: string,
        params: Record<string, string | number> = {}
    ): string {
        const template = this.getTemplate(type, verbosity);
        const languageOverrides = language ? this.config.languageOverrides?.[language] : undefined;

        const finalParams = {
            ...template.defaultParams,
            ...params,
            ...(languageOverrides && { style: languageOverrides.commentStyle }),
            ...(languageOverrides && { conventions: languageOverrides.conventions })
        };

        return this.compileTemplate(template.template, finalParams);
    }

    private getTemplate(
        type: keyof PromptConfig['templates'],
        verbosity: CommentVerbosity
    ): PromptTemplate {
        const templates = this.config.templates[type as keyof typeof this.config.templates];
        if (!templates) {
            throw new Error(`Unknown comment type: ${type}`);
        }

        const template = templates[verbosity];
        if (!template) {
            throw new Error(`No template found for verbosity level: ${verbosity}`);
        }

        return template;
    }

    private compileTemplate(template: string, params: Record<string, string | number>): string {
        return template.replace(/\${(\w+)}/g, (match, key) => {
            return params[key]?.toString() ?? match;
        });
    }

    private convertCustomPrompts(customPrompts: CustomPrompts): Partial<PromptConfig['templates']> {
        const result: Partial<PromptConfig['templates']> = {};

        // Convert each comment type (function, inline, block)
        for (const type in customPrompts) {
            const typePrompts = customPrompts[type as keyof CustomPrompts];
            if (typePrompts) {
                result[type as keyof PromptConfig['templates']] = Object.fromEntries(
                    Object.entries(typePrompts).map(([verbosity, template]) => [
                        verbosity,
                        {
                            template: template ?? '',
                            defaultParams: {}
                        }
                    ])
                ) as Record<CommentVerbosity, PromptTemplate>;
            }
        }

        return result;
    }

    private validateCustomPrompts(prompts: any): void {
        if (!prompts) { return; }
        
        const validTypes = ['function', 'inline'];
        const validVerbosity = ['concise', 'standard', 'detailed'];
        
        for (const type in prompts) {
            if (!validTypes.includes(type)) {
                throw new Error(`Invalid prompt type: ${type}`);
            }
            
            for (const level in prompts[type]) {
                if (!validVerbosity.includes(level)) {
                    throw new Error(`Invalid verbosity level: ${level}`);
                }
                if (typeof prompts[type][level] !== 'string') {
                    throw new Error(`Prompt template must be a string`);
                }
            }
        }
    }
}