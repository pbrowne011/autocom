import * as vscode from 'vscode';
import axios from 'axios';
import { CommentGenerator } from './base';
import { CommentOptions } from '../types/models';

const ANTHROPIC_KEY_SECRET = 'anthropic-api-key';

export class AnthropicGenerator extends CommentGenerator {
    private apiKey: string | undefined;

    async generateComment(code: string, options?: CommentOptions): Promise<string> {
        // Get API key
        this.apiKey = await this.getApiKey(
            ANTHROPIC_KEY_SECRET,
            'Enter your Anthropic API key'
        )

        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 4096,
                    messages: [{
                        role: 'user',
                        content: `Please write a clear, concise comment explaining what this code does. Focus on the purpose and any important details. Here's the code:\n\n${code}`
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
                // Clear the invalid API key from both class and storage
                this.apiKey = undefined;
                await this.context.secrets.delete(ANTHROPIC_KEY_SECRET);
                throw new Error('Invalid API key.');
            } else {
                throw new Error(`API error: ${error.response?.data?.error?.message || 
                    error.message}`);
            }
        }
    }
}