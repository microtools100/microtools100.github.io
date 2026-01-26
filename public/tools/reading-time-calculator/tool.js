class ReadingTimeCalculator {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.readingSpeedInput = document.getElementById('readingSpeed');
        this.readingTimeEl = document.getElementById('readingTime');
        this.wordCountEl = document.getElementById('wordCount');
        this.charCountEl = document.getElementById('charCount');
        this.sentenceCountEl = document.getElementById('sentenceCount');
        this.slowTimeEl = document.getElementById('slowTime');
        this.avgTimeEl = document.getElementById('avgTime');
        this.fastTimeEl = document.getElementById('fastTime');
        this.copyBtn = document.getElementById('copyBtn');

        this.init();
    }

    init() {
        this.textInput.addEventListener('input', () => this.calculate());
        this.readingSpeedInput.addEventListener('change', () => this.calculate());
        this.copyBtn.addEventListener('click', () => this.copyResults());
        
        // Initial calculation
        this.calculate();
    }

    calculate() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.resetResults();
            return;
        }

        // Count words
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        
        // Count characters
        const charCount = text.length;
        
        // Count sentences
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        // Calculate reading time
        const readingSpeed = parseInt(this.readingSpeedInput.value) || 200;
        const readingTimeMinutes = Math.ceil(wordCount / readingSpeed);
        
        // Update display
        this.wordCountEl.textContent = wordCount.toLocaleString();
        this.charCountEl.textContent = charCount.toLocaleString();
        this.sentenceCountEl.textContent = sentenceCount;
        
        // Format reading time
        if (readingTimeMinutes === 0) {
            this.readingTimeEl.textContent = '< 1 min';
        } else if (readingTimeMinutes === 1) {
            this.readingTimeEl.textContent = '1 min';
        } else {
            this.readingTimeEl.textContent = `${readingTimeMinutes} mins`;
        }

        // Calculate for different speeds
        const slowTime = Math.ceil(wordCount / 150);
        const avgTime = Math.ceil(wordCount / 200);
        const fastTime = Math.ceil(wordCount / 250);

        this.slowTimeEl.textContent = slowTime === 0 ? '< 1 min' : (slowTime === 1 ? '1 min' : `${slowTime} mins`);
        this.avgTimeEl.textContent = avgTime === 0 ? '< 1 min' : (avgTime === 1 ? '1 min' : `${avgTime} mins`);
        this.fastTimeEl.textContent = fastTime === 0 ? '< 1 min' : (fastTime === 1 ? '1 min' : `${fastTime} mins`);
    }

    resetResults() {
        this.readingTimeEl.textContent = '0 min';
        this.wordCountEl.textContent = '0';
        this.charCountEl.textContent = '0';
        this.sentenceCountEl.textContent = '0';
        this.slowTimeEl.textContent = '-';
        this.avgTimeEl.textContent = '-';
        this.fastTimeEl.textContent = '-';
    }

    copyResults() {
        const text = this.textInput.value;
        if (!text.trim()) {
            window.MicroTools?.utils?.showNotification?.('Please enter text first', 'warning');
            return;
        }

        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        const charCount = text.length;
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const readingSpeed = parseInt(this.readingSpeedInput.value) || 200;
        const readingTimeMinutes = Math.ceil(wordCount / readingSpeed);

        const results = `Reading Time Analysis:\n\nReading Time: ${readingTimeMinutes} min (@ ${readingSpeed} WPM)\nWords: ${wordCount}\nCharacters: ${charCount}\nSentences: ${sentenceCount}\n\nAlternative Speeds:\nSlow (150 WPM): ${Math.ceil(wordCount / 150)} min\nAverage (200 WPM): ${Math.ceil(wordCount / 200)} min\nFast (250 WPM): ${Math.ceil(wordCount / 250)} min`;

        navigator.clipboard.writeText(results).then(() => {
            window.MicroTools?.utils?.showNotification?.('Results copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ReadingTimeCalculator();
});