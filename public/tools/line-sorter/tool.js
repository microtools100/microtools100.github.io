class LineSorter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.sortBtn = document.getElementById('sortBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.sortOrder = document.getElementById('sortOrder');
        this.caseSensitive = document.getElementById('caseSensitive');
        this.removeEmpty = document.getElementById('removeEmpty');

        this.init();
    }

    init() {
        this.sortBtn.addEventListener('click', () => this.sort());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.clearBtn.addEventListener('click', () => this.clearAll());
    }

    sort() {
        const text = this.inputText.value;
        if (!text.trim()) {
            this.outputText.value = '';
            return;
        }

        let lines = text.split('\n');

        if (this.removeEmpty.checked) {
            lines = lines.filter(line => line.trim().length > 0);
        }

        lines.sort((a, b) => {
            const lineA = this.caseSensitive.checked ? a : a.toLowerCase();
            const lineB = this.caseSensitive.checked ? b : b.toLowerCase();

            if (this.sortOrder.value === 'asc') {
                return lineA.localeCompare(lineB);
            } else {
                return lineB.localeCompare(lineA);
            }
        });

        this.outputText.value = lines.join('\n');
    }

    clearAll() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.inputText.focus();
    }

    copy() {
        if (!this.outputText.value) return;
        navigator.clipboard.writeText(this.outputText.value).then(() => {
            showNotification('Text copied to clipboard!', 'success');
        });
    }

    download() {
        if (!this.outputText.value) return;
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.outputText.value));
        element.setAttribute('download', 'sorted-lines.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LineSorter();
});
