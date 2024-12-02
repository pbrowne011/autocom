export interface PromptTemplate {
    template: string;
    defaultParams?: Record<string, string | number>;
}

export interface LanguageSpecificPrompt {
    commentStyle?: string;
    conventions?: string;
}

export interface CommentTypeConfig {
    [CommentVerbosity.Concise]?: PromptTemplate;
    [CommentVerbosity.Standard]?: PromptTemplate;
    [CommentVerbosity.Detailed]?: PromptTemplate;
}

export interface PromptConfig {
    templates: {
        function: CommentTypeConfig;
        inline: CommentTypeConfig;
        block?: CommentTypeConfig;
    };
    languageOverrides?: Record<string, LanguageSpecificPrompt>;
}

export interface CustomPrompts {
    function?: {
        [CommentVerbosity.Concise]?: string;
        [CommentVerbosity.Standard]?: string;
        [CommentVerbosity.Detailed]?: string;
    };
    inline?: {
        [CommentVerbosity.Concise]?: string;
        [CommentVerbosity.Standard]?: string;
        [CommentVerbosity.Detailed]?: string;
    };
    block?: {
        [CommentVerbosity.Concise]?: string;
        [CommentVerbosity.Standard]?: string;
        [CommentVerbosity.Detailed]?: string;
    };
}

export enum CommentVerbosity {
    Concise = 'concise',        // Brief, one-line description of function
    Standard = 'standard',      // Few lines of detail
    Detailed = 'detailed'       // Explain every line of the function
}