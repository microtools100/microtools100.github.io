class DateFileNameGenerator {
    constructor() {
        this.selectDate = document.getElementById('selectDate');
        this.dateFormat = document.getElementById('dateFormat');
        this.fileNames = document.getElementById('fileNames');
        this.outputNames = document.getElementById('outputNames');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.selectDate.valueAsDate = new Date();
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
    }

    getFormattedDateString(date, format) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');

        switch (format) {
            case 'YYYY-MM-DD': return `${y}-${m}-${d}`;
            case 'DD-MM-YYYY': return `${d}-${m}-${y}`;
            case 'MM-DD-YYYY': return `${m}-${d}-${y}`;
            case 'YYYYMMDD': return `${y}${m}${d}`;
            default: return `${y}-${m}-${d}`;
        }
    }

    generate() {
        const date = new Date(this.selectDate.value);
        const names = this.fileNames.value.split('\n').filter(n => n.trim());
        if (!names.length) {
            showNotification('Please enter file names', 'error');
            return;
        }

        const format = this.dateFormat.value;
        const dateStr = this.getFormattedDateString(date, format);
        const isPrefix = document.querySelector('input[name="position"]:checked').value === 'prefix';

        const result = names.map(name => {
            const parts = name.split('.');
            const ext = parts.length > 1 ? '.' + parts.pop() : '';
            let basename = parts.join('.');

            return isPrefix ? `${dateStr}_${basename}${ext}` : `${basename}_${dateStr}${ext}`;
        });

        this.outputNames.value = result.join('\n');
    }

    clear() {
        this.fileNames.value = '';
        this.outputNames.value = '';
        this.fileNames.focus();
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
        a.download = 'dated-filenames.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DateFileNameGenerator();
});