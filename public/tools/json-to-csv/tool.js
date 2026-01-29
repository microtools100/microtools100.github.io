// JSON to CSV Converter Tool - Production Ready

class JSONToCSV {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput') || document.getElementById('inputText');
        this.csvOutput = document.getElementById('csvOutput') || document.getElementById('outputText');
        this.convertBtn = document.getElementById('convertBtn');
        this.copyBtn = document.querySelector('.copy-btn');
        this.delimiter = document.getElementById('delimiter');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.init();
    }

    init() {
        if (this.convertBtn) {
            this.convertBtn.addEventListener('click', () => this.convert());
        } else {
            this.jsonInput.addEventListener('input', () => this.convert());
        }
        this.jsonInput.addEventListener('input', () => this.clearError());
        if (this.delimiter) {
            this.delimiter.addEventListener('change', () => this.convert());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    convert() {
        const jsonText = this.jsonInput.value.trim();
        
        if (!jsonText) {
            this.csvOutput.value = '';
            this.clearError();
            return;
        }

        try {
            const jsonData = JSON.parse(jsonText);
            const delimiter = this.delimiter ? this.delimiter.value : ',';
            const csv = this.jsonToCSV(jsonData, delimiter);
            this.csvOutput.value = csv;
            this.clearError();
            this.copyToClipboard();
            window.MicroTools?.utils?.showNotification?.('Converted successfully!', 'success');
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
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
                return this.formatCSVValue(value, delimiter);
            });
            rows.push(this.escapeCSVLine(values, delimiter));
        });

        return rows.join('\n');
    }

    formatCSVValue(value, delimiter) {
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

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.style.display = 'block';
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.style.display = 'none';
        }
    }

    copyToClipboard() {
        const text = this.csvOutput.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.jsonToCSV = new JSONToCSV();
});
