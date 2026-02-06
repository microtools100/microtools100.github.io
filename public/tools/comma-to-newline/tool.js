// Comma to Newline Converter
class CommaToNewlineConverter {
    constructor() {
        this.elements = {
            inputData: document.getElementById('inputData'),
            outputData: document.getElementById('outputData'),
            clearBtn: document.getElementById('clearBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            separator: document.getElementById('separator'),
            removeQuotes: document.getElementById('removeQuotes'),
            trimWhitespace: document.getElementById('trimWhitespace'),
            itemCount: document.getElementById('itemCount'),
            charCount: document.getElementById('charCount')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clear());
        }
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyOutput());
        }
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.download());
        }
        
        // Auto-format on input
        this.elements.inputData.addEventListener('input', () => this.format());
        this.elements.separator.addEventListener('change', () => this.format());
        this.elements.removeQuotes.addEventListener('change', () => this.format());
        this.elements.trimWhitespace.addEventListener('change', () => this.format());
    }

    formatWithoutAutoCopy() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            this.elements.outputData.value = '';
            this.updateStats(0, 0);
            return;
        }

        let separator = this.elements.separator.value;
        let values = input.split(separator);

        // Remove quotes if enabled
        if (this.elements.removeQuotes.checked) {
            values = values.map(val => val.replace(/^['"]|['"]$/g, ''));
        }

        // Trim whitespace if enabled
        if (this.elements.trimWhitespace.checked) {
            values = values.map(val => val.trim());
        }

        // Join with newlines
        const output = values.join('\n');

        this.elements.outputData.value = output;
        
        // Update stats
        this.updateStats(values.length, output.length);
    }

    format() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            this.elements.outputData.value = '';
            this.updateStats(0, 0);
            return;
        }

        let separator = this.elements.separator.value;
        let values = input.split(separator);

        // Remove quotes if enabled
        if (this.elements.removeQuotes.checked) {
            values = values.map(val => val.replace(/^['"]|['"]$/g, ''));
        }

        // Trim whitespace if enabled
        if (this.elements.trimWhitespace.checked) {
            values = values.map(val => val.trim());
        }

        // Join with newlines
        const output = values.join('\n');

        this.elements.outputData.value = output;
        
        // Update stats
        this.updateStats(values.length, output.length);

        // Auto-copy to clipboard with a small delay
        if (output.trim()) {
            setTimeout(() => {
                SharedUtilities.copyToClipboardSilently(output);
                SharedUtilities.showNotification('Converted and copied to clipboard', 'success');
            }, 10);
        }
    }

    updateStats(items, chars) {
        if (this.elements.itemCount) {
            this.elements.itemCount.textContent = items;
        }
        if (this.elements.charCount) {
            this.elements.charCount.textContent = chars;
        }
    }

    clear() {
        this.elements.inputData.value = '';
        this.elements.outputData.value = '';
        this.updateStats(0, 0);
        SharedUtilities.showNotification('Cleared all data', 'success');
    }

    copyOutput() {
        const outputText = this.elements.outputData.value;
        if (!outputText.trim()) {
            SharedUtilities.showNotification('No data to copy', 'warning');
            return;
        }

        const textArea = document.createElement('textarea');
        textArea.value = outputText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        SharedUtilities.showNotification('Copied to clipboard', 'success');
    }

    download() {
        const output = this.elements.outputData.value;
        if (!output.trim()) {
            SharedUtilities.showNotification('No data to download', 'warning');
            return;
        }
        
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'comma-to-newline.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        SharedUtilities.showNotification('File downloaded', 'success');
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.commaToNewlineConverter = new CommaToNewlineConverter();
});
