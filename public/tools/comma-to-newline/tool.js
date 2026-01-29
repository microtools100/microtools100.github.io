// Comma to Newline Converter
class CommaToNewlineConverter {
    constructor() {
        this.autoCopyDelay = 500; // 0.5 second delay before auto-copying
        this.keystrokeDelay = null; // Keystroke delay handler
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

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCharCount();
        // Initialize keystroke delay handler using global utility
        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(
            () => this.executeCopy(),
            this.autoCopyDelay
        );
    }

    setupEventListeners() {
        this.elements.formatBtn.addEventListener('click', () => this.format());
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Auto-format on input for real-time conversion with keystroke delay for auto-copy
        this.elements.inputData.addEventListener('input', () => {
            this.updateCharCount();
            if (this.elements.inputData.value.trim().length > 0) {
                this.formatWithoutAutoCopy();
                this.keystrokeDelay.schedule();
            }
        });
        
        this.elements.outputData.addEventListener('input', () => this.updateCharCount());
    }

    format() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
            SharedUtilities.showNotification('Please paste some data', 'warning');
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
    
    executeCopy() {
        const outputText = this.elements.outputData.value;
        if (outputText) {
            this.copyToClipboardSilently(outputText);
            SharedUtilities.showNotification('Copied to clipboard', 'success');
        }
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
        this.elements.inputCount.textContent = this.elements.inputData.value.length;
        this.elements.outputCount.textContent = this.elements.outputData.value.length;
    }
    
    formatWithoutAutoCopy() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
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
    
    scheduleAutoCopy() {
        // Clear existing timeout
        if (this.autoCopyTimeout) {
            clearTimeout(this.autoCopyTimeout);
        }
        
        // Schedule new auto-copy after delay
        this.autoCopyTimeout = setTimeout(() => {
            const outputText = this.elements.outputData.value;
            if (outputText) {
                SharedUtilities.copyToClipboardSilently(outputText);
                SharedUtilities.showNotification('Copied to clipboard', 'success');
            }
        }, this.autoCopyDelay);
    }

    format() {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => {
                    SharedUtilities.fallbackCopy(text);
                });
            } else {
                SharedUtilities.fallbackCopy(text);
            }
        } catch (err) {
            SharedUtilities.fallbackCopy(text);
        }
    }
    
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.setSelectionRange(0, textarea.value.length);
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    download() {
        const output = this.elements.outputData.value;
        SharedUtilities.downloadAsFile(output, 'comma-to-newline.txt', 'text/plain', {
            successMessage: 'File downloaded'
        });
    }
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.commaToNewlineConverter = new CommaToNewlineConverter();
});
