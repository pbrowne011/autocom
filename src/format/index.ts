import { getCommentStyle } from './lang';
import { wrapLine } from './wrap';

export function formatComment(comment: string, language: string, useBlockComment: boolean = true): string {
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