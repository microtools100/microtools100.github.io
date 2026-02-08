class TextRepeater {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.repeatCount = document.getElementById('repeatCount');
        this.separatorPreset = document.getElementById('separatorPreset');
        this.separator = document.getElementById('separator');
        this.outputText = document.getElementById('outputText');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.repeatBtn.addEventListener('click', () => this.repeat());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.separatorPreset.addEventListener('change', () => this.updateSeparator());
    }

    updateSeparator() {
        const preset = this.separatorPreset.value;
        switch (preset) {
            case 'space':
                this.separator.value = ' ';
                break;
            case 'newline':
                this.separator.value = '\\n';
                break;
            case 'tab':
                this.separator.value = '\\t';
                break;
            case 'comma':
                this.separator.value = ', ';
                break;
            case 'custom':
                this.separator.value = '';
                this.separator.focus();
                break;
        }
    }

    repeat() {
        const text = this.textInput.value;
        const count = parseInt(this.repeatCount.value) || 1;

        if (!text) {
            showNotification('Please enter text', 'error');
            return;
        }

        if (count < 1 || count > 1000) {
            showNotification('Count must be between 1 and 1000', 'error');
            return;
        }

        let sep = this.separator.value;
        // Handle special escape sequences
        sep = sep.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

        const result = Array(count).fill(text).join(sep);
        this.outputText.value = result;
    }

    clear() {
        this.textInput.value = '';
        this.outputText.value = '';
        this.textInput.focus();
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
        a.download = 'repeated-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TextRepeater();
});