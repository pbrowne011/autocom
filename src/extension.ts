import * as vscode from 'vscode';
import { getGenerator } from './generators';
import { Provider } from './types/models';
import { formatComment } from './format';

export async function activate(context: vscode.ExtensionContext) {
    async function generateComment(provider: Provider, context: vscode.ExtensionContext) {
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
    
        const status = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );
        status.text = "$(loading~spin) Generating comment...";
        status.show();
    
        try {
            const generator = getGenerator(provider, context);
            const comment = await generator.generateComment(selectedText);
        
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
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to generate comment: ${error instanceof Error ? error.message : String(error)}`
            );
        } finally {
            status.hide();
        }
    }

    let anthropicCommand = vscode.commands.registerCommand(
        'ai-commenter.anthropicComment',
        async () => await generateComment('anthropic', context)
    );
    
    let openaiCommand = vscode.commands.registerCommand(
        'ai-commenter.openaiComment',
        async () => await generateComment('openai', context)
    );
    
    let codeLensProvider = new CommentCodeLensProvider();
    let codeLensDisposable = vscode.languages.registerCodeLensProvider('*', codeLensProvider);
    
    let selectionDisposable = vscode.window.onDidChangeTextEditorSelection(() => {
        codeLensProvider.refresh();
    });

    context.subscriptions.push(
        anthropicCommand,
        openaiCommand,
        codeLensDisposable,
        selectionDisposable
    );
}

class CommentCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    provideCodeLenses(_document: vscode.TextDocument): vscode.CodeLens[] {
        const editor = vscode.window.activeTextEditor;
        if (!editor || 
            editor.document !== _document || 
            editor.selection.isEmpty) {
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

    public refresh(): void {
        this._onDidChangeCodeLenses.fire();
    }
}

export function deactivate() {}