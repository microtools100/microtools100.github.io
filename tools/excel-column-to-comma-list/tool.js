// CSV Formatter Tool
class CSVFormatter {
    constructor() {
        this.elements = {
            inputData: document.getElementById('inputData'),
            outputData: document.getElementById('outputData'),
            clearBtn: document.getElementById('clearBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            separator: document.getElementById('separator'),
            addQuotes: document.getElementById('addQuotes'),
            trimWhitespace: document.getElementById('trimWhitespace'),
            removeEmpty: document.getElementById('removeEmpty'),
            charCount: document.getElementById('charCount'),
            outputCount: document.getElementById('outputCount'),
            itemCount: document.getElementById('itemCount')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCharCount();
    }

    setupEventListeners() {
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Real-time formatting on input
        this.elements.inputData.addEventListener('input', () => {
            this.updateCharCount();
            this.format();
        });
        
        // Format when options change
        this.elements.separator.addEventListener('change', () => this.format());
        this.elements.addQuotes.addEventListener('change', () => this.format());
        this.elements.trimWhitespace.addEventListener('change', () => this.format());
        this.elements.removeEmpty.addEventListener('change', () => this.format());
    }

    formatWithoutAutoCopy() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            this.elements.outputData.value = '';
            this.updateCharCount();
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

        // Get separator and handle tab character
        let separator = this.elements.separator.value;
        if (separator === '\\t') {
            separator = '\t';
        }

        // Join with separator
        const output = lines.join(separator);

        this.elements.outputData.value = output;
        this.updateCharCount();
    }
    
    executeCopy() {
        const outputText = this.elements.outputData.value;
        if (outputText) {
            SharedUtilities.copyToClipboardSilently(outputText);
            SharedUtilities.showNotification('Copied to clipboard', 'success');
        }
    }

    format() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            SharedUtilities.showNotification('Please paste some data', 'warning');
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
            SharedUtilities.copyToClipboardSilently(output);
            // Show success message
            SharedUtilities.showNotification('Copied to clipboard', 'success');
        }, 10);
    }

    clear() {
        SharedUtilities.clearElements(
            { inputData: this.elements.inputData, outputData: this.elements.outputData },
            { 
                message: 'Cleared all data',
                onClear: () => this.updateCharCount()
            }
        );
    }

    updateCharCount() {
        // Update input character count
        const inputLength = this.elements.inputData.value.length;
        
        // Update output character count
        const outputLength = this.elements.outputData.value.length;
        this.elements.outputCount.textContent = outputLength;
        
        // Update item count based on current input
        const input = this.elements.inputData.value.trim();
        if (input.length > 0) {
            let lines = input.split('\n');
            
            // Apply the same filters that are enabled
            if (this.elements.trimWhitespace.checked) {
                lines = lines.map(line => line.trim());
            }
            
            if (this.elements.removeEmpty.checked) {
                lines = lines.filter(line => line.length > 0);
            }
            
            this.elements.itemCount.textContent = lines.length;
            this.elements.charCount.textContent = inputLength;
        } else {
            this.elements.itemCount.textContent = 0;
            this.elements.charCount.textContent = 0;
        }
    }

    async copyToClipboard() {
        const output = this.elements.outputData.value;
        
        if (!output) {
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        await SharedUtilities.copyToClipboard(output, 'Copied to clipboard!', 'success');
    }

    download() {
        const output = this.elements.outputData.value;
        SharedUtilities.downloadAsFile(output, 'formatted-data.txt', 'text/plain', {
            successMessage: 'File downloaded'
        });
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.csvFormatter = new CSVFormatter();
});
