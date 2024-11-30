export type Provider = 'anthropic' | 'openai';// | 'gemini';

export interface CommentOptions {
    style: 'block' | 'inline';
    verbosity: number;
    maxLength?: number;
}

export interface GeneratorResponse {
    comment: string;
    status: 'success' | 'error';
    metadata?: Record<string, unknown>;
}