export interface PromptTemplate {
    template: string;
    defaultParams?: Record<string, string | number>;
}

export interface LanguageSpecificPrompt {
    commentStyle?: string;
    conventions?: string;
}

export interface PromptConfig {
    templates: {
        function: Record<CommentVerbosity, PromptTemplate>;
        inline: Record<CommentVerbosity, PromptTemplate>;
        block?: Record<CommentVerbosity, PromptTemplate>;
    };
    languageOverrides?: Record<string, LanguageSpecificPrompt>;
}

export enum CommentVerbosity {
    Concise = 1,    // Brief, one-line description of function
    Standard = 2,   // Few lines of detail
    Detailed = 3    // Explain every line of the function
}