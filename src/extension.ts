import * as vscode from 'vscode';
import axios from 'axios';

// Constants for secret storage keys
const ANTHROPIC_KEY_SECRET = 'anthropic-api-key';
const OPENAI_KEY_SECRET = 'openai-api-key';

// Store context globally so we can access it in our functions
let extensionContext: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;

    // Register commands for different AI providers
    let generateAnthropicComment = vscode.commands.registerCommand(
        'ai-commenter.anthropicComment',
        async () => {
            await generateComment('anthropic');
        }
    );

    let generateOpenAIComment = vscode.commands.registerCommand(
        'ai-commenter.openaiComment',
        async () => {
            await generateComment('openai');
        }
    );

    // Add commands to context
    context.subscriptions.push(generateAnthropicComment, generateOpenAIComment);

    // Register context menu items
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider('*', new CommentCodeLensProvider())
    );
}

class CommentCodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return [];
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            return [];
        }

        const range = new vscode.Range(selection.start, selection.end);
        return [
            new vscode.CodeLens(range, {
                title: "💭 Comment with Claude",
                command: 'ai-commenter.anthropicComment'
            }),
            new vscode.CodeLens(range, {
                title: "💭 Comment with GPT",
                command: 'ai-commenter.openaiComment'
            })
        ];
    }
}

async function generateComment(provider: 'anthropic' | 'openai') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
        vscode.window.showWarningMessage('Please select code to generate comments for.');
        return;
    }

    try {
        // Show loading indicator
        const status = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );
        status.text = "$(loading~spin) Generating comment...";
        status.show();

        let comment: string;
        
        if (provider === 'anthropic') {
            comment = await generateAnthropicComment(selectedText);
        } else {
            comment = await generateOpenAIComment(selectedText);
        }

        // Insert comment above the selected code
        await editor.edit((editBuilder) => {
            const position = selection.start;
            const lineStart = new vscode.Position(position.line, 0);
            
            // Format comment with block style for the current language
            const formattedComment = formatComment(
                comment, 
                editor.document.languageId, 
                true  // use block comments
            );
            
            editBuilder.insert(lineStart, formattedComment);
        });

        status.hide();
    } catch (error) {
        vscode.window.showErrorMessage(
            `Failed to generate comment: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

async function generateAnthropicComment(code: string): Promise<string> {
    // Try to get API key from secrets
    let ANTHROPIC_API_KEY = await extensionContext.secrets.get(ANTHROPIC_KEY_SECRET);
    
    // If no key found, prompt user and store it
    if (!ANTHROPIC_API_KEY) {
        ANTHROPIC_API_KEY = await vscode.window.showInputBox({
            prompt: 'Enter your Anthropic API key',
            password: true,
            placeHolder: 'Enter your API key (it will be stored securely)'
        });
        
        if (ANTHROPIC_API_KEY) {
            await extensionContext.secrets.store(ANTHROPIC_KEY_SECRET, ANTHROPIC_API_KEY);
        }
    }

    if (!ANTHROPIC_API_KEY) {
        throw new Error('API key is required');
    }

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-sonnet-20240229',
                max_tokens: 4096,
                messages: [{
                    role: 'user',
                    content: `Please write a clear, concise comment explaining what this code does. Focus on the purpose and any important details. Here's the code:\n\n${code}`
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );

        return response.data.content[0].text;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded.');
            } else if (error.response?.status === 401) {
                // Clear the invalid API key
                await extensionContext.secrets.delete(ANTHROPIC_KEY_SECRET);
                throw new Error('Invalid API key.');
            } else {
                throw new Error(`API error: ${error.response?.data?.error?.message || error.message}`);
            }
        }
        throw error;
    }
}

async function generateOpenAIComment(code: string): Promise<string> {
    // Try to get API key from secrets
    let OPENAI_API_KEY = await extensionContext.secrets.get(OPENAI_KEY_SECRET);
    
    // If no key found, prompt user and store it
    if (!OPENAI_API_KEY) {
        OPENAI_API_KEY = await vscode.window.showInputBox({
            prompt: 'Enter your OpenAI API key',
            password: true,
            placeHolder: 'Enter your API key (it will be stored securely)'
        });
        
        if (OPENAI_API_KEY) {
            await extensionContext.secrets.store(OPENAI_KEY_SECRET, OPENAI_API_KEY);
        }
    }

    if (!OPENAI_API_KEY) {
        throw new Error('API key is required');
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-turbo',
                messages: [{
                    role: 'user',
                    content: `Please write a clear, concise comment explaining what this code does. Focus on the purpose and any important details. Here's the code:\n\n${code}`
                }],
                max_tokens: 4096
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded.');
            } else if (error.response?.status === 401) {
                // Clear the invalid API key
                await extensionContext.secrets.delete(OPENAI_KEY_SECRET);
                throw new Error('Invalid API key.');
            } else {
                throw new Error(`API error: ${error.response?.data?.error?.message || error.message}`);
            }
        }
        throw error;
    }
}

function getCommentStyle(language: string): { prefix: string; blockStart?: string; blockEnd?: string } {
    const styles: { [key: string]: { prefix: string; block: { start: string; end: string } } } = {
        javascript: {
            prefix: '//',
            block: { start: '/**', end: ' */' }
        },
        typescript: {
            prefix: '//',
            block: { start: '/**', end: ' */' }
        },
        python: {
            prefix: '#',
            block: { start: '"""', end: '"""' }
        },
        java: {
            prefix: '//',
            block: { start: '/**', end: ' */' }
        },
        cpp: {
            prefix: '//',
            block: { start: '/*', end: ' */' }
        },
        csharp: {
            prefix: '//',
            block: { start: '/*', end: ' */' }
        },
        php: {
            prefix: '//',
            block: { start: '/**', end: ' */' }
        },
        ruby: {
            prefix: '#',
            block: { start: '=begin', end: '=end' }
        },
        go: {
            prefix: '//',
            block: { start: '/*', end: ' */' }
        },
        rust: {
            prefix: '//',
            block: { start: '/*', end: ' */' }
        }
    };

    const defaultStyle = {
        prefix: '//',
        block: { start: '/*', end: ' */' }
    };

    const style = styles[language] || defaultStyle;
    return {
        prefix: style.prefix,
        blockStart: style.block.start,
        blockEnd: style.block.end
    };
}

function formatComment(comment: string, language: string, useBlockComment: boolean = true): string {
    const style = getCommentStyle(language);
    
    if (useBlockComment) {
        // Split into lines, trim whitespace, and wrap long lines
        const lines = comment
            .split('\n')
            .map(line => line.trim())
            .flatMap(line => wrapLine(line));
        
        // For single-line comments, use simple block format
        if (lines.length === 1) {
            return `${style.blockStart} ${lines[0]} ${style.blockEnd}\n`;
        }
        
        // For multi-line comments, format with proper spacing
        const isJSDoc = style.blockStart === '/**';
        
        if (isJSDoc) {
            // JSDoc style
            return [
                style.blockStart,
                ...lines.map(line => ` * ${line}`),
                ' */',
                ''
            ].join('\n');
        } else {
            // Standard block comment style
            return [
                style.blockStart,
                ...lines.map(line => ` * ${line}`),
                style.blockEnd,
                ''
            ].join('\n');
        }
    } else {
        // Inline comment style
        return comment
            .split('\n')
            .map(line => `${style.prefix} ${line}`)
            .join('\n') + '\n';
    }
}

function wrapLine(line: string, maxLength: number = 100): string[] {
    const words = line.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).length <= maxLength) {
            currentLine = currentLine ? `${currentLine} ${word}` : word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}

export function deactivate() {}