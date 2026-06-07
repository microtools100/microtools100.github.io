// Title Case Converter Tool

class TitleCaseConverter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.titleStyle = document.getElementById('titleStyle');
        this.preserveCase = document.getElementById('preserveCase');
        
        // Buttons
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.init();
    }

    init() {
        // Real-time conversion on input
        this.inputText.addEventListener('input', () => this.convertText());
        
        // Convert when changing options
        this.titleStyle.addEventListener('change', () => this.convertText());
        this.preserveCase.addEventListener('change', () => this.convertText());
        
        // Button events
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
    }

    convertText() {
        const text = this.inputText.value;
        const style = this.titleStyle.value;
        const preserve = this.preserveCase.checked;

        if (!text) {
            this.outputText.value = '';
            return;
        }

        let result;
        switch(style) {
            case 'all-caps':
                result = text.toUpperCase();
                break;
            case 'first-letter':
                result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                break;
            case 'standard':
            default:
                result = this.toTitleCase(text, preserve);
        }

        this.outputText.value = result;

        // Auto-copy to clipboard with a small delay
        if (result.trim()) {
            setTimeout(() => {
                SharedUtilities.copyToClipboardSilently(result);
                SharedUtilities.showNotification('Converted and copied to clipboard', 'success');
            }, 10);
        }
    }

    copyToClipboard() {
        const result = this.outputText.value;
        if (!result) {
            SharedUtilities.showNotification('No text to copy', 'warning');
            return;
        }
        
        SharedUtilities.copyToClipboard(result, 'Copied to clipboard!', 'success');
    }

    downloadResult() {
        const result = this.outputText.value;
        if (!result) {
            SharedUtilities.showNotification('No text to download', 'warning');
            return;
        }
        
        SharedUtilities.downloadAsFile(result, 'title-case.txt', 'text/plain', {
            successMessage: 'Text downloaded as title-case.txt'
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

    toTitleCase(text, preserveAcronyms = true) {
        // Articles, conjunctions, and prepositions to keep lowercase
        const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'via', 'nor'];
        
        // Split by newlines to preserve paragraph structure
        const lines = text.split('\n');
        
        return lines.map(line => {
            // Split each line by whitespace
            const words = line.split(/\s+/).filter(word => word.length > 0);
            
            if (words.length === 0) {
                return '';
            }
            
            return words.map((word, index) => {
                // Keep acronyms if preserveAcronyms is true
                if (preserveAcronyms && /^[A-Z]{2,}$/.test(word)) {
                    return word;
                }

                const lowerWord = word.toLowerCase();
                
                // First and last words are always capitalized
                if (index === 0 || index === words.length - 1) {
                    return this.capitalizeWord(lowerWord);
                }

                // Keep small words lowercase
                if (smallWords.includes(lowerWord)) {
                    return lowerWord;
                }

                // Capitalize everything else
                return this.capitalizeWord(lowerWord);
            }).join(' ');
        }).join('\n');
    }

    capitalizeWord(word) {
        // Handle words with hyphens (e.g., "mother-in-law")
        if (word.includes('-')) {
            return word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
        }
        
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.titleCaseConverter = new TitleCaseConverter();
});
