class DuplicateWordRemover {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.caseSensitive = document.getElementById('caseSensitive');
        this.processBtn = document.getElementById('processBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.processBtn.addEventListener('click', () => this.removeDuplicates());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
    }

    removeDuplicates() {
        const text = this.inputText.value;
        if (!text.trim()) {
            showNotification('Please enter some text', 'error');
            return;
        }

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const cleaned = [];
        let lastWord = '';

        for (const word of words) {
            const compareWord = this.caseSensitive.checked ? word : word.toLowerCase();
            const compareLast = this.caseSensitive.checked ? lastWord : lastWord.toLowerCase();

            if (compareWord !== compareLast) {
                cleaned.push(word);
                lastWord = word;
            }
        }

        this.outputText.value = cleaned.join(' ');
    }

    clear() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.inputText.focus();
    }

    copy() {
        const text = this.outputText.value;
        if (!text.trim()) {
            showNotification('Nothing to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    download() {
        const text = this.outputText.value;
        if (!text.trim()) {
            showNotification('Nothing to download', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cleaned-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DuplicateWordRemover();
});