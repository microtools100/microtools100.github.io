// Word & Character Counter Tool - Production Ready

class WordCharacterCounter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.exampleBtn = document.getElementById('exampleBtn');
        
        this.includeSpaces = document.getElementById('includeSpaces');
        this.includeSpecialChars = document.getElementById('includeSpecialChars');

        this.stats = {
            characters: document.getElementById('characters'),
            charactersNoSpaces: document.getElementById('charactersNoSpaces'),
            words: document.getElementById('words'),
            sentences: document.getElementById('sentences'),
            paragraphs: document.getElementById('paragraphs'),
            lines: document.getElementById('lines'),
            readingTime: document.getElementById('readingTime'),
            speakingTime: document.getElementById('speakingTime')
        };

        this.init();
    }

    init() {
        this.textInput.addEventListener('input', () => this.updateStats());
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearText());
        }
        
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        
        if (this.exampleBtn) {
            this.exampleBtn.addEventListener('click', () => this.loadExample());
        }
        
        if (this.includeSpaces) {
            this.includeSpaces.addEventListener('change', () => this.updateStats());
        }
        
        if (this.includeSpecialChars) {
            this.includeSpecialChars.addEventListener('change', () => this.updateStats());
        }
        
        // Keyboard shortcut: Ctrl/Cmd+Enter to clear
        this.textInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.clearText();
            }
        });
    }

    updateStats() {
        const text = this.textInput.value;

        const stats = {
            characters: this.includeSpaces.checked ? text.length : text.replace(/\s/g, '').length,
            charactersNoSpaces: text.replace(/\s/g, '').length,
            words: this.countWords(text),
            sentences: this.countSentences(text),
            paragraphs: this.countParagraphs(text),
            lines: text.split('\n').filter(line => line.trim()).length,
            readingTime: this.calculateReadingTime(text),
            speakingTime: this.calculateSpeakingTime(text)
        };

        this.displayStats(stats);
    }

    countWords(text) {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    }

    countSentences(text) {
        const sentenceRegex = /[.!?]+/g;
        const matches = text.match(sentenceRegex);
        return matches ? matches.length : 0;
    }

    countParagraphs(text) {
        return text.split(/\n\n+/).filter(p => p.trim()).length;
    }

    calculateReadingTime(text) {
        const words = this.countWords(text);
        const minutesRead = Math.ceil(words / 200);
        return minutesRead < 1 ? '< 1 min' : `${minutesRead} min`;
    }

    calculateSpeakingTime(text) {
        const words = this.countWords(text);
        const minutesSpeak = Math.ceil(words / 130);
        return minutesSpeak < 1 ? '< 1 min' : `${minutesSpeak} min`;
    }

    displayStats(stats) {
        Object.keys(stats).forEach(key => {
            if (this.stats[key]) {
                this.stats[key].textContent = stats[key];
            }
        });
    }

    copyToClipboard() {
        const text = this.textInput.value;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                SharedUtilities.showNotification('Text copied to clipboard!', 'success');
                this.copyBtn.textContent = '✓ Copied';
                setTimeout(() => {
                    this.copyBtn.innerHTML = '<span>Copy</span><span>📋</span>';
                }, 2000);
            });
        } else {
            SharedUtilities.showNotification('No text to copy', 'warning');
        }
    }

    clearText() {
        this.textInput.value = '';
        this.updateStats();
        this.textInput.focus();
        SharedUtilities.showNotification('Text cleared!', 'success');
    }

    loadExample() {
        this.textInput.value = 'The quick brown fox jumps over the lazy dog. This is a sample sentence. Statistics will update automatically as you type or paste text.';
        this.updateStats();
        this.textInput.focus();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.wordCharacterCounter = new WordCharacterCounter();
});
