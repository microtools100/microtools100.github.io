class CodeBeautifier {
    constructor() {
        this.inputCode = document.getElementById('inputCode');
        this.outputCode = document.getElementById('outputCode');
        this.codeType = document.getElementById('codeType');
        this.indentSize = document.getElementById('indentSize');
        this.beautifyBtn = document.getElementById('beautifyBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.beautifyBtn.addEventListener('click', () => this.beautify());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    beautifyHTML(html, indent) {
        const indentStr = ' '.repeat(indent);
        let level = 0;
        let formatted = '';

        html.split(/(<[^>]+>)/g).forEach(token => {
            if (!token.trim()) return;

            if (token.startsWith('</')) {
                level = Math.max(0, level - 1);
                formatted += indentStr.repeat(level) + token + '\n';
            } else if (token.startsWith('<') && !token.endsWith('/>')) {
                formatted += indentStr.repeat(level) + token + '\n';
                if (!token.match(/(\/|^<(br|hr|img|input|meta|link))/i)) {
                    level++;
                }
            } else if (token.trim()) {
                formatted += indentStr.repeat(level) + token.trim() + '\n';
            }
        });

        return formatted.trim();
    }

    beautifyCSS(css, indent) {
        const indentStr = ' '.repeat(indent);
        let formatted = css
            .replace(/\{/g, ' {\n')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .replace(/,/g, ',\n');

        let lines = formatted.split('\n');
        let level = 0;
        let result = '';

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.includes('}')) level = Math.max(0, level - 1);
            result += indentStr.repeat(level) + line + '\n';
            if (line.includes('{')) level++;
        });

        return result.trim();
    }

    beautifyJS(js, indent) {
        const indentStr = ' '.repeat(indent);
        let formatted = js
            .replace(/\{/g, ' {\n')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .replace(/,/g, ',\n');

        let lines = formatted.split('\n');
        let level = 0;
        let result = '';

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.match(/^[}\]]/)) level = Math.max(0, level - 1);
            result += indentStr.repeat(level) + line + '\n';
            if (line.match(/[\{\[:]$/)) level++;
        });

        return result.trim();
    }

    beautify() {
        const code = this.inputCode.value;
        if (!code.trim()) {
            showNotification('Please enter code to beautify', 'error');
            return;
        }

        const type = this.codeType.value;
        const indent = parseInt(this.indentSize.value) || 2;
        let beautified;

        switch (type) {
            case 'html':
                beautified = this.beautifyHTML(code, indent);
                break;
            case 'css':
                beautified = this.beautifyCSS(code, indent);
                break;
            case 'js':
                beautified = this.beautifyJS(code, indent);
                break;
            default:
                beautified = code;
        }

        this.outputCode.value = beautified;
        showNotification('Code beautified!', 'success');
    }

    copy() {
        navigator.clipboard.writeText(this.outputCode.value).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    download() {
        const ext = this.codeType.value === 'html' ? 'html' : this.codeType.value === 'css' ? 'css' : 'js';
        const blob = new Blob([this.outputCode.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `beautified.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clear() {
        this.inputCode.value = '';
        this.outputCode.value = '';
        this.inputCode.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CodeBeautifier();
});