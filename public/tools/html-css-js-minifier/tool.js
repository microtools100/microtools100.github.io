class CodeMinifier {
    constructor() {
        this.inputCode = document.getElementById('inputCode');
        this.outputCode = document.getElementById('outputCode');
        this.codeType = document.getElementById('codeType');
        this.removeLineBreaks = document.getElementById('removeLineBreaks');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.minifyBtn.addEventListener('click', () => this.minify());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    minifyHTML(html) {
        return html
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/>\s+</g, '><')
            .replace(/\s+/g, ' ')
            .trim();
    }

    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}:;,])\s*/g, '$1')
            .replace(/;}/g, '}')
            .trim();
    }

    minifyJS(js) {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}:;,()[\]=+\-*/<>!&|])\s*/g, '$1')
            .replace(/;\s*}/g, '}')
            .trim();
    }

    minify() {
        const code = this.inputCode.value;
        if (!code.trim()) {
            showNotification('Please enter code to minify', 'error');
            return;
        }

        const type = this.codeType.value;
        let minified;

        switch (type) {
            case 'html':
                minified = this.minifyHTML(code);
                break;
            case 'css':
                minified = this.minifyCSS(code);
                break;
            case 'js':
                minified = this.minifyJS(code);
                break;
            default:
                minified = code;
        }

        if (!this.removeLineBreaks.checked) {
            minified = minified;
        }

        const originalSize = (code.length / 1024).toFixed(2);
        const minifiedSize = (minified.length / 1024).toFixed(2);
        const savings = (((code.length - minified.length) / code.length) * 100).toFixed(1);

        this.outputCode.value = minified;
        showNotification(`Saved ${savings}% (${originalSize}KB → ${minifiedSize}KB)`, 'success');
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
        a.download = `minified.${ext}`;
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
    new CodeMinifier();
});