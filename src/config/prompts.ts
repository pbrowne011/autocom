export const COMMENT_PROMPTS = {
    function: {
        default: `Generate a clear, concise comment...`,
        verbose: `Please write a clear, detailed comment explaining what this 
        code does. Focus on the purpose and any important details. Here's the 
        code:`//\n\n${code}`
    },
    inline: `Explain this line of code...`,
} as const;

export enum CommentVerbosity {
    Concise = 1,
    Standard = 2, 
    Detailed = 3
}