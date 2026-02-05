// Text Uppercase Tool
class UppercaseTool {
    constructor() {
        this.maxChars = 10000;
        
        this.elements = {
            input: document.getElementById('inputText'),
            output: document.getElementById('outputText'),
            clearBtn: document.getElementById('clearBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        
        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Real-time conversion on input
        this.elements.input.addEventListener('input', () => {
            this.convertRealTime();
        });
        
        // Character limit warning
        this.elements.input.addEventListener('input', this.checkCharacterLimit.bind(this));
    }
    
    convertRealTime() {
        const inputText = this.elements.input.value;
        
        if (!inputText) {
            this.elements.output.value = '';
            return;
        }
        
        // Convert to uppercase
        const uppercaseText = inputText.toUpperCase();
        this.elements.output.value = uppercaseText;
    }

    clear() {
        SharedUtilities.clearElements(
            { input: this.elements.input, output: this.elements.output },
            { 
                message: 'Text cleared',
                onClear: () => {
                    this.elements.input.focus();
                }
            }
        );
    }
    
    async copyToClipboard() {
        const text = this.elements.output.value;
        if (!text) {
            SharedUtilities.showNotification('No text to copy', 'warning');
            return;
        }
        
        if (window.MicroTools?.utils?.copyToClipboard) {
            await window.MicroTools.utils.copyToClipboard(text, this.elements.copyBtn);
        } else {
            // Fallback copy method
            this.elements.output.select();
            document.execCommand('copy');
            SharedUtilities.showNotification('Copied to clipboard!', 'success');
        }
    }
    
    download() {
        const text = this.elements.output.value;
        SharedUtilities.downloadAsFile(text, 'uppercase-text.txt', 'text/plain', {
            successMessage: 'Text downloaded as uppercase-text.txt'
        });
    }
    
    checkCharacterLimit() {
        const count = this.elements.input.value.length;
        if (count > this.maxChars) {
            SharedUtilities.showNotification(`Character limit exceeded (${this.maxChars} max). Text will be truncated.`, 'warning');
            this.elements.input.value = this.elements.input.value.substring(0, this.maxChars);
        }
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uppercaseTool = new UppercaseTool();
});