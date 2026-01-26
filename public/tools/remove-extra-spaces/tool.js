// Remove Extra Spaces Tool
class RemoveSpacesTool {
    constructor() {
        this.maxChars = 10000;
        this.exampleText = "This    is  a   sample    text  with\n\nmultiple    spaces\n  and\t\ttabs\n\nand empty lines.";
        
        this.elements = {
            input: document.getElementById('inputText'),
            output: document.getElementById('outputText'),
            cleanBtn: document.getElementById('cleanBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exampleBtn: document.getElementById('exampleBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            spacesRemoved: document.getElementById('spacesRemoved'),
            charCount: document.getElementById('charCount'),
            lineCount: document.getElementById('lineCount'),
            
            // Options
            removeDoubleSpaces: document.getElementById('removeDoubleSpaces'),
            removeTabs: document.getElementById('removeTabs'),
            trimLines: document.getElementById('trimLines'),
            removeEmptyLines: document.getElementById('removeEmptyLines'),
            normalizeLineBreaks: document.getElementById('normalizeLineBreaks')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.updateStats();
    }
    
    setupEventListeners() {
        // Clean button
        this.elements.cleanBtn.addEventListener('click', () => this.cleanText());
        
        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        
        // Example button
        this.elements.exampleBtn.addEventListener('click', () => this.loadExample());
        
        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Real-time cleaning on input
        this.elements.input.addEventListener('input', () => {
            this.updateStats();
            // Auto-clean if text is short
            if (this.elements.input.value.length <= 200) {
                this.cleanText();
            }
        });
        
        // Clean when options change
        const options = [
            this.elements.removeDoubleSpaces,
            this.elements.removeTabs,
            this.elements.trimLines,
            this.elements.removeEmptyLines,
            this.elements.normalizeLineBreaks
        ];
        
        options.forEach(option => {
            option.addEventListener('change', () => this.cleanText());
        });
        
        // Character limit warning
        this.elements.input.addEventListener('input', this.checkCharacterLimit.bind(this));
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to clean
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.cleanText();
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
    
    cleanText() {
        const inputText = this.elements.input.value;
        
        if (!inputText.trim()) {
            this.elements.output.value = '';
            this.updateStats();
            return;
        }
        
        let cleanedText = inputText;
        const originalLength = cleanedText.length;
        
        // Apply selected cleaning options
        if (this.elements.normalizeLineBreaks.checked) {
            cleanedText = cleanedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        }
        
        if (this.elements.removeTabs.checked) {
            cleanedText = cleanedText.replace(/\t/g, ' ');
        }
        
        if (this.elements.removeDoubleSpaces.checked) {
            // Replace 2 or more spaces with single space
            cleanedText = cleanedText.replace(/[ \t]{2,}/g, ' ');
        }
        
        if (this.elements.trimLines.checked) {
            // Trim spaces from start and end of each line
            cleanedText = cleanedText.split('\n').map(line => line.trim()).join('\n');
        }
        
        if (this.elements.removeEmptyLines.checked) {
            // Remove lines that are empty or contain only whitespace
            cleanedText = cleanedText.split('\n').filter(line => line.trim().length > 0).join('\n');
        }
        
        // Also trim the entire text
        cleanedText = cleanedText.trim();
        
        this.elements.output.value = cleanedText;
        
        // Update stats
        this.updateStats();
        
        // Auto-copy to clipboard with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.copyToClipboardSilently(cleanedText);
            // Show success message
            this.showNotification('Copied to clipboard', 'success');
        }, 10);
        
        // Save to history
        this.saveToHistory(inputText, cleanedText);
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
        this.cleanText();
        this.showNotification('Example loaded. Try different options to see the effect.', 'info');
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
        a.download = 'cleaned-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text downloaded as cleaned-text.txt', 'success');
    }
    
    updateStats() {
        const inputText = this.elements.input.value;
        const outputText = this.elements.output.value;
        
        // Character count
        const inputCharCount = inputText.length;
        const outputCharCount = outputText.length;
        
        this.elements.charCount.textContent = this.formatNumber(outputCharCount || inputCharCount);
        
        // Spaces removed
        if (inputCharCount > 0 && outputCharCount > 0) {
            const spacesRemoved = inputCharCount - outputCharCount;
            this.elements.spacesRemoved.textContent = this.formatNumber(Math.max(0, spacesRemoved));
        } else {
            this.elements.spacesRemoved.textContent = '0';
        }
        
        // Line count
        const lines = (outputText || inputText).split('\n').length;
        this.elements.lineCount.textContent = this.formatNumber(lines);
        
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
    
    saveToHistory(original, cleaned) {
        try {
            const history = JSON.parse(localStorage.getItem('spaceCleanerHistory') || '[]');
            history.unshift({
                original: original.substring(0, 100) + (original.length > 100 ? '...' : ''),
                cleaned: cleaned.substring(0, 100) + (cleaned.length > 100 ? '...' : ''),
                options: this.getOptions(),
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 10 items
            if (history.length > 10) {
                history.pop();
            }
            
            localStorage.setItem('spaceCleanerHistory', JSON.stringify(history));
        } catch (e) {
            // Silently fail if localStorage is full or not available
            console.log('Could not save to history:', e);
        }
    }
    
    getOptions() {
        return {
            removeDoubleSpaces: this.elements.removeDoubleSpaces.checked,
            removeTabs: this.elements.removeTabs.checked,
            trimLines: this.elements.trimLines.checked,
            removeEmptyLines: this.elements.removeEmptyLines.checked,
            normalizeLineBreaks: this.elements.normalizeLineBreaks.checked
        };
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
    window.removeSpacesTool = new RemoveSpacesTool();
});