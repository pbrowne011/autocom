import { CommentVerbosity } from "./prompts";

export type Provider = 'anthropic' | 'openai';// | 'gemini';

export interface CommentOptions {
    type: 'block' | 'inline' | 'doxygen';
    verbosity: CommentVerbosity;
    language?: string;
    maxLength?: number;
}

export interface GeneratorResponse {
    comment: string;
    status: 'success' | 'error';
    metadata?: Record<string, unknown>;
}