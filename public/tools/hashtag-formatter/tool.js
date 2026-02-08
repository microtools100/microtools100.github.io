class HashtagFormatter {
    constructor() {
        this.inputHashtags = document.getElementById('inputHashtags');
        this.outputHashtags = document.getElementById('outputHashtags');
        this.removeDuplicates = document.getElementById('removeDuplicates');
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
        const input = this.inputHashtags.value;
        if (!input.trim()) {
            showNotification('Please enter hashtags', 'error');
            return;
        }

        let hashtags = input
            .replace(/[,\n\s]+/g, ' ')
            .split(' ')
            .map(tag => tag.trim())
            .filter(tag => tag)
            .map(tag => tag.startsWith('#') ? tag : '#' + tag);

        if (this.removeDuplicates.checked) {
            hashtags = [...new Set(hashtags)];
        }

        const formatType = document.querySelector('input[name="format"]:checked').value;
        let formatted;

        switch (formatType) {
            case 'single':
                formatted = hashtags.join(' ');
                break;
            case 'multi':
                formatted = hashtags.join('\n');
                break;
            case 'grouped':
                formatted = '';
                for (let i = 0; i < hashtags.length; i += 10) {
                    formatted += hashtags.slice(i, i + 10).join(' ') + '\n';
                }
                formatted = formatted.trim();
                break;
        }

        this.outputHashtags.value = formatted;
        showNotification(`Formatted ${hashtags.length} hashtags!`, 'success');
    }

    copy() {
        navigator.clipboard.writeText(this.outputHashtags.value).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.inputHashtags.value = '';
        this.outputHashtags.value = '';
        this.inputHashtags.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HashtagFormatter();
});