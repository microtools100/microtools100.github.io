// Remove Extra Spaces Tool
class RemoveSpacesTool {
    constructor() {
        this.maxChars = 10000;
        this.autoCopyDelay = 500; // 0.5 second delay before auto-copying
        this.keystrokeDelay = null; // Keystroke delay handler
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
            errorMsg: document.querySelector('.error-msg'),
            
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
        // Initialize keystroke delay handler using global utility
        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(
            () => this.executeCopy(),
            this.autoCopyDelay
        );
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
        
        // Real-time cleaning on input with keystroke delay for auto-copy
        this.elements.input.addEventListener('input', () => {
            this.updateStats();
            // Always clean in real-time - no character limit
            this.cleanTextWithoutAutoCopy();
            // Schedule auto-copy after keystroke delay
            this.keystrokeDelay.schedule();
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
        SharedUtilities.setupKeyboardShortcuts({
            'Ctrl+Enter': () => this.cleanText(),
            'Escape': () => this.clear(),
            'Ctrl+E': () => this.loadExample()
        });
    }
    
    cleanTextWithoutAutoCopy() {
        const inputText = this.elements.input.value;
        
        if (!inputText.trim()) {
            this.elements.output.value = '';
            this.updateStats();
            return;
        }
        
        let cleanedText = inputText;
        
        // Apply selected cleaning options
        if (this.elements.normalizeLineBreaks.checked) {
            cleanedText = cleanedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        }

        if (this.elements.removeEmptyLines.checked) {
            cleanedText = cleanedText.split('\n').filter(line => line.trim()).join('\n');
        }

        if (this.elements.trimLines.checked) {
            cleanedText = cleanedText.split('\n').map(line => line.trim()).join('\n');
        }

        if (this.elements.removeTabs.checked) {
            cleanedText = cleanedText.replace(/\t/g, ' ');
        }

        if (this.elements.removeDoubleSpaces.checked) {
            cleanedText = cleanedText.replace(/ {2,}/g, ' ');
        }

        this.elements.output.value = cleanedText;
        this.updateStats();
    }
    
    executeCopy() {
        const outputText = this.elements.output.value;
        if (outputText) {
            SharedUtilities.copyToClipboardSilently(outputText);
            SharedUtilities.showNotification('Copied to clipboard', 'success');
        }
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
            SharedUtilities.copyToClipboardSilently(cleanedText);
            // Show success message
            SharedUtilities.showNotification('Copied to clipboard', 'success');
        }, 10);
        
        // Save to history
        this.saveToHistory(inputText, cleanedText);
    }
    
    clear() {
        SharedUtilities.clearElements(
            { inputData: this.elements.input, outputData: this.elements.output },
            { 
                message: 'Text cleared',
                onClear: () => {
                    this.updateStats();
                    this.clearError();
                }
            }
        );
    }
    
    loadExample() {
        this.elements.input.value = this.exampleText;
        this.cleanText();
        SharedUtilities.showNotification('Example loaded. Try different options to see the effect.', 'info');
    }
    
    async copyToClipboard() {
        const text = this.elements.output.value.trim();
        if (!text) {
            this.showError('No text to copy. Please clean some text first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
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
        this.clearError();
    }
    
    download() {
        const text = this.elements.output.value.trim();
        if (!text) {
            this.showError('No text to download. Please clean some text first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        SharedUtilities.downloadAsFile(text, 'cleaned-text.txt', 'text/plain', {
            successMessage: 'Text downloaded as cleaned-text.txt'
        });
        this.clearError();
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
            SharedUtilities.showNotification(`Character limit exceeded (${this.maxChars} max). Text will be truncated.`, 'warning');
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
    window.removeSpacesTool = new RemoveSpacesTool();
});