/**
 * JSON to CSV Converter Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 */

class JSONToCSV {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput') || document.getElementById('inputText');
        this.csvOutput = document.getElementById('csvOutput') || document.getElementById('outputText');
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.init();
    }

    init() {
        if (this.convertBtn) {
            this.convertBtn.addEventListener('click', () => this.convert());
        }
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadCSV());
        }
        
        // Keyboard shortcuts
        this.jsonInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        // Ctrl+Enter / Cmd+Enter: Convert
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.convert();
        }
        // Ctrl+Shift+L / Cmd+Shift+L: Clear
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
            e.preventDefault();
            this.clearAll();
        }
    }

    convert() {
        try {
            let json = this.jsonInput.value.trim();
            if (!json) {
                this.showError('Please enter some JSON to convert');
                SharedUtilities.showNotification('Empty input', 'warning');
                this.csvOutput.value = '';
                return;
            }

            const jsonData = JSON.parse(json);
            const csv = this.jsonToCSV(jsonData);
            this.csvOutput.value = csv;
            this.clearError();
            SharedUtilities.showNotification('Conversion successful!', 'success');
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
            SharedUtilities.showNotification('Invalid JSON', 'error');
            this.csvOutput.value = '';
        }
    }

    jsonToCSV(data, delimiter = ',') {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array of objects');
        }

        if (data.length === 0) {
            return '';
        }

        // Get all unique keys
        const keys = new Set();
        data.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(key => keys.add(key));
            }
        });

        const headers = Array.from(keys);
        if (headers.length === 0) {
            throw new Error('No properties found in objects');
        }

        const rows = [this.escapeCSVLine(headers, delimiter)];

        data.forEach(item => {
            const values = headers.map(header => {
                const value = item[header];
                return this.formatCSVValue(value);
            });
            rows.push(this.escapeCSVLine(values, delimiter));
        });

        return rows.join('\n');
    }

    formatCSVValue(value) {
        if (value === null || value === undefined) {
            return '';
        }

        if (typeof value === 'object') {
            return JSON.stringify(value).replace(/"/g, '""');
        }

        return String(value);
    }

    escapeCSVLine(values, delimiter) {
        return values.map(value => {
            const str = String(value);
            if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        }).join(delimiter);
    }

    clearAll() {
        this.jsonInput.value = '';
        this.csvOutput.value = '';
        this.clearError();
        this.jsonInput.focus();
        SharedUtilities.showNotification('Cleared', 'info');
    }

    copyToClipboard() {
        const text = this.csvOutput.value.trim();
        if (!text) {
            this.showError('No CSV to copy. Please convert some JSON first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        // Use the shared utility which handles notification
        SharedUtilities.copyToClipboard(text, 'Copied to clipboard!', 'success');
        this.clearError();
    }

    downloadCSV() {
        const text = this.csvOutput.value.trim();
        if (!text) {
            this.showError('No CSV to download. Please convert some JSON first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'converted.csv');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        SharedUtilities.showNotification('Download started', 'success');
        this.clearError();
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
    window.MicroTools.jsonToCSV = new JSONToCSV();
});
