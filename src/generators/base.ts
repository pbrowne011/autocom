import * as vscode from 'vscode';
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
}