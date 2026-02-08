class FileNameCaseConverter {
    constructor() {
        this.inputNames = document.getElementById('inputNames');
        this.outputNames = document.getElementById('outputNames');
        this.caseType = document.getElementById('caseType');
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.convertBtn.addEventListener('click', () => this.convert());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
    }

    convertCase(name, caseType) {
        const parts = name.split('.');
        const ext = parts.length > 1 ? '.' + parts.pop() : '';
        let basename = parts.join('.');

        switch (caseType) {
            case 'lowercase':
                basename = basename.toLowerCase();
                break;
            case 'UPPERCASE':
                basename = basename.toUpperCase();
                break;
            case 'Title Case':
                basename = basename.replace(/\b\w/g, c => c.toUpperCase());
                break;
            case 'camelCase':
                basename = basename.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/[-_]/g, '');
                break;
            case 'snake_case':
                basename = basename.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
                break;
        }

        return basename + ext;
    }

    convert() {
        const names = this.inputNames.value.split('\n').filter(n => n.trim());
        if (!names.length) {
            showNotification('Please enter file names', 'error');
            return;
        }

        const caseType = this.caseType.value;
        const result = names.map(name => this.convertCase(name, caseType));
        this.outputNames.value = result.join('\n');
    }

    clear() {
        this.inputNames.value = '';
        this.outputNames.value = '';
        this.inputNames.focus();
    }

    copy() {
        navigator.clipboard.writeText(this.outputNames.value).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    download() {
        const blob = new Blob([this.outputNames.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted-filenames.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FileNameCaseConverter();
});