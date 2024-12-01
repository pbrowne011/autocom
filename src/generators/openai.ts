import * as vscode from 'vscode';
import axios from 'axios';
import { CommentGenerator } from './base';
import { CommentOptions } from '../types/models';
import { PromptManager } from '../config/manager';
import { CommentVerbosity } from '../types/prompts';

const OPENAI_KEY_SECRET = 'openai-api-key';

export class OpenAIGenerator extends CommentGenerator {
    private apiKey: string | undefined;
    private promptManager: PromptManager;

    constructor(context: vscode.ExtensionContext) {
        super(context);
        this.promptManager = new PromptManager();
    }

    async generateComment(code: string, options?: CommentOptions): Promise<string> {
        this.apiKey = await this.getApiKey(
            OPENAI_KEY_SECRET,
            'Enter your OpenAI API key'
        );

        const prompt = this.promptManager.getPrompt(
            options?.type || 'function',
            options?.verbosity || CommentVerbosity.Concise,
            options?.language,
            { code }
        );

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4-turbo',
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    max_tokens: 4096
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );
    
            return this.formatResponse(response.data.choices[0].message.content);
        } catch (error) {
            await this.handleApiError(error);
            throw error;
        }
    }

    protected formatResponse(response: string): string {
        return response.trim();
    }

    private async handleApiError(error: unknown): Promise<void> {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded.');
            } else if (error.response?.status === 401) {
                this.apiKey = undefined;
                await this.context.secrets.delete(OPENAI_KEY_SECRET);
                throw new Error('Invalid API key.');
            } else {
                throw new Error(`API error: ${error.response?.data?.error?.message ||
                    error.message}`);
            }
        }
    }
}
