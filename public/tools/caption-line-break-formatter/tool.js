class CaptionFormatter {
    constructor() {
        this.inputCaption = document.getElementById('inputCaption');
        this.outputCaption = document.getElementById('outputCaption');
        this.formatBtn = document.getElementById('formatBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.formatBtn.addEventListener('click', () => this.format());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    format() {
        const text = this.inputCaption.value;
        if (!text.trim()) {
            showNotification('Please enter a caption', 'error');
            return;
        }

        const breakType = document.querySelector('input[name="breakType"]:checked').value;
        let formatted = text;

        if (breakType === 'period' || breakType === 'both') {
            formatted = formatted.replace(/([.!?])\s+/g, '$1\n');
        }

        if (breakType === 'emoji' || breakType === 'both') {
            const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]/gu;
            formatted = formatted.replace(new RegExp(emojiRegex.source + '\\s*', emojiRegex.flags), '$&\n');
        }

        this.outputCaption.value = formatted.trim();
        showNotification('Caption formatted!', 'success');
    }

    copy() {
        navigator.clipboard.writeText(this.outputCaption.value).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.inputCaption.value = '';
        this.outputCaption.value = '';
        this.inputCaption.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CaptionFormatter();
});