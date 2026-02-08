class LineNumbering {
    constructor() {
        this.inputElement = document.getElementById('inputText');
        this.outputElement = document.getElementById('outputText');
        this.formatSelect = document.getElementById('numberFormat');
        this.startNumberInput = document.getElementById('startNumber');
        this.paddingInput = document.getElementById('padding');
        this.skipEmptyCheckbox = document.getElementById('skipEmpty');
        this.formatBtn = document.getElementById('addNumbersBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.formatBtn.addEventListener('click', () => this.format());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    format() {
        const text = this.inputElement.value;
        if (!text.trim()) {
            showNotification('Please enter some text', 'error');
            return;
        }

        const lines = text.split('\n');
        const format = this.formatSelect.value;
        const startNum = parseInt(this.startNumberInput.value) || 1;
        const padding = parseInt(this.paddingInput.value) || 0;
        const skipEmpty = this.skipEmptyCheckbox.checked;

        const numbered = lines.map((line, index) => {
            if (skipEmpty && !line.trim()) {
                return line;
            }

            const lineNum = startNum + index;
            const paddedNum = this.padNumber(lineNum, padding);
            return this.formatLine(paddedNum, line, format);
        });

        this.outputElement.value = numbered.join('\n');
    }

    padNumber(num, width) {
        if (width <= 0) return num.toString();
        return num.toString().padStart(width, '0');
    }

    formatLine(num, text, format) {
        switch (format) {
            case 'period':
                return `${num}. ${text}`;
            case 'paren':
                return `${num}) ${text}`;
            case 'bracket':
                return `[${num}] ${text}`;
            case 'colon':
                return `${num}: ${text}`;
            default:
                return `${num}. ${text}`;
        }
    }

    copy() {
        const text = this.outputElement.value;
        if (!text.trim()) {
            showNotification('Nothing to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            showNotification('Failed to copy', 'error');
        });
    }

    download() {
        const text = this.outputElement.value;
        if (!text.trim()) {
            showNotification('Nothing to download', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'numbered-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clear() {
        this.inputElement.value = '';
        this.outputElement.value = '';
        this.inputElement.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LineNumbering();
});