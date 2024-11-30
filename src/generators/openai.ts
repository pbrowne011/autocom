import * as vscode from 'vscode';
import axios from 'axios';
import { CommentGenerator } from './base';
import { CommentOptions } from '../types/models';

const OPENAI_KEY_SECRET = 'openai-api-key';

export class OpenAIGenerator extends CommentGenerator {
    private apiKey: string | undefined;

    async generateComment(code: string, options?: CommentOptions): Promise<string> {
        this.apiKey = await this.getApiKey(
            OPENAI_KEY_SECRET,
            'Enter your OpenAI API key'
        )

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4-turbo',
                    messages: [{
                        role: 'user',
                        content: `Please write a clear, concise comment explaining what this code does. Focus on the purpose and any important details. Here's the code:\n\n${code}`
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
