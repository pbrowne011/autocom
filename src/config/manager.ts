import { CommentVerbosity, PromptConfig, PromptTemplate } from "../types/prompts";
import { DEFAULT_PROMPTS } from "./prompts";

export class PromptManager {
    private config: PromptConfig;

    constructor(customConfig?: Partial<PromptConfig>) {
        this.config = {
            ...DEFAULT_PROMPTS,
            ...customConfig,
            templates: {
                ...DEFAULT_PROMPTS.templates,
                ...customConfig?.templates
            }
        };
    }

    public getPrompt(
        type: 'function' | 'inline' | 'block',
        verbosity: CommentVerbosity,
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

    private getTemplate(type: string, verbosity: CommentVerbosity): PromptTemplate {
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
            return params[key]?.toString() || match;
        });
    }
}