class StringCaseConverter {
    constructor() {
        this.inputElement = document.getElementById('inputString');
        this.copyButtons = document.querySelectorAll('.copy-btn');
        this.clearBtn = document.getElementById('clearBtn');
        this.formats = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'CONSTANT_CASE', 'dot.case', 'space case', 'Title Case'];
        
        this.init();
    }

    init() {
        this.inputElement.addEventListener('input', () => this.updateOutputs());
        this.copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.copySingle(e));
        });
        this.clearBtn.addEventListener('click', () => this.clear());

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
            alert('No output to copy. Please enter text first.');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '✓';
            btn.style.background = '#28a745';
            btn.style.color = 'white';
            btn.style.borderColor = '#28a745';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 1500);
        }).catch(() => {
            alert('Failed to copy. Please try again.');
        });
    }

    clear() {
        this.inputElement.value = '';
        this.updateOutputs();
        this.inputElement.focus();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new StringCaseConverter();
    });
} else {
    new StringCaseConverter();
}
