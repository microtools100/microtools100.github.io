class JSONToXMLConverter {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput');
        this.xmlOutput = document.getElementById('xmlOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.init();
    }

    init() {
        this.convertBtn.addEventListener('click', () => this.convert());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.jsonInput.addEventListener('input', () => this.autoConvert());
    }

    autoConvert() {
        clearTimeout(this.autoConvertTimer);
        this.autoConvertTimer = setTimeout(() => this.convert(), 500);
    }

    convert() {
        try {
            const json = this.jsonInput.value.trim();
            if (!json) {
                this.xmlOutput.value = '';
                return;
            }

            const parsed = JSON.parse(json);
            const xml = this.jsonToXML(parsed);
            this.xmlOutput.value = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
            this.autoCopy();
        } catch (error) {
            this.xmlOutput.value = `Error: ${error.message}`;
            window.MicroTools?.utils?.showNotification?.('Invalid JSON', 'error');
        }
    }

    autoCopy() {
        if (!this.xmlOutput.value) return;
        navigator.clipboard.writeText(this.xmlOutput.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    jsonToXML(obj, indent = '') {
        if (obj === null) return '';
        if (typeof obj !== 'object') return this.escapeXML(String(obj));

        if (Array.isArray(obj)) {
            return obj.map((item, i) => this.jsonToXML(item, indent)).join('\n');
        }

        const lines = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const tagName = this.sanitizeTagName(key);

                if (value === null) {
                    lines.push(`${indent}<${tagName} />`);
                } else if (typeof value === 'object') {
                    if (Array.isArray(value)) {
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
                        lines.push(`${indent}<${tagName}>`);
                        lines.push(this.jsonToXML(value, indent + '  '));
                        lines.push(`${indent}</${tagName}>`);
                    }
                } else {
                    lines.push(`${indent}<${tagName}>${this.escapeXML(String(value))}</${tagName}>`);
                }
            }
        }

        return lines.join('\n');
    }

    sanitizeTagName(name) {
        return name.replace(/[^a-zA-Z0-9_-]/g, '_');
    }

    escapeXML(str) {
        return str.replace(/[&<>"']/g, char => {
            const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'};
            return map[char] || char;
        });
    }

    copy() {
        if (!this.xmlOutput.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.xmlOutput.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('XML copied!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    clear() {
        this.jsonInput.value = '';
        this.xmlOutput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JSONToXMLConverter();
});