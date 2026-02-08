class BulkFileNameGenerator {
    constructor() {
        this.baseNames = document.getElementById('baseNames');
        this.extension = document.getElementById('extension');
        this.prefix = document.getElementById('prefix');
        this.suffix = document.getElementById('suffix');
        this.addNumbers = document.getElementById('addNumbers');
        this.output = document.getElementById('output');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
    }

    generate() {
        const names = this.baseNames.value.split('\n').filter(n => n.trim());
        if (!names.length) {
            showNotification('Please enter file names', 'error');
            return;
        }

        const ext = this.extension.value || '';
        const prefix = this.prefix.value || '';
        const suffix = this.suffix.value || '';
        const addNum = this.addNumbers.checked;

        const result = names.map((name, idx) => {
            let num = addNum ? String(idx + 1).padStart(3, '0') : '';
            return `${prefix}${num}${prefix ? '_' : ''}${name}${suffix}${ext}`.replace(/__+/g, '_');
        });

        this.output.value = result.join('\n');
    }

    clear() {
        this.baseNames.value = '';
        this.output.value = '';
        this.baseNames.focus();
    }

    copy() {
        navigator.clipboard.writeText(this.output.value).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    download() {
        const blob = new Blob([this.output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filenames.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BulkFileNameGenerator();
});