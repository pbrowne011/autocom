import * as vscode from 'vscode';
import axios from 'axios';
import { CommentGenerator } from './base';
import { CommentOptions } from '../types/models';
import { PromptManager } from '../config/manager';
import { CommentVerbosity } from '../types/prompts';

const ANTHROPIC_KEY_SECRET = 'anthropic-api-key';
const config = vscode.workspace.getConfiguration('autocom');
const model = config.get('anthropicModel') || 'claude-3-sonnet-20240229';

export class AnthropicGenerator extends CommentGenerator {
    private apiKey: string | undefined;
    private promptManager: PromptManager;

    constructor(context: vscode.ExtensionContext) {
        super(context);
        this.promptManager = new PromptManager();
    }

    async generateComment(code: string, options?: CommentOptions): Promise<string> {
        // Get API key
        this.apiKey = await this.getApiKey(
            ANTHROPIC_KEY_SECRET,
            'Enter your Anthropic API key'
        );

        const prompt = this.promptManager.getPrompt(
            options?.type || 'block',
            options?.verbosity || CommentVerbosity.Concise,
            options?.language,
            { code }
        );

        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: model,
                    max_tokens: 4096,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            return this.formatResponse(response.data.content[0].text);
        } catch (error) {
            try {
                await super.handleApiError(error, ANTHROPIC_KEY_SECRET);
            } finally {
                // Needs to be outside handleApiError to undefine specific
                // apiKey of current context
                if (axios.isAxiosError(error) && 
                    error.response && 
                    (error.response.status === 401 || error.response.status === 403)) {
                    this.apiKey = undefined;
                }
            }

            throw error;
        }
    }

    protected formatResponse(response: string): string {
        return response.trim();
    }
}