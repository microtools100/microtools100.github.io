/**
 * CSV to JSON Converter Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 * Uses global auto-convert and auto-copy functions
 */

class CSVToJSON {
    constructor() {
        this.csvInput = document.getElementById('csvInput') || document.getElementById('inputText');
        this.jsonOutput = document.getElementById('jsonOutput') || document.getElementById('outputText');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.hasHeaderRow = document.getElementById('hasHeaderRow'); // May be null - that's OK
        this.errorMsg = document.querySelector('.error-msg');
        
        this.init();
    }

    init() {
        // Setup auto-convert: Real-time conversion as you type
        SharedUtilities.setupAutoConvert(
            this.csvInput,
            (csvText) => {
                const hasHeader = this.hasHeaderRow ? this.hasHeaderRow.checked : true; // Default to true
                const json = this.csvToJSON(csvText, hasHeader);
                return JSON.stringify(json, null, 2);
            },
            this.jsonOutput,
            this.errorMsg,
            300
        );

        // Setup auto-copy: Automatically copy to clipboard after conversion
        SharedUtilities.setupAutoCopy(this.jsonOutput, 500);

        // Additional button handlers
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadJSON());
        }
        
        // Re-convert when header option changes
        if (this.hasHeaderRow) {
            this.hasHeaderRow.addEventListener('change', () => this.manualConvert());
        }
        
        this.csvInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.clearAll();
        }
    }

    manualConvert() {
        const csvText = this.csvInput.value.trim();
        if (csvText) {
            try {
                const hasHeader = this.hasHeaderRow ? this.hasHeaderRow.checked : true;
                const json = this.csvToJSON(csvText, hasHeader);
                this.jsonOutput.value = JSON.stringify(json, null, 2);
                this.clearError();
            } catch (error) {
                this.showError('Error parsing CSV: ' + error.message);
                this.jsonOutput.value = '';
            }
        }
    }

    csvToJSON(csvText, hasHeader = true) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];

        const rows = lines.map(line => this.parseCSVLine(line));
        
        if (!hasHeader) {
            return rows.map((row) => {
                const obj = {};
                row.forEach((value, i) => {
                    obj[`column_${i + 1}`] = value;
                });
                return obj;
            });
        }

        const headers = rows[0];
        return rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i] || '';
            });
            return obj;
        });
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    clearAll() {
        this.csvInput.value = '';
        this.jsonOutput.value = '';
        this.clearError();
        this.csvInput.focus();
    }

    copyToClipboard() {
        const text = this.jsonOutput.value;
        if (!text) {
            this.showError('No JSON to copy. Please convert some CSV first.');
            return;
        }

        SharedUtilities.copyToClipboard(text, 'Copied to clipboard!', 'success');
    }

    downloadJSON() {
        const text = this.jsonOutput.value;
        if (!text) {
            this.showError('No JSON to download. Please convert some CSV first.');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'converted.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
    window.MicroTools.csvToJSON = new CSVToJSON();
});
