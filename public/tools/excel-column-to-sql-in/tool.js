// Excel Column to SQL IN List
class ExcelColumnToSqlIn {
    constructor() {
        this.autoCopyDelay = 500; // 0.5 second delay before auto-copying
        this.keystrokeDelay = null; // Keystroke delay handler
        this.elements = {
            inputData: document.getElementById('inputData'),
            outputData: document.getElementById('outputData'),
            formatBtn: document.getElementById('formatBtn'),
            clearBtn: document.getElementById('clearBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            quoteType: document.getElementById('quoteType'),
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
        
        this.elements.inputData.addEventListener('input', () => {
            this.updateCharCount();
            // Always format in real-time - no character limit
            if (this.elements.inputData.value.trim().length > 0) {
                this.formatWithoutAutoCopy();
                this.keystrokeDelay.schedule();
            }
        });
        
        this.elements.outputData.addEventListener('input', () => this.updateCharCount());
    }

    formatWithoutAutoCopy() {
        const input = this.elements.inputData.value;
        
        if (!input.trim()) {
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

        // Add quotes based on type
        const quoteType = this.elements.quoteType.value;
        if (quoteType !== 'none') {
            const quote = quoteType === 'double' ? '"' : "'";
            lines = lines.map(line => `${quote}${line}${quote}`);
        }

        // Join with IN clause
        const output = lines.length > 0 ? `(${lines.join(', ')})` : '';

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

        // Add quotes based on type
        const quoteType = this.elements.quoteType.value;
        if (quoteType !== 'none') {
            const quote = quoteType === 'single' ? "'" : '"';
            lines = lines.map(line => `${quote}${line}${quote}`);
        }

        // Join with comma and space, wrap in parentheses
        const output = '(' + lines.join(',') + ')';

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
        this.elements.inputCount.textContent = this.elements.inputData.value.length;
        this.elements.outputCount.textContent = this.elements.outputData.value.length;
    }

    download() {
        const output = this.elements.outputData.value;
        SharedUtilities.downloadAsFile(output, 'sql-in-list.sql', 'text/plain', {
            successMessage: 'File downloaded'
        });
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.excelColumnToSqlIn = new ExcelColumnToSqlIn();
});
