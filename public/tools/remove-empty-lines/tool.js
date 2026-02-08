class RemoveEmptyLines {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.processBtn = document.getElementById('processBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.trimWhitespace = document.getElementById('trimWhitespace');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.processBtn.addEventListener('click', () => this.process());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    process() {
        const text = this.inputText.value;
        if (!text) {
            showNotification('Please enter some text', 'error');
            return;
        }

        const lines = text.split('\n');
        let cleaned = lines.filter(line => line.trim().length > 0);
        
        // Apply trimming if option is checked
        if (this.trimWhitespace.checked) {
            cleaned = cleaned.map(line => line.trim());
        }
        
        this.outputText.value = cleaned.join('\n');
    }

    copy() {
        const text = this.outputText.value;
        if (!text) {
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
        if (!text) {
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

    clear() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.inputText.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RemoveEmptyLines();
});