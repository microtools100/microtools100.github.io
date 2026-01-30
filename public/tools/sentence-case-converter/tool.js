// Sentence Case Converter Tool

class SentenceCaseConverter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.sentenceStyle = document.getElementById('sentenceStyle');
        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(() => this.autoCopy());
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.debouncedConvertText());
        this.sentenceStyle.addEventListener('change', () => this.convertText());
    }

    debouncedConvertText() {
        this.convertText();
        this.keystrokeDelay.schedule();
    }

    convertText() {
        const text = this.inputText.value;
        
        if (!text) {
            this.outputText.value = '';
            return;
        }

        const result = this.toSentenceCase(text);
        this.outputText.value = result;
    }

    autoCopy() {
        const result = this.outputText.value;
        if (result) {
            navigator.clipboard.writeText(result).then(() => {
                SharedUtilities.showNotification('Copied to clipboard!', 'success');
            });
        }
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
