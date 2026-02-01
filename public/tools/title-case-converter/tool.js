// Title Case Converter Tool

class TitleCaseConverter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.titleStyle = document.getElementById('titleStyle');
        this.preserveCase = document.getElementById('preserveCase');
        
        // Stats
        this.charCount = document.getElementById('charCount');
        this.wordCount = document.getElementById('wordCount');
        this.capitalPercent = document.getElementById('capitalPercent');
        
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
        this.titleStyle.addEventListener('change', () => this.convertText());
        this.preserveCase.addEventListener('change', () => this.convertText());
        
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
        const style = this.titleStyle.value;
        const preserve = this.preserveCase.checked;

        if (!text) {
            this.outputText.value = '';
            this.updateStats();
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
        this.updateStats();
    }

    updateStats() {
        const output = this.outputText.value;
        const input = this.inputText.value;
        
        const chars = output.length;
        const words = output.trim() ? output.trim().split(/\s+/).length : 0;
        
        // Calculate percentage of capital letters
        let capitalLetters = 0;
        let totalLetters = 0;
        
        for (let char of output) {
            if (/[a-zA-Z]/.test(char)) {
                totalLetters++;
                if (/[A-Z]/.test(char)) {
                    capitalLetters++;
                }
            }
        }
        
        const capitalPercent = totalLetters > 0 ? Math.round((capitalLetters / totalLetters) * 100) : 0;
        
        this.charCount.textContent = chars;
        this.wordCount.textContent = words;
        this.capitalPercent.textContent = capitalPercent + '%';
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
        element.setAttribute('download', 'title-case.txt');
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
        this.inputText.value = 'this is a sample heading\nhow to write better titles\napi documentation guide';
        this.convertText();
        this.inputText.focus();
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
