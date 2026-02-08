class TextSummarizer {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.summaryLength = document.getElementById('summaryLength');
        this.summarizeBtn = document.getElementById('summarizeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.charCount = document.getElementById('charCount');
        this.reductionStats = document.getElementById('reductionStats');

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.inputText.addEventListener('input', () => this.updateCharCount());
        this.summarizeBtn.addEventListener('click', () => this.summarize());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyOutput());
        this.downloadBtn.addEventListener('click', () => this.downloadOutput());
    }

    updateCharCount() {
        const text = this.inputText.value;
        const charCount = text.length;
        const sentences = this.extractSentences(text).length;
        
        this.charCount.textContent = `Characters: ${charCount} | Sentences: ${sentences}`;
    }

    extractSentences(text) {
        // Split by sentence terminators
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const sentences = text.match(sentenceRegex) || [];
        return sentences.map(s => s.trim()).filter(s => s.length > 0);
    }

    calculateWordFrequency(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const frequency = {};
        
        // Common stop words to ignore
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                                   'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'do', 'does',
                                   'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'of',
                                   'it', 'this', 'that', 'which', 'who', 'whom', 'what', 'when', 'where', 'why',
                                   'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
                                   'some', 'such', 'no', 'nor', 'not', 'only', 'same', 'so', 'than', 'too',
                                   'very', 'as', 'with', 'from', 'up', 'about', 'into', 'through', 'by']);
        
        words.forEach(word => {
            if (word.length > 3 && !stopWords.has(word)) {
                frequency[word] = (frequency[word] || 0) + 1;
            }
        });
        
        return frequency;
    }

    scoreSentence(sentence, wordFreq) {
        const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        let score = 0;
        
        words.forEach(word => {
            if (wordFreq[word]) {
                score += wordFreq[word];
            }
        });
        
        return score;
    }

    summarize() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.outputText.value = '';
            return;
        }

        const sentences = this.extractSentences(text);
        if (sentences.length === 0) {
            this.outputText.value = 'No sentences found in the text.';
            return;
        }

        const summaryLengthPercent = parseInt(this.summaryLength.value);
        const summaryCount = Math.max(1, Math.ceil(sentences.length * (summaryLengthPercent / 100)));

        // Calculate word frequency
        const wordFreq = this.calculateWordFrequency(text);

        // Score each sentence
        const scoredSentences = sentences.map((sentence, index) => ({
            text: sentence,
            score: this.scoreSentence(sentence, wordFreq),
            originalIndex: index
        }));

        // Select top sentences
        const topSentences = scoredSentences
            .sort((a, b) => b.score - a.score)
            .slice(0, summaryCount)
            .sort((a, b) => a.originalIndex - b.originalIndex);

        // Create summary
        const summary = topSentences.map(s => s.text).join(' ');
        this.outputText.value = summary;

        // Update stats
        const reduction = Math.round(((sentences.length - topSentences.length) / sentences.length) * 100);
        this.reductionStats.textContent = `Reduction: ${reduction}% | Summary: ${topSentences.length} sentences`;
    }

    clearAll() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.charCount.textContent = 'Characters: 0 | Sentences: 0';
        this.reductionStats.textContent = 'Reduction: 0% | Summary: 0 sentences';
        this.inputText.focus();
    }

    copyOutput() {
        if (this.outputText.value) {
            navigator.clipboard.writeText(this.outputText.value).then(() => {
                showNotification('Summary copied to clipboard!', 'success');
            });
        }
    }

    downloadOutput() {
        const text = this.outputText.value;
        if (text) {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'summary.txt');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TextSummarizer();
});
