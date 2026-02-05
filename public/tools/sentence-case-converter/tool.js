// Sentence Case Converter Tool

class SentenceCaseConverter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.sentenceStyle = document.getElementById('sentenceStyle');
        
        // Buttons
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.init();
    }

    init() {
        // Real-time conversion on input
        this.inputText.addEventListener('input', () => this.convertText());
        
        // Convert when changing style option
        this.sentenceStyle.addEventListener('change', () => this.convertText());
        
        // Button events
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
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

    copyToClipboard() {
        const result = this.outputText.value;
        if (!result) {
            SharedUtilities.showNotification('No text to copy', 'warning');
            return;
        }
        
        if (window.MicroTools?.utils?.copyToClipboard) {
            window.MicroTools.utils.copyToClipboard(result, this.copyBtn);
        } else {
            // Fallback copy method
            this.outputText.select();
            document.execCommand('copy');
            SharedUtilities.showNotification('Copied to clipboard!', 'success');
        }
    }

    downloadResult() {
        const result = this.outputText.value;
        if (!result) {
            SharedUtilities.showNotification('No text to download', 'warning');
            return;
        }
        
        SharedUtilities.downloadAsFile(result, 'sentence-case.txt', 'text/plain', {
            successMessage: 'Text downloaded as sentence-case.txt'
        });
    }

    clearAll() {
        SharedUtilities.clearElements(
            { input: this.inputText, output: this.outputText },
            { 
                message: 'Text cleared',
                onClear: () => {
                    this.inputText.focus();
                }
            }
        );
    }

    toSentenceCase(text) {
        // Split by newlines to preserve paragraph structure
        const lines = text.split('\n');
        
        return lines.map(line => {
            // Split by sentence boundaries (period, question mark, exclamation mark)
            const sentences = line.match(/[^.!?]+[.!?]*/g) || (line.trim() ? [line] : []);
            
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
        }).join('\n');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.sentenceCaseConverter = new SentenceCaseConverter();
});
