/**
 * Newline to Comma Converter Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 */

class NewlineToComma {
    constructor() {
        this.inputData = document.getElementById('inputData');
        this.outputData = document.getElementById('outputData');
        this.addQuotes = document.getElementById('addQuotes');
        this.trimWhitespace = document.getElementById('trimWhitespace');
        this.removeEmpty = document.getElementById('removeEmpty');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.init();
    }

    init() {
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadText());
        }
        
        this.inputData.addEventListener('input', () => this.format());
        if (this.addQuotes) {
            this.addQuotes.addEventListener('change', () => this.format());
        }
        if (this.trimWhitespace) {
            this.trimWhitespace.addEventListener('change', () => this.format());
        }
        if (this.removeEmpty) {
            this.removeEmpty.addEventListener('change', () => this.format());
        }
        
        this.inputData.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.format();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
            e.preventDefault();
            this.clearAll();
        }
    }

    format() {
        try {
            const input = this.inputData.value;
            
            if (!input.trim()) {
                this.outputData.value = '';
                return;
            }

            let lines = input.split('\n');

            if (this.trimWhitespace && this.trimWhitespace.checked) {
                lines = lines.map(line => line.trim());
            }

            if (this.removeEmpty && this.removeEmpty.checked) {
                lines = lines.filter(line => line.length > 0);
            }

            if (this.addQuotes && this.addQuotes.value !== 'none') {
                const quote = this.addQuotes.value === 'double' ? '"' : "'";
                lines = lines.map(line => `${quote}${line}${quote}`);
            }

            const output = lines.join(', ');
            this.outputData.value = output;
        } catch (error) {
            SharedUtilities.showNotification('Formatting error: ' + error.message, 'error');
        }
    }

    clearAll() {
        this.inputData.value = '';
        this.outputData.value = '';
        SharedUtilities.showNotification('Cleared all data', 'success');
        this.inputData.focus();
    }

    copyToClipboard() {
        const text = this.outputData.value;
        if (!text) {
            this.showError('No text to copy. Please format some data first.');
            return;
        }

        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        SharedUtilities.showNotification('Copied to clipboard', 'success');
    }

    downloadText() {
        const text = this.outputData.value;
        if (!text) {
            SharedUtilities.showNotification('No data to download', 'warning');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'newline-to-comma.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        SharedUtilities.showNotification('File downloaded', 'success');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.newlineToComma = new NewlineToComma();
});
