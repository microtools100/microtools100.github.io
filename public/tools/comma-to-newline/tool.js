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
            trimWhitespace: document.getElementById('trimWhitespace')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        this.elements.copyBtn.addEventListener('click', () => this.copyOutput());
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Auto-format on input
        this.elements.inputData.addEventListener('input', () => this.format());
        this.elements.separator.addEventListener('change', () => this.format());
        this.elements.removeQuotes.addEventListener('change', () => this.format());
        this.elements.trimWhitespace.addEventListener('change', () => this.format());
    }

    format() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            this.elements.outputData.value = '';
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
    }

    clear() {
        this.elements.inputData.value = '';
        this.elements.outputData.value = '';
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
