// HTML Escape/Unescape Tool
// Uses global auto-convert and auto-copy functions
class HTMLEscapeUnescape {
    constructor() {
        this.maxChars = 10000;
        this.elements = {
            inputText: document.getElementById('inputText'),
            outputText: document.getElementById('outputText'),
            escapeMode: document.getElementById('escapeMode'),
            unescapeMode: document.getElementById('unescapeMode'),
            clearBtn: document.getElementById('clearBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            inputLabel: document.getElementById('inputLabel'),
            outputLabel: document.getElementById('outputLabel'),
            errorMsg: document.querySelector('.error-msg')
        };
        
        this.isEscape = true;
        this.init();
    }

    init() {
        // Setup auto-convert: Real-time conversion as you type
        SharedUtilities.setupAutoConvert(
            this.elements.inputText,
            (inputText) => {
                if (this.isEscape) {
                    return this.escapeHtml(inputText);
                } else {
                    return this.unescapeHtml(inputText);
                }
            },
            this.elements.outputText,
            this.elements.errorMsg,
            300
        );

        // Setup auto-copy: Automatically copy to clipboard after conversion
        SharedUtilities.setupAutoCopy(this.elements.outputText, 500);

        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Mode selection
        this.elements.escapeMode.addEventListener('change', () => this.updateMode());
        this.elements.unescapeMode.addEventListener('change', () => this.updateMode());

        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());

        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.download());

        // Character limit warning
        this.elements.inputText.addEventListener('input', this.checkCharacterLimit.bind(this));
    }

    setupKeyboardShortcuts() {
        SharedUtilities.setupKeyboardShortcuts({
            'Escape': () => this.clear()
        });
    }

    updateMode() {
        this.isEscape = this.elements.escapeMode.checked;
        this.elements.inputLabel.textContent = this.isEscape ? 'Enter HTML to Escape:' : 'Enter HTML to Unescape:';
        this.elements.outputLabel.textContent = this.isEscape ? 'Escaped Result:' : 'Unescaped Result:';
        
        // Re-process with new mode
        const input = this.elements.inputText.value.trim();
        if (input) {
            try {
                let result;
                if (this.isEscape) {
                    result = this.escapeHtml(input);
                } else {
                    result = this.unescapeHtml(input);
                }
                this.elements.outputText.value = result;
                this.clearError();
            } catch (error) {
                this.showError('Error: Invalid input detected.');
                this.elements.outputText.value = '';
            }
        }
    }

    process() {
        const input = this.elements.inputText.value.trim();

        if (!input) {
            this.elements.outputText.value = '';
            this.clearError();
            return;
        }

        try {
            let result;
            if (this.isEscape) {
                result = this.escapeHtml(input);
            } else {
                result = this.unescapeHtml(input);
            }
            this.elements.outputText.value = result;
            this.clearError();

            // Auto-copy to clipboard with a small delay
            setTimeout(() => {
                SharedUtilities.copyToClipboardSilently(result);
                // Show success message
                const actionText = this.isEscape ? 'escaped' : 'unescaped';
                SharedUtilities.showNotification(`HTML ${actionText} and copied to clipboard`, 'success');
            }, 10);

            // Save to history
            this.saveToHistory(input, result);
        } catch (error) {
            this.showError(this.isEscape ? 'Error: Failed to escape HTML.' : 'Error: Failed to unescape HTML.');
            this.elements.outputText.value = '';
            const actionText = this.isEscape ? 'escaping' : 'unescaping';
            SharedUtilities.showNotification(`Error ${actionText} HTML`, 'error');
        }
    }

    clear() {
        SharedUtilities.clearElements(
            { inputData: this.elements.inputText, outputData: this.elements.outputText },
            { 
                message: 'HTML cleared',
                onClear: () => {
                    this.clearError();
                }
            }
        );
    }

    loadExample() {
        SharedUtilities.loadExample(this.elements.inputText, this.exampleText, () => {
            this.process();
            SharedUtilities.showNotification('Example loaded. Try different modes to see the effect.', 'info');
        });
    }

    async copyToClipboard() {
        const text = this.elements.outputText.value.trim();
        if (!text) {
            this.showError('No result to copy. Please escape or unescape HTML first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        SharedUtilities.copyToClipboard(text, 'Copied to clipboard!', 'success');
        this.clearError();
    }

    download() {
        const text = this.elements.outputText.value.trim();
        if (!text) {
            this.showError('No result to download. Please escape or unescape HTML first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const filename = this.isEscape ? 'html-escaped.txt' : 'html-unescaped.txt';
        SharedUtilities.downloadAsFile(text, filename, 'text/plain', {
            successMessage: `HTML downloaded as ${filename}`
        });
        this.clearError();
    }

    checkCharacterLimit() {
        const count = this.elements.inputText.value.length;
        if (count > this.maxChars) {
            SharedUtilities.showNotification(`Character limit exceeded (${this.maxChars} max). Text will be truncated.`, 'warning');
            this.elements.inputText.value = this.elements.inputText.value.substring(0, this.maxChars);
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return text.replace(/[&<>"'\/]/g, function(char) {
            return map[char];
        });
    }

    unescapeHtml(text) {
        const htmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x27;': "'",
            '&#x2F;': '/',
            '&#47;': '/',
            '&apos;': "'",
            '&nbsp;': '\u00A0',
            '&copy;': '©',
            '&reg;': '®',
            '&euro;': '€',
            '&pound;': '£',
            '&yen;': '¥',
            '&cent;': '¢',
            '&deg;': '°',
            '&sect;': '§',
            '&para;': '¶',
            '&middot;': '·',
            '&hellip;': '…',
            '&bull;': '•',
            '&prime;': '\u2032',
            '&Prime;': '\u2033',
            '&lsquo;': '\u2018',
            '&rsquo;': '\u2019',
            '&ldquo;': '\u201C',
            '&rdquo;': '\u201D',
            '&lsaquo;': '\u2039',
            '&rsaquo;': '\u203A',
            '&dagger;': '†',
            '&Dagger;': '‡',
            '&times;': '×',
            '&divide;': '÷',
            '&plusmn;': '±',
            '&minus;': '−',
            '&infin;': '∞',
            '&int;': '∫',
            '&sum;': '∑',
            '&prod;': '∏',
            '&radic;': '√',
            '&le;': '≤',
            '&ge;': '≥',
            '&ne;': '≠',
            '&equiv;': '≡'
        };

        let result = text;
        for (const entity in htmlEntities) {
            if (htmlEntities.hasOwnProperty(entity)) {
                const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                result = result.replace(regex, htmlEntities[entity]);
            }
        }

        result = result.replace(/&#(\d+);/g, function(match, dec) {
            try {
                return String.fromCharCode(parseInt(dec, 10));
            } catch (e) {
                return match;
            }
        });

        result = result.replace(/&#x([0-9a-fA-F]+);/gi, function(match, hex) {
            try {
                return String.fromCharCode(parseInt(hex, 16));
            } catch (e) {
                return match;
            }
        });

        return result;
    }

    saveToHistory(original, processed) {
        try {
            const history = JSON.parse(localStorage.getItem('htmlEscapeHistory') || '[]');
            history.unshift({
                original: original.substring(0, 100) + (original.length > 100 ? '...' : ''),
                processed: processed.substring(0, 100) + (processed.length > 100 ? '...' : ''),
                mode: this.isEscape ? 'escape' : 'unescape',
                timestamp: new Date().toISOString()
            });

            // Keep only last 10 items
            if (history.length > 10) {
                history.pop();
            }

            localStorage.setItem('htmlEscapeHistory', JSON.stringify(history));
        } catch (e) {
            // Silently fail if localStorage is full or not available
        }
    }

    executeCopy() {
        const outputText = this.elements.outputText.value;
        if (outputText) {
            SharedUtilities.copyToClipboardSilently(outputText);
            SharedUtilities.showNotification('Copied to clipboard', 'success');
        }
    }

    showError(message) {
        if (this.elements.errorMsg) {
            this.elements.errorMsg.textContent = message;
            this.elements.errorMsg.classList.add('show');
        }
    }

    clearError() {
        if (this.elements.errorMsg) {
            this.elements.errorMsg.textContent = '';
            this.elements.errorMsg.classList.remove('show');
        }
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.htmlEscapeUnescape = new HTMLEscapeUnescape();
});

