// CSV Formatter Tool
class CSVFormatter {
    constructor() {
        this.elements = {
            inputData: document.getElementById('inputData'),
            outputData: document.getElementById('outputData'),
            formatBtn: document.getElementById('formatBtn'),
            clearBtn: document.getElementById('clearBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            separator: document.getElementById('separator'),
            addQuotes: document.getElementById('addQuotes'),
            trimWhitespace: document.getElementById('trimWhitespace'),
            removeEmpty: document.getElementById('removeEmpty'),
            inputCount: document.getElementById('inputCount'),
            outputCount: document.getElementById('outputCount')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCharCount();
    }

    setupEventListeners() {
        this.elements.formatBtn.addEventListener('click', () => this.format());
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Auto-format on input for real-time conversion
        this.elements.inputData.addEventListener('input', () => {
            this.updateCharCount();
            // Auto-format if text is short enough
            if (this.elements.inputData.value.trim().length > 0 && this.elements.inputData.value.length <= 200) {
                this.format();
            }
        });
        
        this.elements.outputData.addEventListener('input', () => this.updateCharCount());
    }

    format() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            this.showNotification('Please paste some data', 'warning');
            return;
        }

        let lines = input.split('\n');

        // Trim whitespace if enabled
        if (this.elements.trimWhitespace.checked) {
            lines = lines.map(line => line.trim());
        }

        // Remove empty lines if enabled
        if (this.elements.removeEmpty.checked) {
            lines = lines.filter(line => line.length > 0);
        }

        // Add quotes if enabled
        const quoteType = this.elements.addQuotes.value;
        if (quoteType !== 'none') {
            const quote = quoteType === 'double' ? '"' : "'";
            lines = lines.map(line => `${quote}${line}${quote}`);
        }

        // Get separator
        let separator = this.elements.separator.value;
        if (separator === '\\t') {
            separator = '\t';
        }

        // Join with separator
        const output = lines.join(separator);

        this.elements.outputData.value = output;
        this.updateCharCount();
        
        // Auto-copy to clipboard with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.copyToClipboardSilently(output);
            // Show success message
            this.showNotification('Copied to clipboard', 'success');
        }, 10);
    }

    clear() {
        this.elements.inputData.value = '';
        this.elements.outputData.value = '';
        this.updateCharCount();
        this.showNotification('Cleared all data', 'info');
    }

    updateCharCount() {
        this.elements.inputCount.textContent = this.elements.inputData.value.length;
        this.elements.outputCount.textContent = this.elements.outputData.value.length;
    }

    async copyToClipboard() {
        const output = this.elements.outputData.value;
        
        if (!output) {
            this.showNotification('Nothing to copy', 'warning');
            return;
        }

        if (window.MicroTools?.utils?.copyToClipboard) {
            await window.MicroTools.utils.copyToClipboard(output, this.elements.copyBtn);
        } else {
            // Fallback copy method
            const textarea = document.createElement('textarea');
            textarea.value = output;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Copied to clipboard!', 'success');
        }
    }

    copyToClipboardSilently(text) {
        // Copy without showing notification (used for auto-copy)
        try {
            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => {
                    // Fallback if clipboard API fails
                    this.fallbackCopy(text);
                });
            } else {
                // Fallback for older browsers
                this.fallbackCopy(text);
            }
        } catch (err) {
            // Final fallback
            this.fallbackCopy(text);
        }
    }
    
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textarea);
    }

    download() {
        const output = this.elements.outputData.value;
        
        if (!output) {
            this.showNotification('Nothing to download', 'warning');
            return;
        }

        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted-data.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('File downloaded', 'success');
    }

    showNotification(message, type = 'info') {
        if (window.MicroTools?.utils?.showNotification) {
            window.MicroTools.utils.showNotification(message, type);
        } else {
            console.log(`${type}: ${message}`);
            alert(message);
        }
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.csvFormatter = new CSVFormatter();
});
