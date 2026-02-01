// Text Lowercase Tool - Standardized Implementation

class TextLowercaseTool {
    constructor() {
        // Configuration
        this.maxChars = 10000;
        this.exampleText = "HELLO! WELCOME TO THE LOWERCASE CONVERTER.\nTHIS TOOL WILL CONVERT ALL YOUR TEXT TO LOWERCASE LETTERS.\nTRY IT OUT WITH YOUR OWN TEXT!";

        // Element references
        this.input = document.getElementById('inputText');
        this.output = document.getElementById('outputText');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.init();
    }

    init() {
        // Setup event listeners
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }

        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyOutput());
        }

        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.download());
        }

        // Auto-convert on input
        if (this.input) {
            this.input.addEventListener('input', () => this.format());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'k' || e.key === 'K') {
                    e.preventDefault();
                    this.clearAll();
                }
            }
        });
    }


    format() {
        const inputText = this.input.value;

        if (!inputText.trim()) {
            this.output.value = '';
            return;
        }

        // Check character limit
        if (inputText.length > this.maxChars) {
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification(
                    `Character limit exceeded (${this.maxChars} max).`,
                    'warning'
                );
            }
            this.input.value = inputText.substring(0, this.maxChars);
            return;
        }

        // Convert to lowercase
        const lowercaseText = inputText.toLowerCase();
        this.output.value = lowercaseText;
    }

    clearAll() {
        this.input.value = '';
        this.output.value = '';
        this.input.focus();

        if (window.SharedUtilities?.showNotification) {
            window.SharedUtilities.showNotification('Cleared all', 'info');
        }
    }

    copyOutput() {
        const text = this.output.value;

        if (!text.trim()) {
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Nothing to copy', 'warning');
            }
            return;
        }

        try {
            // Use Clipboard API if available
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    if (window.SharedUtilities?.showNotification) {
                        window.SharedUtilities.showNotification('Copied to clipboard!', 'success');
                    }
                }).catch(() => {
                    this.fallbackCopy(text);
                });
            } else {
                this.fallbackCopy(text);
            }
        } catch (err) {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Copied to clipboard!', 'success');
            }
        } catch (err) {
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Copy failed', 'error');
            }
        }
        document.body.removeChild(textarea);
    }

    download() {
        const text = this.output.value;

        if (!text.trim()) {
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Nothing to download', 'warning');
            }
            return;
        }

        try {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'lowercase-text.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Downloaded successfully!', 'success');
            }
        } catch (err) {
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Download failed', 'error');
            }
        }
    }
}

// Initialize tool when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.textLowercaseTool = new TextLowercaseTool();
});