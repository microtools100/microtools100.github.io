// Base64 Encoder/Decoder Tool
class Base64Tool {
    constructor() {
        this.maxChars = 10000;
        this.elements = {
            inputText: document.getElementById('inputText'),
            outputText: document.getElementById('outputText'),
            encodeMode: document.getElementById('encodeMode'),
            decodeMode: document.getElementById('decodeMode'),
            clearBtn: document.getElementById('clearBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            inputLabel: document.getElementById('inputLabel'),
            outputLabel: document.getElementById('outputLabel'),
            errorMsg: document.querySelector('.error-msg')
        };
        
        this.isEncode = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Mode selection
        this.elements.encodeMode.addEventListener('change', () => this.updateMode());
        this.elements.decodeMode.addEventListener('change', () => this.updateMode());

        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());

        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.download());

        // Real-time processing on input
        this.elements.inputText.addEventListener('input', () => {
            this.processWithoutAutoCopy();
        });

        // Character limit warning
        this.elements.inputText.addEventListener('input', this.checkCharacterLimit.bind(this));
    }

    setupKeyboardShortcuts() {
        SharedUtilities.setupKeyboardShortcuts({
            'Escape': () => this.clear()
        });
    }

    updateMode() {
        this.isEncode = this.elements.encodeMode.checked;
        this.elements.inputLabel.textContent = this.isEncode ? 'Enter Text to Encode:' : 'Enter Base64 to Decode:';
        this.elements.outputLabel.textContent = this.isEncode ? 'Encoded Result:' : 'Decoded Result:';
        this.processWithoutAutoCopy();
    }

    processWithoutAutoCopy() {
        const input = this.elements.inputText.value.trim();

        if (!input) {
            this.elements.outputText.value = '';
            this.clearError();
            return;
        }

        try {
            let result;
            if (this.isEncode) {
                result = btoa(input);
            } else {
                result = atob(input);
            }
            this.elements.outputText.value = result;
            this.clearError();
        } catch (error) {
            this.showError('Error: Invalid input. Check your text for encoding errors.');
            this.elements.outputText.value = '';
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
            if (this.isEncode) {
                result = btoa(input);
            } else {
                result = atob(input);
            }
            this.elements.outputText.value = result;
            this.clearError();

            // Auto-copy to clipboard with a small delay
            setTimeout(() => {
                SharedUtilities.copyToClipboardSilently(result);
                // Show success message
                const actionText = this.isEncode ? 'encoded' : 'decoded';
                SharedUtilities.showNotification(`Text ${actionText} and copied to clipboard`, 'success');
            }, 10);

            // Save to history
            this.saveToHistory(input, result);
        } catch (error) {
            this.showError(this.isEncode ? 'Error: Invalid characters for encoding.' : 'Error: Invalid Base64 string.');
            this.elements.outputText.value = '';
            const actionText = this.isEncode ? 'encoding' : 'decoding';
            SharedUtilities.showNotification(`Error ${actionText} text`, 'error');
        }
    }

    clear() {
        SharedUtilities.clearElements(
            { inputData: this.elements.inputText, outputData: this.elements.outputText },
            { 
                message: 'Text cleared',
                onClear: () => {
                    this.clearError();
                }
            }
        );
    }

    loadExample() {
        this.elements.inputText.value = this.exampleText;
        this.process();
        SharedUtilities.showNotification('Example loaded. Try different modes to see the effect.', 'info');
    }

    async copyToClipboard() {
        const text = this.elements.outputText.value.trim();
        if (!text) {
            this.showError('No result to copy. Please encode or decode text first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        if (window.MicroTools?.utils?.copyToClipboard) {
            await window.MicroTools.utils.copyToClipboard(text, this.elements.copyBtn);
        } else {
            // Fallback copy method
            this.elements.outputText.select();
            document.execCommand('copy');
            SharedUtilities.showNotification('Copied to clipboard!', 'success');
        }
        this.clearError();
    }

    download() {
        const text = this.elements.outputText.value.trim();
        if (!text) {
            this.showError('No result to download. Please encode or decode text first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const filename = this.isEncode ? 'base64-encoded.txt' : 'base64-decoded.txt';
        SharedUtilities.downloadAsFile(text, filename, 'text/plain', {
            successMessage: `Text downloaded as ${filename}`
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

    saveToHistory(original, processed) {
        try {
            const history = JSON.parse(localStorage.getItem('base64History') || '[]');
            history.unshift({
                original: original.substring(0, 100) + (original.length > 100 ? '...' : ''),
                processed: processed.substring(0, 100) + (processed.length > 100 ? '...' : ''),
                mode: this.isEncode ? 'encode' : 'decode',
                timestamp: new Date().toISOString()
            });

            // Keep only last 10 items
            if (history.length > 10) {
                history.pop();
            }

            localStorage.setItem('base64History', JSON.stringify(history));
        } catch (e) {
            // Silently fail if localStorage is full or not available
            console.log('Could not save to history:', e);
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
    window.base64Tool = new Base64Tool();
});

