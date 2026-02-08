/**
 * XML to JSON Converter Tool
 * Class-based implementation with keyboard shortcuts and clipboard support
 * Uses global auto-convert and auto-copy functions
 */

class XMLToJSON {
    constructor() {
        this.xmlInput = document.getElementById('xmlInput') || document.getElementById('inputText');
        this.jsonOutput = document.getElementById('jsonOutput') || document.getElementById('outputText');
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
            this.xmlInput,
            (xmlText) => {
                let xml = xmlText.replace(/<\?xml[^?]*\?>/g, '').trim();
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, 'text/xml');
                
                if (doc.getElementsByTagName('parsererror').length > 0) {
                    throw new Error('Invalid XML format');
                }
                
                const json = this.xmlToJSON(doc.documentElement);
                return JSON.stringify(json, null, 2);
            },
            this.jsonOutput,
            this.errorMsg,
            300
        );

        // Setup auto-copy: Automatically copy to clipboard after conversion
        SharedUtilities.setupAutoCopy(this.jsonOutput, 500);

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
            this.downloadBtn.addEventListener('click', () => this.downloadJSON());
        }
        
        // Keyboard shortcuts
        this.xmlInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
            e.preventDefault();
            this.clearAll();
        }
    }

    manualConvert() {
        try {
            let xml = this.xmlInput.value.trim();
            if (!xml) {
                this.showError('Please enter some XML to convert');
                SharedUtilities.showNotification('Empty input', 'warning');
                this.jsonOutput.value = '';
                return;
            }

            xml = xml.replace(/<\?xml[^?]*\?>/g, '').trim();
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'text/xml');

            if (doc.getElementsByTagName('parsererror').length > 0) {
                this.showError('Invalid XML format');
                SharedUtilities.showNotification('Invalid XML', 'error');
                this.jsonOutput.value = '';
                return;
            }

            const json = this.xmlToJSON(doc.documentElement);
            this.jsonOutput.value = JSON.stringify(json, null, 2);
            this.clearError();
            SharedUtilities.showNotification('Conversion successful!', 'success');
        } catch (error) {
            this.showError('XML parsing error: ' + error.message);
            SharedUtilities.showNotification('Parsing error', 'error');
            this.jsonOutput.value = '';
        }
    }

    xmlToJSON(element) {
        const result = {};
        const tagName = element.tagName;
        const obj = {};

        if (element.attributes.length > 0) {
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                obj['@' + attr.name] = attr.value;
            }
        }

        const children = {};
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];

            if (node.nodeType === 1) {
                const childObj = this.xmlToJSON(node);
                const childName = node.tagName;

                if (children[childName]) {
                    if (Array.isArray(children[childName])) {
                        children[childName].push(childObj[childName]);
                    } else {
                        children[childName] = [children[childName], childObj[childName]];
                    }
                } else {
                    children[childName] = childObj[childName];
                }
            } else if (node.nodeType === 3) {
                const text = node.nodeValue.trim();
                if (text && text.length > 0) {
                    obj['#text'] = text;
                }
            }
        }

        Object.assign(obj, children);
        result[tagName] = Object.keys(obj).length > 0 ? obj : null;
        return result;
    }

    clearAll() {
        this.xmlInput.value = '';
        this.jsonOutput.value = '';
        this.clearError();
        this.xmlInput.focus();
        SharedUtilities.showNotification('Cleared', 'info');
    }

    copyToClipboard() {
        const text = this.jsonOutput.value.trim();
        if (!text) {
            this.showError('No JSON to copy. Please convert some XML first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        // Use the shared utility which handles notification
        SharedUtilities.copyToClipboard(text, 'Copied to clipboard!', 'success');
        this.clearError();
    }

    downloadJSON() {
        const text = this.jsonOutput.value.trim();
        if (!text) {
            this.showError('No JSON to download. Please convert some XML first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'converted.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        SharedUtilities.showNotification('Download started', 'success');
        this.clearError();
    }

    showError(message) {
        SharedUtilities.showError(this.errorMsg, message);
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
    window.MicroTools.xmlToJSON = new XMLToJSON();
});