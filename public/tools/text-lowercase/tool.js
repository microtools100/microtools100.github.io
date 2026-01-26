// Text Lowercase Tool
class LowercaseTool {
    constructor() {
        this.maxChars = 10000;
        this.exampleText = "HELLO! WELCOME TO THE LOWERCASE CONVERTER.\nTHIS TOOL WILL CONVERT ALL YOUR TEXT TO LOWERCASE LETTERS.\nTRY IT OUT WITH YOUR OWN TEXT!";
        
        this.elements = {
            input: document.getElementById('inputText'),
            output: document.getElementById('outputText'),
            convertBtn: document.getElementById('convertBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exampleBtn: document.getElementById('exampleBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            charCount: document.getElementById('charCount'),
            wordCount: document.getElementById('wordCount'),
            lowercaseCount: document.getElementById('lowercaseCount')
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
        
        // Convert to lowercase
        const lowercaseText = inputText.toLowerCase();
        this.elements.output.value = lowercaseText;
        
        // Update stats
        this.updateStats();
        
        // Auto-copy to clipboard with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.copyToClipboardSilently(lowercaseText);
            // Show success message
            this.showNotification('Copied to clipboard', 'success');
        }, 10);
        
        // Save to recent conversions
        this.saveToHistory(inputText, lowercaseText);
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
        try {
            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => {
                    // Fallback if clipboard API fails
                    this.fallbackCopy(text);
                });
            } else {
                // Fallback for older browsers
                this.fallbackCopy(text);
            }
        } catch (err) {
            // Final fallback
            this.fallbackCopy(text);
        }
    }
    
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textarea);
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
        a.download = 'lowercase-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text downloaded as lowercase-text.txt', 'success');
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
        
        // Lowercase percentage
        if (inputText.length > 0) {
            const lowercaseChars = (inputText.match(/[a-z]/g) || []).length;
            const uppercaseChars = (inputText.match(/[A-Z]/g) || []).length;
            const totalLetters = lowercaseChars + uppercaseChars;
            
            if (totalLetters > 0) {
                const percentage = Math.round((lowercaseChars / totalLetters) * 100);
                this.elements.lowercaseCount.textContent = `${percentage}%`;
            } else {
                this.elements.lowercaseCount.textContent = 'N/A';
            }
        } else {
            this.elements.lowercaseCount.textContent = '0%';
        }
        
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
            const history = JSON.parse(localStorage.getItem('lowercaseHistory') || '[]');
            history.unshift({
                original: original.substring(0, 100) + (original.length > 100 ? '...' : ''),
                converted: converted.substring(0, 100) + (converted.length > 100 ? '...' : ''),
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 10 items
            if (history.length > 10) {
                history.pop();
            }
            
            localStorage.setItem('lowercaseHistory', JSON.stringify(history));
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
    window.lowercaseTool = new LowercaseTool();
});