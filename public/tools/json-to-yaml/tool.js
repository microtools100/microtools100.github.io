/**
 * JSON to YAML Converter Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 * Uses global auto-convert and auto-copy functions
 */

class JSONToYAML {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput') || document.getElementById('inputText');
        this.yamlOutput = document.getElementById('yamlOutput') || document.getElementById('outputText');
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.init();
    }

    init() {
        // Setup auto-convert: Real-time conversion as you type
        SharedUtilities.setupAutoConvert(
            this.jsonInput,
            (jsonText) => this.jsonToYAML(JSON.parse(jsonText), 0),
            this.yamlOutput,
            this.errorMsg,
            300
        );

        // Setup auto-copy: Automatically copy to clipboard after conversion
        SharedUtilities.setupAutoCopy(this.yamlOutput, 500);

        // Additional button handlers
        if (this.convertBtn) {
            this.convertBtn.addEventListener('click', () => this.manualConvert());
        }
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadYAML());
        }
        
        // Keyboard shortcuts
        this.jsonInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
            e.preventDefault();
            this.clearAll();
        }
    }

    manualConvert() {
        try {
            let json = this.jsonInput.value.trim();
            if (!json) {
                this.showError('Please enter some JSON to convert');
                SharedUtilities.showNotification('Empty input', 'warning');
                this.yamlOutput.value = '';
                return;
            }

            const jsonData = JSON.parse(json);
            const yaml = this.jsonToYAML(jsonData, 0);
            this.yamlOutput.value = yaml;
            this.clearError();
            SharedUtilities.showNotification('Conversion successful!', 'success');
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
            SharedUtilities.showNotification('Invalid JSON', 'error');
            this.yamlOutput.value = '';
        }
    }

    jsonToYAML(obj, indent = 0) {
        const spaces = ' '.repeat(indent);
        
        if (obj === null) return 'null';
        if (typeof obj === 'boolean') return obj.toString();
        if (typeof obj === 'number') return obj.toString();
        if (typeof obj === 'string') return `'${obj.replace(/'/g, "''")}'`;
        
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            return obj.map((item) => {
                const itemStr = this.jsonToYAML(item, indent + 2);
                return `${spaces}- ${itemStr}`;
            }).join('\n');
        }
        
        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '{}';
            
            return keys.map(key => {
                const value = obj[key];
                const yamlValue = this.jsonToYAML(value, indent + 2);
                
                if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                    return `${spaces}${key}:\n${yamlValue}`;
                } else {
                    return `${spaces}${key}: ${yamlValue}`;
                }
            }).join('\n');
        }
        
        return '';
    }

    clearAll() {
        this.jsonInput.value = '';
        this.yamlOutput.value = '';
        this.clearError();
        this.jsonInput.focus();
        SharedUtilities.showNotification('Cleared', 'info');
    }

    copyToClipboard() {
        const text = this.yamlOutput.value.trim();
        if (!text) {
            this.showError('No YAML to copy. Please convert some JSON first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        // Use the shared utility which handles notification
        SharedUtilities.copyToClipboard(text, 'Copied to clipboard!', 'success');
        this.clearError();
    }

    downloadYAML() {
        const text = this.yamlOutput.value.trim();
        if (!text) {
            this.showError('No YAML to download. Please convert some JSON first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/yaml;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'converted.yaml');
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
    window.MicroTools.jsonToYAML = new JSONToYAML();
});