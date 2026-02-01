// URL Encoder/Decoder Tool
class URLEncoderDecoder {
    constructor() {
        this.maxChars = 10000;
        this.autoCopyDelay = 500; // 0.5 second delay before auto-copying
        this.keystrokeDelay = null; // Keystroke delay handler
        this.exampleText = "https://example.com/search?q=hello world&filter=status=active";
        
        this.elements = {
            inputURL: document.getElementById('inputURL'),
            outputURL: document.getElementById('outputURL'),
            encodeMode: document.getElementById('encodeMode'),
            decodeMode: document.getElementById('decodeMode'),
            processBtn: document.getElementById('processBtn'),
            processBtnText: document.getElementById('processBtnText'),
            clearBtn: document.getElementById('clearBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            exampleBtn: document.getElementById('exampleBtn'),
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
        // Initialize keystroke delay handler using global utility
        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(
            () => this.executeCopy(),
            this.autoCopyDelay
        );
    }

    setupEventListeners() {
        // Mode selection
        this.elements.encodeMode.addEventListener('change', () => this.updateMode());
        this.elements.decodeMode.addEventListener('change', () => this.updateMode());

        // Process button
        this.elements.processBtn.addEventListener('click', () => this.process());

        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());

        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.download());

        // Example button
        if (document.getElementById('exampleBtn')) {
            document.getElementById('exampleBtn').addEventListener('click', () => this.loadExample());
        }

        // Real-time processing on input
        this.elements.inputURL.addEventListener('input', () => {
            this.processWithoutAutoCopy();
            // Schedule auto-copy after keystroke delay
            this.keystrokeDelay.schedule();
        });

        // Character limit warning
        this.elements.inputURL.addEventListener('input', this.checkCharacterLimit.bind(this));
    }

    setupKeyboardShortcuts() {
        SharedUtilities.setupKeyboardShortcuts({
            'Ctrl+Enter': () => this.process(),
            'Escape': () => this.clear(),
            'Ctrl+E': () => this.loadExample()
        });
    }

    updateMode() {
        this.isEncode = this.elements.encodeMode.checked;
        this.elements.inputLabel.textContent = this.isEncode ? 'Enter URL to Encode:' : 'Enter URL to Decode:';
        this.elements.outputLabel.textContent = this.isEncode ? 'Encoded Result:' : 'Decoded Result:';
        this.elements.processBtnText.textContent = this.isEncode ? 'Encode URL' : 'Decode URL';
        this.process();
    }

    processWithoutAutoCopy() {
        const input = this.elements.inputURL.value.trim();

        if (!input) {
            this.elements.outputURL.value = '';
            this.clearError();
            return;
        }

        try {
            let result;
            if (this.isEncode) {
                result = encodeURIComponent(input);
            } else {
                result = decodeURIComponent(input);
            }
            this.elements.outputURL.value = result;
            this.clearError();
        } catch (error) {
            this.showError('Error: Invalid characters for decoding. Check your input.');
            this.elements.outputURL.value = '';
        }
    }

    process() {
        const input = this.elements.inputURL.value.trim();

        if (!input) {
            this.elements.outputURL.value = '';
            this.clearError();
            return;
        }

        try {
            let result;
            if (this.isEncode) {
                result = encodeURIComponent(input);
            } else {
                result = decodeURIComponent(input);
            }
            this.elements.outputURL.value = result;
            this.clearError();

            // Auto-copy to clipboard with a small delay
            setTimeout(() => {
                SharedUtilities.copyToClipboardSilently(result);
                // Show success message
                SharedUtilities.showNotification('Copied to clipboard', 'success');
            }, 10);

            // Save to history
            this.saveToHistory(input, result);
        } catch (error) {
            this.showError('Error: Invalid characters for decoding. Check your input.');
            this.elements.outputURL.value = '';
            SharedUtilities.showNotification('Error processing URL', 'error');
        }
    }

    clear() {
        SharedUtilities.clearElements(
            { inputData: this.elements.inputURL, outputData: this.elements.outputURL },
            { 
                message: 'URL cleared',
                onClear: () => {
                    this.clearError();
                }
            }
        );
    }

    loadExample() {
        this.elements.inputURL.value = this.exampleText;
        this.process();
        SharedUtilities.showNotification('Example loaded. Try different modes to see the effect.', 'info');
    }

    async copyToClipboard() {
        const text = this.elements.outputURL.value.trim();
        if (!text) {
            this.showError('No result to copy. Please encode or decode a URL first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        if (window.MicroTools?.utils?.copyToClipboard) {
            await window.MicroTools.utils.copyToClipboard(text, this.elements.copyBtn);
        } else {
            // Fallback copy method
            this.elements.outputURL.select();
            document.execCommand('copy');
            SharedUtilities.showNotification('Copied to clipboard!', 'success');
        }
        this.clearError();
    }

    download() {
        const text = this.elements.outputURL.value.trim();
        if (!text) {
            this.showError('No result to download. Please encode or decode a URL first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const filename = this.isEncode ? 'encoded-url.txt' : 'decoded-url.txt';
        SharedUtilities.downloadAsFile(text, filename, 'text/plain', {
            successMessage: `URL downloaded as ${filename}`
        });
        this.clearError();
    }

    checkCharacterLimit() {
        const count = this.elements.inputURL.value.length;
        if (count > this.maxChars) {
            SharedUtilities.showNotification(`Character limit exceeded (${this.maxChars} max). Text will be truncated.`, 'warning');
            this.elements.inputURL.value = this.elements.inputURL.value.substring(0, this.maxChars);
        }
    }

    saveToHistory(original, processed) {
        try {
            const history = JSON.parse(localStorage.getItem('urlEncoderHistory') || '[]');
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

            localStorage.setItem('urlEncoderHistory', JSON.stringify(history));
        } catch (e) {
            // Silently fail if localStorage is full or not available
            console.log('Could not save to history:', e);
        }
    }

    executeCopy() {
        const outputText = this.elements.outputURL.value;
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
    window.urlEncoderDecoder = new URLEncoderDecoder();
});

