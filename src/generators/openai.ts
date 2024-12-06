import * as vscode from 'vscode';
import axios from 'axios';
import { CommentGenerator } from './base';
import { CommentOptions } from '../types/models';
import { PromptManager } from '../config/manager';
import { CommentVerbosity } from '../types/prompts';

const OPENAI_KEY_SECRET = 'openai-api-key';
const config = vscode.workspace.getConfiguration('autocom');
const model = config.get('openaiModel') || 'gpt-4-turbo';

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
                    model: model,
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
            try {
                await super.handleApiError(error, OPENAI_KEY_SECRET);
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
