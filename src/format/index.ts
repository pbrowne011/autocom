import { getCommentStyle } from './lang';
import { wrapLine } from './wrap';

export function formatComment(comment: string, language: string, useBlockComment: boolean = true): string {
    const style = getCommentStyle(language);
    

    if (!style.block || !useBlockComment) {
        return comment
            .split('\n')
            .flatMap(line => wrapLine(line))
            .map(line => `${style.prefix} ${line.trim()}`)
            .join('\n') + '\n';
    }

    const lines = comment
        .split('\n')
        .map(line => line.trim())
        .flatMap(line => wrapLine(line));
        
    // Single-line comment: use simple block format
    if (lines.length === 1) {
        return `${style.block.start} ${lines[0]} ${style.block.end}\n`;
    }
        
    // Multi-line comment
    const isJSDoc = style.block.start === '/**';
    
    return [
        style.block.start,
        ...lines.map(line => ` * ${line}`),
        isJSDoc ? ' */' : style.block.end,
        ''
    ].join('\n');
}