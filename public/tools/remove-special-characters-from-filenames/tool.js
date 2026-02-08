class SpecialCharRemover {
    constructor() {
        this.inputNames = document.getElementById('inputNames');
        this.outputNames = document.getElementById('outputNames');
        this.replaceSpaces = document.getElementById('replaceSpaces');
        this.cleanBtn = document.getElementById('cleanBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.cleanBtn.addEventListener('click', () => this.clean());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
    }

    clean() {
        const names = this.inputNames.value.split('\n').filter(n => n.trim());
        if (!names.length) {
            showNotification('Please enter file names', 'error');
            return;
        }

        const result = names.map(name => {
            const parts = name.split('.');
            const ext = parts.length > 1 ? '.' + parts.pop() : '';
            let basename = parts.join('.');
            
            basename = basename.replace(/[@#$%^&*()!~`'";\:?\/\\|<>]+/g, '');
            if (this.replaceSpaces.checked) {
                basename = basename.replace(/\s+/g, '_');
            }
            
            return (basename + ext).trim();
        });

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
        a.download = 'cleaned-filenames.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SpecialCharRemover();
});