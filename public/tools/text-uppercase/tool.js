// Text Uppercase Tool
class UppercaseTool {
    constructor() {
        this.maxChars = 10000;
        this.exampleText = "Hello! Welcome to the Uppercase Converter.\nThis tool will convert all your text to uppercase letters.\nTry it out with your own text!";
        
        this.elements = {
            input: document.getElementById('inputText'),
            output: document.getElementById('outputText'),
            convertBtn: document.getElementById('convertBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exampleBtn: document.getElementById('exampleBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            charCount: document.getElementById('charCount'),
            wordCount: document.getElementById('wordCount')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.updateStats();
    }
    
    setupEventListeners() {
        // Convert button
        this.elements.convertBtn.addEventListener('click', () => this.convert());
        
        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        
        // Example button
        this.elements.exampleBtn.addEventListener('click', () => this.loadExample());
        
        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Real-time conversion on input
        this.elements.input.addEventListener('input', () => {
            this.updateStats();
            // Auto-convert if text is short
            if (this.elements.input.value.length <= 100) {
                this.convert();
            }
        });
        
        // Character limit warning
        this.elements.input.addEventListener('input', this.checkCharacterLimit.bind(this));
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to convert
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.convert();
            }
            
            // Escape to clear
            if (e.key === 'Escape') {
                this.clear();
            }
            
            // Ctrl/Cmd + E for example
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.loadExample();
            }
        });
    }
    
    convert() {
        const inputText = this.elements.input.value.trim();
        
        if (!inputText) {
            this.showNotification('Please enter some text first', 'warning');
            this.elements.output.value = '';
            return;
        }
        
        // Convert to uppercase
        const uppercaseText = inputText.toUpperCase();
        this.elements.output.value = uppercaseText;
        
        // Update stats
        this.updateStats();
        
        // Show success notification first
        this.showNotification('Copied to clipboard', 'success');
        
        // Auto-copy to clipboard with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.copyToClipboardSilently(uppercaseText);
        }, 50);
        
        // Save to recent conversions
        this.saveToHistory(inputText, uppercaseText);
    }
    
    clear() {
        this.elements.input.value = '';
        this.elements.output.value = '';
        this.updateStats();
        this.elements.input.focus();
        this.showNotification('Text cleared', 'info');
    }
    
    loadExample() {
        this.elements.input.value = this.exampleText;
        this.convert();
        this.showNotification('Example loaded. Edit the text and click convert.', 'info');
    }
    
    async copyToClipboard() {
        const text = this.elements.output.value;
        if (!text) {
            this.showNotification('No text to copy', 'warning');
            return;
        }
        
        if (window.MicroTools?.utils?.copyToClipboard) {
            await window.MicroTools.utils.copyToClipboard(text, this.elements.copyBtn);
        } else {
            // Fallback copy method
            this.elements.output.select();
            document.execCommand('copy');
            this.showNotification('Copied to clipboard!', 'success');
        }
    }
    
    copyToClipboardSilently(text) {
        // Copy without showing notification (used for auto-copy)
        console.log('copyToClipboardSilently called with text:', text.substring(0, 20) + '...');
        try {
            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                console.log('Using Clipboard API');
                navigator.clipboard.writeText(text).catch(() => {
                    // Fallback if clipboard API fails
                    console.log('Clipboard API failed, using fallback');
                    this.fallbackCopy(text);
                });
            } else {
                // Fallback for older browsers
                console.log('Clipboard API not available, using fallback');
                this.fallbackCopy(text);
            }
        } catch (err) {
            // Final fallback
            console.error('Exception in copyToClipboardSilently:', err);
            this.fallbackCopy(text);
        }
    }
    
    fallbackCopy(text) {
        console.log('fallbackCopy called');
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '-9999px';
            textarea.style.opacity = '0';
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = '0';
            textarea.style.border = 'none';
            document.body.appendChild(textarea);
            
            // Focus and select
            textarea.focus();
            textarea.setSelectionRange(0, textarea.value.length);
            console.log('Textarea created and focused');
            
            // Execute copy
            const successful = document.execCommand('copy');
            console.log('execCommand copy result:', successful);
            if (!successful) {
                console.error('Copy command was unsuccessful');
            }
            
            document.body.removeChild(textarea);
            console.log('Copy operation completed');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
    }
    
    download() {
        const text = this.elements.output.value;
        if (!text) {
            this.showNotification('No text to download', 'warning');
            return;
        }
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uppercase-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text downloaded as uppercase-text.txt', 'success');
    }
    
    updateStats() {
        const inputText = this.elements.input.value;
        const outputText = this.elements.output.value;
        
        // Character count
        const inputCharCount = inputText.length;
        const outputCharCount = outputText.length;
        
        this.elements.charCount.textContent = this.formatNumber(outputCharCount || inputCharCount);
        
        // Word count (simple word count)
        const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
        this.elements.wordCount.textContent = this.formatNumber(words.length);
        
        // Update input character counter
        this.updateCharCounter(inputCharCount);
    }
    
    updateCharCounter(count) {
        let counter = document.querySelector('.char-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter';
            this.elements.input.parentElement.appendChild(counter);
        }
        
        counter.textContent = `${this.formatNumber(count)}/${this.formatNumber(this.maxChars)}`;
        
        // Add warning class if near limit
        if (count > this.maxChars * 0.9) {
            counter.style.color = 'var(--error-color)';
            counter.style.fontWeight = 'bold';
        } else if (count > this.maxChars * 0.75) {
            counter.style.color = 'var(--warning-color)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }
    
    checkCharacterLimit() {
        const count = this.elements.input.value.length;
        if (count > this.maxChars) {
            this.showNotification(`Character limit exceeded (${this.maxChars} max). Text will be truncated.`, 'warning');
            this.elements.input.value = this.elements.input.value.substring(0, this.maxChars);
        }
    }
    
    saveToHistory(original, converted) {
        try {
            const history = JSON.parse(localStorage.getItem('uppercaseHistory') || '[]');
            history.unshift({
                original: original.substring(0, 100) + (original.length > 100 ? '...' : ''),
                converted: converted.substring(0, 100) + (converted.length > 100 ? '...' : ''),
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 10 items
            if (history.length > 10) {
                history.pop();
            }
            
            localStorage.setItem('uppercaseHistory', JSON.stringify(history));
        } catch (e) {
            // Silently fail if localStorage is full or not available
            console.log('Could not save to history:', e);
        }
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    showNotification(message, type = 'info') {
        if (window.MicroTools?.utils?.showNotification) {
            window.MicroTools.utils.showNotification(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uppercaseTool = new UppercaseTool();
});