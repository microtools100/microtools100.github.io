class JSONToYAMLConverter {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput');
        this.yamlOutput = document.getElementById('yamlOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.init();
    }

    init() {
        this.convertBtn.addEventListener('click', () => this.convert());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.download());
        }
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
                this.yamlOutput.value = '';
                return;
            }

            const parsed = JSON.parse(json);
            const yaml = this.jsonToYAML(parsed, 0);
            this.yamlOutput.value = yaml;
            window.MicroTools?.utils?.showNotification?.('Converted successfully!', 'success');
        } catch (error) {
            this.yamlOutput.value = `Error: ${error.message}`;
            window.MicroTools?.utils?.showNotification?.('Invalid JSON format', 'error');
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
            return obj.map((item, i) => {
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

    copy() {
        if (!this.yamlOutput.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(this.yamlOutput.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('YAML copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    swap() {
        const temp = this.jsonInput.value;
        this.jsonInput.value = this.yamlOutput.value;
        this.yamlOutput.value = temp;
    }

    clear() {
        this.jsonInput.value = '';
        this.yamlOutput.value = '';
        SharedUtilities.showNotification('Cleared!', 'success');
    }

    download() {
        const yaml = this.yamlOutput.value;
        if (!yaml) {
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const blob = new Blob([yaml], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.yaml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        SharedUtilities.showNotification('File downloaded', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JSONToYAMLConverter();
});