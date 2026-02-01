// String Case Converter Tool - Standardized Implementation

class StringCaseConverter {
    constructor() {
        // Element references
        this.inputElement = document.getElementById('inputString');
        this.copyButtons = document.querySelectorAll('.copy-btn');
        this.clearBtn = document.getElementById('clearBtn');
        this.formats = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'CONSTANT_CASE', 'dot.case', 'space case', 'Title Case'];
        
        this.init();
    }

    init() {
        // Input listener for real-time conversion
        this.inputElement.addEventListener('input', () => this.updateOutputs());
        
        // Copy button listeners
        this.copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.copySingle(e));
        });

        // Clear button listener
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }

        // Keyboard shortcuts: Ctrl+A to select all, Ctrl+K to clear
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'k' || e.key === 'K') {
                    e.preventDefault();
                    this.clearAll();
                }
            }
        });

        // Set initial state
        this.updateOutputs();
    }

    updateOutputs() {
        const input = this.inputElement.value.trim();
        
        this.formats.forEach(format => {
            const outputElement = document.getElementById(this.getOutputId(format));
            
            if (input) {
                const converted = this.convertToFormat(input, format);
                outputElement.textContent = converted;
            } else {
                outputElement.textContent = '';
            }
        });
    }

    getOutputId(format) {
        // Convert format name to HTML ID
        if (format === 'space case') return 'output-space-case';
        if (format === 'Title Case') return 'output-Title-Case';
        return `output-${format}`;
    }

    convertToFormat(input, format) {
        // First, normalize the input to an array of words
        const words = this.extractWords(input);
        
        if (words.length === 0) return '';

        switch (format) {
            case 'camelCase':
                return words.map((word, index) => 
                    index === 0 ? word.toLowerCase() : this.capitalize(word)
                ).join('');
            
            case 'PascalCase':
                return words.map(word => this.capitalize(word)).join('');
            
            case 'snake_case':
                return words.map(word => word.toLowerCase()).join('_');
            
            case 'kebab-case':
                return words.map(word => word.toLowerCase()).join('-');
            
            case 'CONSTANT_CASE':
                return words.map(word => word.toUpperCase()).join('_');
            
            case 'dot.case':
                return words.map(word => word.toLowerCase()).join('.');
            
            case 'space case':
                return words.map(word => word.toLowerCase()).join(' ');
            
            case 'Title Case':
                return words.map(word => this.capitalize(word)).join(' ');
            
            default:
                return input;
        }
    }

    extractWords(input) {
        // Remove special characters but keep spaces and hyphens as delimiters
        let text = input.replace(/[^a-zA-Z0-9\s\-_]/g, '');
        
        // Split by common delimiters: spaces, hyphens, underscores
        let parts = text.split(/[\s\-_]+/);
        
        // Further split camelCase and PascalCase
        const words = [];
        parts.forEach(part => {
            if (part.length === 0) return;
            
            // Split camelCase: insert space before capital letters
            const camelSplit = part.replace(/([a-z])([A-Z])/g, '$1 $2')
                                   .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
            
            // Split numbers: separate from letters
            const numberSplit = camelSplit.replace(/([a-zA-Z])(\d)/g, '$1 $2')
                                        .replace(/(\d)([a-zA-Z])/g, '$1 $2');
            
            // Split by spaces and filter out empty strings
            const subWords = numberSplit.split(/\s+/).filter(w => w.length > 0);
            words.push(...subWords);
        });
        
        return words;
    }

    capitalize(word) {
        if (word.length === 0) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    copySingle(e) {
        const btn = e.currentTarget;
        const format = btn.dataset.format;
        const outputElement = document.getElementById(this.getOutputId(format));
        const text = outputElement.textContent;

        if (!text) {
            SharedUtilities.showNotification('No output to copy. Please enter text first.', 'warning');
            return;
        }

        this.copyToClipboard(text, `Copied ${format}!`);
    }

    copyToClipboard(text, successMessage = 'Copied to clipboard!') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        SharedUtilities.showNotification(successMessage, 'success');
    }

    clearAll() {
        this.inputElement.value = '';
        this.updateOutputs();
        this.inputElement.focus();
        SharedUtilities.showNotification('Cleared input', 'info');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.stringCaseConverter = new StringCaseConverter();
});
