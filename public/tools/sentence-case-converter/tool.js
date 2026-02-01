// Sentence Case Converter Tool

class SentenceCaseConverter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.sentenceStyle = document.getElementById('sentenceStyle');
        
        // Stats
        this.charCount = document.getElementById('charCount');
        this.wordCount = document.getElementById('wordCount');
        
        // Buttons
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.exampleBtn = document.getElementById('exampleBtn');
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.handleInput());
        this.sentenceStyle.addEventListener('change', () => this.convertText());
        
        this.convertBtn.addEventListener('click', () => this.convertText());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
        this.exampleBtn.addEventListener('click', () => this.loadExample());
        
        // Keyboard shortcuts
        this.inputText.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.convertText();
            }
        });
    }

    handleInput() {
        this.convertText();
        this.updateStats();
    }

    convertText() {
        const text = this.inputText.value;
        
        if (!text) {
            this.outputText.value = '';
            this.updateStats();
            return;
        }

        const result = this.toSentenceCase(text);
        this.outputText.value = result;
        this.updateStats();
    }

    updateStats() {
        const output = this.outputText.value;
        
        const chars = output.length;
        const words = output.trim() ? output.trim().split(/\s+/).length : 0;
        
        this.charCount.textContent = chars;
        this.wordCount.textContent = words;
    }

    copyToClipboard() {
        const result = this.outputText.value;
        if (result) {
            navigator.clipboard.writeText(result).then(() => {
                SharedUtilities.showNotification('Copied to clipboard!', 'success');
                this.copyBtn.textContent = '✓ Copied';
                setTimeout(() => {
                    this.copyBtn.innerHTML = '<span>Copy</span><span>📋</span>';
                }, 2000);
            });
        }
    }

    downloadResult() {
        const result = this.outputText.value;
        if (!result) {
            SharedUtilities.showNotification('No text to download', 'warning');
            return;
        }
        
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
        element.setAttribute('download', 'sentence-case.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        SharedUtilities.showNotification('Downloaded successfully!', 'success');
    }

    clearAll() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.updateStats();
        this.inputText.focus();
    }

    loadExample() {
        this.inputText.value = 'convert this text to sentence case. it should have proper capitalization. everything starts with a capital letter after periods.';
        this.convertText();
        this.inputText.focus();
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
