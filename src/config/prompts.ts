import { PromptConfig, CommentVerbosity } from "../types/prompts";

export const DEFAULT_PROMPTS: PromptConfig = {
    templates: {
        block: {
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
        },
        doxygen: {
            [CommentVerbosity.Concise]: {
                template: "Generate Doxygen documentation for this code. Include:\n" +
                         "1. REQUIRED @brief - Single sentence summary\n" +
                         "2. REQUIRED @param for each parameter (if any)\n" +
                         "3. REQUIRED @return if function returns a value\n\n" +
                         "Keep descriptions minimal but clear.\n\n" +
                         "Only return the header text of the comment. Do not" + 
                         "output either the code/inline comments or any" + 
                         "comment formatting.\n\n${code}"
            },
            [CommentVerbosity.Standard]: {
                template: "Generate Doxygen documentation for this code. Include:\n" +
                         "1. REQUIRED @brief - Clear summary\n" +
                         "2. Detailed description if needed\n" +
                         "3. REQUIRED @param for each parameter with clear descriptions\n" +
                         "4. REQUIRED @return with clear description if applicable\n" +
                         "5. @throws if exceptions are possible\n\n" +
                         "Only return the header text of the comment. Do not" + 
                         "output either the code/inline comments or any" + 
                         "comment formatting.\n\n${code}"
            },
            [CommentVerbosity.Detailed]: {
                template: "Generate comprehensive Doxygen documentation for this code. Include:\n" +
                         "1. REQUIRED @brief - Clear summary\n" +
                         "2. Detailed description with implementation notes\n" +
                         "3. REQUIRED @param for each parameter with detailed descriptions\n" +
                         "4. REQUIRED @return with comprehensive description if applicable\n" +
                         "5. @throws for all possible exceptions\n" +
                         "6. @note for any important caveats\n" +
                         "7. @see for related functions\n" +
                         "8. Usage examples where appropriate\n\n" +
                         "Only return the header text of the comment. Do not" + 
                         "output either the code/inline comments or any" + 
                         "comment formatting.\n\n${code}"
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
        cpp: {
            commentStyle: "/**",
            conventions: "Doxygen"
        },
        java: {
            commentStyle: "/**",
            conventions: "Javadoc"
        }
        // Add more language-specific overrides as needed
    }
};