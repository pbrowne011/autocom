import * as vscode from 'vscode';
import { Provider, CommentOptions } from '../types/models';
import { CommentGenerator } from './base';
import { AnthropicGenerator } from './anthropic';
import { OpenAIGenerator } from './openai';

export function getGenerator(provider: Provider, context: vscode.ExtensionContext): CommentGenerator {
    switch (provider) {
        case 'anthropic':
            return new AnthropicGenerator(context);
        case 'openai':
            return new OpenAIGenerator(context);
        /*
        case 'gemini':
            return new GeminiGenerator(context);

        */
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

export async function generateComment(
    provider: Provider,
    context: vscode.ExtensionContext,
    code: string,
    options?: CommentOptions
): Promise<string> {
    const generator = getGenerator(provider, context);
    return generator.generateComment(code, options);
}