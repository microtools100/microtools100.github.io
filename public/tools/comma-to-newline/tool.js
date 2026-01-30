// Comma to Newline Converter
class CommaToNewlineConverter {
    constructor() {
        this.elements = {
            inputData: document.getElementById('inputData'),
            outputData: document.getElementById('outputData'),
            formatBtn: document.getElementById('formatBtn'),
            clearBtn: document.getElementById('clearBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            separator: document.getElementById('separator'),
            removeQuotes: document.getElementById('removeQuotes'),
            trimWhitespace: document.getElementById('trimWhitespace'),
            inputCount: document.getElementById('inputCount'),
            outputCount: document.getElementById('outputCount')
        };

        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(() => this.autoCopy());
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
        
        // Auto-format on input with keystroke delay for auto-copy
        this.elements.inputData.addEventListener('input', () => {
            this.debouncedFormat();
        });
        
        this.elements.separator.addEventListener('change', () => {
            this.debouncedFormat();
        });
        
        this.elements.removeQuotes.addEventListener('change', () => {
            this.debouncedFormat();
        });
        
        this.elements.trimWhitespace.addEventListener('change', () => {
            this.debouncedFormat();
        });
        
        this.elements.outputData.addEventListener('input', () => this.updateCharCount());
    }

    debouncedFormat() {
        this.format();
        this.keystrokeDelay.schedule();
    }

    format() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            this.elements.outputData.value = '';
            this.updateCharCount();
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
        this.updateCharCount();
    }

    autoCopy() {
        const outputText = this.elements.outputData.value;
        if (outputText) {
            navigator.clipboard.writeText(outputText).then(() => {
                SharedUtilities.showNotification('Copied to clipboard', 'success');
            }).catch(() => {
                SharedUtilities.showNotification('Failed to copy', 'error');
            });
        }
    }

    clear() {
        this.elements.inputData.value = '';
        this.elements.outputData.value = '';
        this.updateCharCount();
        SharedUtilities.showNotification('Cleared all data', 'success');
    }

    updateCharCount() {
        this.elements.inputCount.textContent = this.elements.inputData.value.length;
        this.elements.outputCount.textContent = this.elements.outputData.value.length;
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
