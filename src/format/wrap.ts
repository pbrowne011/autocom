/*
 * wrapLine - wrap input line to fit in specified width
 */

const TAB_WIDTH = 4;

function adjust_column(c: string, column: number): number {
    if (c.length > 1) {
        throw new Error("not a character");
    }
    if (c === '\b') {
        column = (column > 0) ? (column-1) : (column);
    } else if (c === '\r') {
        column = 0;
    } else if (c === '\t') {
        column += TAB_WIDTH - (column % TAB_WIDTH);
    } else {
        column++;
    }
    return column;
}

export function wrapLine(line: string, width: number = 100): string[] {
    if (!line) {
        return [];
    }
    const leadingWhitespace = line.match(/^\s+/)?.[0] || '';
    let effectiveLine = line.slice(leadingWhitespace.length);
    let lines: string[] = [];
    let words = effectiveLine.split(/(\s+)/);
    let currentLine = leadingWhitespace;  // Start with leading whitespace
    let column = 0;

    // Calculate initial column position including leading whitespace
    for (const char of leadingWhitespace) {
        column = adjust_column(char, column);
    }

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        if (word.includes('\n')) {
            const parts = word.split('\n');
            parts.forEach((part, index) => {
                if (index === 0) {
                    currentLine += part;
                } else {
                    lines.push(currentLine.trimEnd());
                    currentLine = part;
                    column = 0;
                    for (const char of part) {
                        column = adjust_column(char, column);
                    }
                }
            });
            continue;
        }

        let wordWidth = 0;
        for (const char of word) {
            wordWidth = adjust_column(char, wordWidth);
        }

        if (column + wordWidth > width && currentLine.trimEnd()) {
            lines.push(currentLine.trimEnd());
            currentLine = word.trimStart();
            column = 0;
        } else {
            currentLine += word;
            column += wordWidth;
        }
    }
    
    if (currentLine) {
        lines.push(currentLine.trimEnd());
    }

    return lines.filter(line => line.length > 0);
}