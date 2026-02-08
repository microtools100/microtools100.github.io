class WhatsAppTextFormatter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.output = document.getElementById('output');
        this.boldBtn = document.getElementById('boldBtn');
        this.italicBtn = document.getElementById('italicBtn');
        this.strikethroughBtn = document.getElementById('strikethroughBtn');
        this.monospaceBtn = document.getElementById('monospaceBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
        this.updatePreview();
    }

    attachEventListeners() {
        this.inputText.addEventListener('input', () => this.updatePreview());
        this.boldBtn.addEventListener('click', () => this.applyFormat('bold'));
        this.italicBtn.addEventListener('click', () => this.applyFormat('italic'));
        this.strikethroughBtn.addEventListener('click', () => this.applyFormat('strikethrough'));
        this.monospaceBtn.addEventListener('click', () => this.applyFormat('monospace'));
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    applyFormat(type) {
        const textarea = this.inputText;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);

        if (!selected) {
            SharedUtilities.showNotification('Select text first', 'error');
            return;
        }

        let formatted;
        switch (type) {
            case 'bold':
                formatted = `*${selected}*`;
                break;
            case 'italic':
                formatted = `_${selected}_`;
                break;
            case 'strikethrough':
                formatted = `~${selected}~`;
                break;
            case 'monospace':
                formatted = '```' + selected + '```';
                break;
        }

        this.inputText.value = this.inputText.value.substring(0, start) + formatted + this.inputText.value.substring(end);
        this.updatePreview();
    }

    updatePreview() {
        const text = this.inputText.value;
        let preview = text
            .replace(/\*(.+?)\*/g, '<strong>$1</strong>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            .replace(/~(.+?)~/g, '<s>$1</s>')
            .replace(/```(.+?)```/g, '<code>$1</code>');

        preview = preview.replace(/\n/g, '<br>');
        this.output.innerHTML = preview || '<span style="color: var(--text-secondary);">Preview...</span>';
    }

    copy() {
        navigator.clipboard.writeText(this.inputText.value).then(() => {
            SharedUtilities.showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.inputText.value = '';
        this.updatePreview();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppTextFormatter();
});