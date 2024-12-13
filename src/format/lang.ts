export interface CommentStyle {
    prefix?: string;
    block?: {
        start: string;
        end: string;
    };
}

export function getCommentStyle(language: string): CommentStyle {
    const styles: { [key: string]: CommentStyle } = {
        // Assembly languages (# ; %)
        //
        // TODO: allow more types of comment prefix for NASM assemblers etc
        // For now, default to GNU syntax
        'arm-asm': {
            prefix: '#'  // Most GNU assemblers use #, some use ; or %
        },
        'x86-asm': {
            prefix: '#'  // Most GNU assemblers use #, some use ; or %
        },
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
        c: {
            prefix: '//',
            block: { start: '/*', end: ' */' }
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
        },
        bash: {
            prefix: ''
        },
        sh: {
            prefix: '#'
        },
        zsh: {
            prefix: '#'
        },
        html: {
            block: { start: '<!--',  end: ' -->' }
        },
        css: {
            block: { start: '/*', end: ' */' }
        },
    };

    const defaultStyle = {
        prefix: '//',
        block: { start: '/*', end: ' */' }
    };

    return styles[language] || defaultStyle;
}