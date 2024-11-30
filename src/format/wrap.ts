export function wrapLine(line: string, maxLength: number = 100): string[] {
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