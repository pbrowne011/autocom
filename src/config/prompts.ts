import { PromptConfig, CommentVerbosity } from "../types/prompts";

export const DEFAULT_PROMPTS: PromptConfig = {
    templates: {
        function: {
            [CommentVerbosity.Concise]: {
                template:
                    "Write a single-line comment describing this \
                    function\'s purpose:\n\n${code} \n\
                    Do not include comment symbols in your response"
            },
            [CommentVerbosity.Standard]: {
                template:
                    "Generate a clear comment explaining what this \
                    function does, including parameters and return \
                    value:\n\n${code} \n\
                    Do not include comment symbols in your response"
            },
            [CommentVerbosity.Detailed]: {
                template:
                    "Write a comprehensive function documentation including:\n \
                    - Purpose\n \
                    - Parameters with types and constraints\n \
                    - Return value\n \
                    - Examples (if appropriate)\n \
                    - Any important notes or caveats\n\n${code} \n\
                    Do not include comment symbols in your response"
            }
        },
        inline: {
            [CommentVerbosity.Concise]: {
                template: 'Explain this line briefly:\n\n${code}\n\
                    Do not include comment symbols in your response'
            },
            [CommentVerbosity.Standard]: {
                template:
                    "Write a clear inline comment explaining what this \
                    code does:\n\n${code} \n\
                    Do not include comment symbols in your response"
            },
            [CommentVerbosity.Detailed]: {
                template:
                    "Write a detailed inline comment explaining this code, \
                    including any important context or implications:\n\n${code} \n\
                    Do not include comment symbols in your response"
            }
        }
    },
    languageOverrides: {
        python: {
            commentStyle: '"""',
            conventions: 'PEP 257'
        },
        typescript: {
            commentStyle: '/**',
            conventions: 'TSDoc'
        },
        // Add more language-specific overrides as needed
    }
};