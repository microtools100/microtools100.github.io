// Word & Character Counter Tool - Production Ready

class WordCharacterCounter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.clearBtn = document.getElementById('clearBtn');

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
    }

    updateStats() {
        const text = this.textInput.value;

        const stats = {
            characters: text.length,
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
        return minutesRead === 1 ? '< 1 minute' : `${minutesRead} minutes`;
    }

    calculateSpeakingTime(text) {
        const words = this.countWords(text);
        const minutesSpeak = Math.ceil(words / 130);
        return minutesSpeak === 1 ? '< 1 minute' : `${minutesSpeak} minutes`;
    }

    displayStats(stats) {
        Object.keys(stats).forEach(key => {
            if (this.stats[key]) {
                this.stats[key].textContent = stats[key];
            }
        });
    }

    clearText() {
        this.textInput.value = '';
        this.updateStats();
        window.MicroTools?.utils?.showNotification?.('Text cleared!', 'success');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.wordCharacterCounter = new WordCharacterCounter();
});
