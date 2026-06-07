/**
 * JSON to XML Converter Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 * Uses global auto-convert and auto-copy functions
 */

class JSONToXML {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput') || document.getElementById('inputText');
        this.xmlOutput = document.getElementById('xmlOutput') || document.getElementById('outputText');
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
            (jsonText) => this.jsonToXML(JSON.parse(jsonText)),
            this.xmlOutput,
            this.errorMsg,
            300
        );

        // Setup auto-copy: Automatically copy to clipboard after conversion
        SharedUtilities.setupAutoCopy(this.xmlOutput, 500);

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
            this.downloadBtn.addEventListener('click', () => this.downloadXML());
        }
        
        // Keyboard shortcuts
        this.jsonInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        // Ctrl+Shift+L / Cmd+Shift+L: Clear
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
                this.xmlOutput.value = '';
                return;
            }

            const jsonData = JSON.parse(json);
            const xml = this.jsonToXML(jsonData);
            this.xmlOutput.value = xml;
            this.clearError();
            SharedUtilities.showNotification('Conversion successful!', 'success');
        } catch (error) {
            this.showError('Invalid JSON: ' + error.message);
            SharedUtilities.showNotification('Invalid JSON', 'error');
            this.xmlOutput.value = '';
        }
    }

    jsonToXML(obj, indent = '') {
        if (obj === null) return '';
        if (typeof obj !== 'object') return this.escapeXML(String(obj));

        if (Array.isArray(obj)) {
            return obj.map((item) => this.jsonToXML(item, indent)).join('\n');
        }

        const lines = [];
        let attributes = '';
        let textContent = '';
        const childElements = {};

        // First pass: separate attributes, text content, and child elements
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                
                // Handle attributes (keys starting with -)
                if (key.startsWith('-')) {
                    const attrName = key.substring(1);
                    attributes += ` ${attrName}="${this.escapeXML(String(value))}"`;
                }
                // Handle text content (special key #text)
                else if (key === '#text') {
                    textContent = this.escapeXML(String(value));
                }
                // Regular child elements
                else {
                    if (!childElements[key]) {
                        childElements[key] = [];
                    }
                    childElements[key].push(value);
                }
            }
        }

        // Second pass: generate XML for each root element
        for (const key in childElements) {
            const values = childElements[key];
            const tagName = this.sanitizeTagName(key);

            values.forEach(value => {
                if (value === null) {
                    lines.push(`${indent}<${tagName} />`);
                } else if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        // Nested array - shouldn't happen in this context
                        value.forEach(item => {
                            if (typeof item === 'object' && item !== null) {
                                lines.push(`${indent}<${tagName}>`);
                                lines.push(this.jsonToXML(item, indent + '  '));
                                lines.push(`${indent}</${tagName}>`);
                            } else {
                                lines.push(`${indent}<${tagName}>${this.escapeXML(String(item))}</${tagName}>`);
                            }
                        });
                    } else {
                        lines.push(`${indent}<${tagName}${attributes}>`);
                        lines.push(this.jsonToXML(value, indent + '  '));
                        lines.push(`${indent}</${tagName}>`);
                    }
                } else {
                    lines.push(`${indent}<${tagName}${attributes}>${this.escapeXML(String(value))}</${tagName}>`);
                }
            });
        }

        return lines.join('\n');
    }

    sanitizeTagName(name) {
        // Remove leading hyphens and special characters, replace with underscore
        // XML tag names must start with letter, underscore, or colon
        let sanitized = name.replace(/^[^a-zA-Z_:]+/, ''); // Remove invalid start characters
        sanitized = sanitized.replace(/[^a-zA-Z0-9_:.\-]/g, '_'); // Replace invalid characters with underscore
        // Fallback if name becomes empty
        return sanitized || 'element';
    }

    escapeXML(str) {
        return str.replace(/[&<>"']/g, char => {
            const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'};
            return map[char] || char;
        });
    }

    clearAll() {
        this.jsonInput.value = '';
        this.xmlOutput.value = '';
        this.clearError();
        this.jsonInput.focus();
        SharedUtilities.showNotification('Cleared', 'info');
    }

    copyToClipboard() {
        const text = this.xmlOutput.value.trim();
        if (!text) {
            this.showError('No XML to copy. Please convert some JSON first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        // Use the shared utility which handles notification
        SharedUtilities.copyToClipboard(text, 'Copied to clipboard!', 'success');
        this.clearError();
    }

    downloadXML() {
        const text = this.xmlOutput.value.trim();
        if (!text) {
            this.showError('No XML to download. Please convert some JSON first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'converted.xml');
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
    window.MicroTools.jsonToXML = new JSONToXML();
});