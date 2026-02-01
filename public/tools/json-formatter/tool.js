/**
 * JSON Formatter & Validator Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 */

class JSONFormatter {
    constructor() {
        // Input/Output elements
        this.inputJSON = document.getElementById('inputJSON');
        this.outputJSON = document.getElementById('outputJSON');
        this.errorMsg = document.querySelector('.error-msg');
        
        // Action buttons
        this.formatBtn = document.getElementById('formatBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Options (if present in future versions)
        this.indentSize = document.getElementById('indentSize');
        this.sortKeys = document.getElementById('sortKeys');
        
        this.init();
    }

    init() {
        // Button event listeners
        this.formatBtn.addEventListener('click', () => this.format());
        this.minifyBtn.addEventListener('click', () => this.minify());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadJSON());
        
        // Keyboard shortcuts
        this.inputJSON.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Set focus to input
        this.inputJSON.focus();
    }

    handleKeyboard(e) {
        // Ctrl+Enter / Cmd+Enter: Format
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.format();
        }
        // Ctrl+Shift+L / Cmd+Shift+L: Clear
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
            e.preventDefault();
            this.clearAll();
        }
    }

    format() {
        try {
            const input = this.inputJSON.value.trim();
            if (!input) {
                this.showError('Please enter some JSON to format');
                SharedUtilities.showNotification('Empty input', 'warning');
                this.outputJSON.value = '';
                return;
            }

            let parsed = JSON.parse(input);

            // Sort keys if enabled (for future use)
            if (this.sortKeys && this.sortKeys.checked) {
                parsed = this.sortObjectKeys(parsed);
            }

            // Get indentation (default 2 spaces)
            const indent = this.getIndent();

            // Format with indentation
            const formatted = JSON.stringify(parsed, null, indent);
            this.outputJSON.value = formatted;
            
            this.clearError();
            SharedUtilities.showNotification('JSON is valid ✓', 'success');
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
            SharedUtilities.showNotification('Invalid JSON', 'error');
            this.outputJSON.value = '';
        }
    }

    minify() {
        try {
            const input = this.inputJSON.value.trim();
            if (!input) {
                this.showError('Please enter some JSON to minify');
                SharedUtilities.showNotification('Empty input', 'warning');
                return;
            }

            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            this.outputJSON.value = minified;

            this.clearError();
            SharedUtilities.showNotification('JSON minified ✓', 'success');
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
            SharedUtilities.showNotification('Invalid JSON', 'error');
            this.outputJSON.value = '';
        }
    }

    sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.sortObjectKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = this.sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }

    getIndent() {
        if (this.indentSize && this.indentSize.value) {
            const size = this.indentSize.value;
            if (size === 'tab') {
                return '\t';
            }
            return parseInt(size);
        }
        return 2; // Default to 2 spaces
    }

    clearAll() {
        this.inputJSON.value = '';
        this.outputJSON.value = '';
        this.clearError();
        SharedUtilities.showNotification('Cleared', 'info');
        this.inputJSON.focus();
    }

    copyToClipboard() {
        const text = this.outputJSON.value.trim();
        if (!text) {
            this.showError('No JSON to copy. Please format some JSON first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        SharedUtilities.copyToClipboard(text, 'Copied to clipboard!', 'success');
        this.clearError();
    }

    downloadJSON() {
        const text = this.outputJSON.value.trim();
        if (!text) {
            this.showError('No JSON to download. Please format some JSON first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        SharedUtilities.downloadAsFile(text, 'formatted.json', 'application/json');
        SharedUtilities.showNotification('Downloaded successfully!', 'success');
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
    window.MicroTools.jsonFormatter = new JSONFormatter();
});
