export interface CommentStyle {
    prefix: string;
    blockStart?: string;
    blockEnd?: string;
}

export function getCommentStyle(language: string): CommentStyle {
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