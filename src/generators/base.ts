import * as vscode from 'vscode';
import axios from 'axios';
import { CommentOptions } from '../types/models';

export abstract class CommentGenerator {
    constructor(protected context: vscode.ExtensionContext) {}

    abstract generateComment(code: string, options?: CommentOptions): Promise<string>;
    
    protected abstract formatResponse(response: string): string;
    
    // Shared functionality for handling API keys
    protected async getApiKey(secretKey: string, promptMessage: string): Promise<string> {
        let apiKey = await this.context.secrets.get(secretKey);
        
        if (!apiKey) {
            apiKey = await vscode.window.showInputBox({
                prompt: promptMessage,
                password: true,
                placeHolder: 'Enter your API key (it will be stored securely)'
            });
            
            if (apiKey) {
                await this.context.secrets.store(secretKey, apiKey);
            }
        }

        if (!apiKey) {
            throw new Error('API key is required');
        }

        return apiKey;
    }

    protected async handleApiError(error: unknown, secretKey: string): Promise<void> {
        if (!axios.isAxiosError(error)) {
            throw error;
        }

        const axiosError = error;

        // Network errors (no response received)
        if (!axiosError.response) {
            throw new Error(`Network error: ${axiosError.message}`);
        }

        // Response errors - Axios automatically handles HTTP error codes
        // and provides response.data with the error details from the API
        const errorMessage = axiosError.response.data?.error?.message || 
                            axiosError.response.statusText || 
                            `HTTP ${axiosError.response.status}`;

        if (axiosError.response.status === 401 || axiosError.response.status === 403) {
            await this.context.secrets.delete(secretKey);
        }

        throw new Error(`API error: ${errorMessage}`);
    }
}