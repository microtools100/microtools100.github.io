/**
 * Quote Comma Formatter Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 */

class QuoteCommaFormatter {
    constructor() {
        this.inputData = document.getElementById('inputData') || document.getElementById('inputText');
        this.outputData = document.getElementById('outputData') || document.getElementById('outputText');
        this.quoteType = document.getElementById('quoteType');
        this.delimiter = document.getElementById('delimiter');
        this.trimWhitespace = document.getElementById('trimWhitespace');
        this.removeEmpty = document.getElementById('removeEmpty');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.itemCount = document.getElementById('itemCount');
        this.charCount = document.getElementById('charCount');
        this.errorMsg = document.querySelector('.error-msg');
        
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
        if (this.quoteType) {
            this.quoteType.addEventListener('change', () => this.format());
        }
        if (this.delimiter) {
            this.delimiter.addEventListener('change', () => this.format());
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

    formatWithoutAutoCopy() {
        try {
            let lines = this.inputData.value.split('\n');

            if (this.removeEmpty && this.removeEmpty.checked) {
                lines = lines.filter(line => line.trim() !== '');
            }

            if (this.trimWhitespace && this.trimWhitespace.checked) {
                lines = lines.map(line => line.trim());
            }

            const quote = this.getQuote();
            lines = lines.map(line => {
                if (line === '') return '';
                return quote + line + quote;
            });

            let delim = this.delimiter ? this.delimiter.value : ', ';
            // Convert literal \n string to actual newline character
            delim = delim.replace(/\\n/g, '\n');
            const result = lines.join(delim);

            this.outputData.value = result;
            
            // Update stats
            if (this.itemCount) {
                this.itemCount.textContent = lines.filter(line => line !== '').length;
            }
            if (this.charCount) {
                this.charCount.textContent = result.length;
            }
            
            this.clearError();
        } catch (error) {
            this.showError('Formatting error: ' + error.message);
        }
    }

    format() {
        try {
            let lines = this.inputData.value.split('\n');

            if (this.removeEmpty && this.removeEmpty.checked) {
                lines = lines.filter(line => line.trim() !== '');
            }

            if (this.trimWhitespace && this.trimWhitespace.checked) {
                lines = lines.map(line => line.trim());
            }

            const quote = this.getQuote();
            lines = lines.map(line => {
                if (line === '') return '';
                return quote + line + quote;
            });

            let delim = this.delimiter ? this.delimiter.value : ', ';
            // Convert literal \n string to actual newline character
            delim = delim.replace(/\\n/g, '\n');
            const result = lines.join(delim);

            this.outputData.value = result;
            
            // Update stats
            if (this.itemCount) {
                this.itemCount.textContent = lines.filter(line => line !== '').length;
            }
            if (this.charCount) {
                this.charCount.textContent = result.length;
            }
            
            this.clearError();

            // Auto-copy to clipboard with a small delay
            if (result.trim()) {
                setTimeout(() => {
                    SharedUtilities.copyToClipboardSilently(result);
                    SharedUtilities.showNotification('Formatted and copied to clipboard', 'success');
                }, 10);
            }
        } catch (error) {
            this.showError('Formatting error: ' + error.message);
        }
    }

    getQuote() {
        if (!this.quoteType) return "'";
        const type = this.quoteType.value;
        switch(type) {
            case 'single': return "'";
            case 'double': return '"';
            case 'backtick': return '`';
            case 'none': return '';
            default: return "'";
        }
    }

    clearAll() {
        this.inputData.value = '';
        this.outputData.value = '';
        if (this.itemCount) {
            this.itemCount.textContent = '0';
        }
        if (this.charCount) {
            this.charCount.textContent = '0';
        }
        this.clearError();
        this.inputData.focus();
    }

    copyToClipboard() {
        const text = this.outputData.value;
        if (!text) {
            SharedUtilities.showNotification('No text to copy. Please format some data first.', 'warning');
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        SharedUtilities.showNotification('Copied to clipboard!', 'success');
    }

    downloadText() {
        const text = this.outputData.value;
        if (!text) {
            SharedUtilities.showNotification('No text to download. Please format some data first.', 'warning');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'formatted.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        SharedUtilities.showNotification('Downloaded formatted.txt', 'success');
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.classList.add('show');
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.classList.remove('show');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.quoteCommaFormatter = new QuoteCommaFormatter();
});
