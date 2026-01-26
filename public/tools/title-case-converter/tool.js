// Title Case Converter Tool

class TitleCaseConverter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.titleStyle = document.getElementById('titleStyle');
        this.preserveCase = document.getElementById('preserveCase');
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.convertText());
        this.titleStyle.addEventListener('change', () => this.convertText());
        this.preserveCase.addEventListener('change', () => this.convertText());
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
        
        // Auto-copy and notify
        navigator.clipboard.writeText(result).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        });
    }

    toTitleCase(text, preserveAcronyms = true) {
        // Articles, conjunctions, and prepositions to keep lowercase
        const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'via', 'nor'];
        
        const words = text.split(/\s+/);
        
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
