// Sentence Case Converter Tool

class SentenceCaseConverter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.sentenceStyle = document.getElementById('sentenceStyle');
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.convertText());
        this.sentenceStyle.addEventListener('change', () => this.convertText());
    }

    convertText() {
        const text = this.inputText.value;
        
        if (!text) {
            this.outputText.value = '';
            return;
        }

        const result = this.toSentenceCase(text);
        this.outputText.value = result;
        
        // Auto-copy and notify
        navigator.clipboard.writeText(result).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        });
    }

    toSentenceCase(text) {
        // Split by sentence boundaries (period, question mark, exclamation mark)
        const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
        
        const processedSentences = sentences.map(sentence => {
            sentence = sentence.trim();
            if (!sentence) return '';
            
            // Lowercase everything first
            let result = sentence.toLowerCase();
            
            // Capitalize first letter
            if (result.length > 0) {
                result = result.charAt(0).toUpperCase() + result.slice(1);
            }
            
            return result;
        });
        
        return processedSentences.join(' ').trim();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.sentenceCaseConverter = new SentenceCaseConverter();
});
