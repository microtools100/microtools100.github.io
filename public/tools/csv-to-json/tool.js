// CSV to JSON Converter Tool - Production Ready

class CSVToJSON {
    constructor() {
        this.csvInput = document.getElementById('csvInput') || document.getElementById('inputText');
        this.jsonOutput = document.getElementById('jsonOutput') || document.getElementById('outputText');
        this.convertBtn = document.getElementById('convertBtn');
        this.copyBtn = document.querySelector('.copy-btn');
        this.hasHeaderRow = document.getElementById('hasHeaderRow');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(() => this.autoCopy());
        this.init();
    }

    init() {
        if (this.convertBtn) {
            this.convertBtn.addEventListener('click', () => this.convert());
        } else {
            this.csvInput.addEventListener('input', () => this.debouncedConvert());
        }
        this.csvInput.addEventListener('input', () => this.clearError());
        if (this.hasHeaderRow) {
            this.hasHeaderRow.addEventListener('change', () => this.debouncedConvert());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    debouncedConvert() {
        this.convert();
        this.keystrokeDelay.schedule();
    }

    convert() {
        const csvText = this.csvInput.value.trim();
        
        if (!csvText) {
            this.jsonOutput.value = '';
            this.clearError();
            return;
        }

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

    autoCopy() {
        const text = this.jsonOutput.value;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                SharedUtilities.showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                SharedUtilities.showNotification('Failed to copy', 'error');
            });
        }
    }

    csvToJSON(csvText, hasHeader = true) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];

        const rows = lines.map(line => this.parseCSVLine(line));
        
        if (!hasHeader) {
            return rows.map((row, index) => {
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
        const text = this.jsonOutput.value;
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
    window.MicroTools.csvToJSON = new CSVToJSON();
});
