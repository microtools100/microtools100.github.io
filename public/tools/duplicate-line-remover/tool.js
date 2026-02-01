// Duplicate Line Remover Tool

class DuplicateLineRemover {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.caseSensitive = document.getElementById('caseSensitive');
        this.trimLines = document.getElementById('trimLines');
        this.sortLines = document.getElementById('sortLines');
        
        this.processBtn = document.getElementById('processBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.removeDuplicates());
        this.caseSensitive.addEventListener('change', () => this.removeDuplicates());
        this.trimLines.addEventListener('change', () => this.removeDuplicates());
        this.sortLines.addEventListener('change', () => this.removeDuplicates());
        
        this.processBtn.addEventListener('click', () => this.removeDuplicates());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // Keyboard shortcut: Ctrl/Cmd+Enter to process
        this.inputText.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.removeDuplicates();
            }
        });
    }

    removeDuplicates() {
        const text = this.inputText.value;
        
        if (!text) {
            this.outputText.value = '';
            return;
        }

        let lines = text.split('\n');
        const originalCount = lines.length;

        // Trim lines if option enabled
        if (this.trimLines.checked) {
            lines = lines.map(line => line.trim());
        }

        // Remove duplicates
        const seen = new Set();
        const uniqueLines = [];

        lines.forEach(line => {
            const compareValue = this.caseSensitive.checked ? line : line.toLowerCase();
            
            if (!seen.has(compareValue)) {
                seen.add(compareValue);
                uniqueLines.push(line);
            }
        });

        // Sort if enabled
        if (this.sortLines.checked) {
            uniqueLines.sort((a, b) => {
                const aVal = this.caseSensitive.checked ? a : a.toLowerCase();
                const bVal = this.caseSensitive.checked ? b : b.toLowerCase();
                return aVal.localeCompare(bVal);
            });
        }

        const result = uniqueLines.join('\n');
        this.outputText.value = result;

        // Show stats notification
        const removedCount = originalCount - uniqueLines.length;
        if (removedCount > 0) {
            SharedUtilities.showNotification(`Removed ${removedCount} duplicate(s)`, 'success');
        }
    }

    copyToClipboard() {
        const text = this.outputText.value;
        if (!text) {
            SharedUtilities.showNotification('No text to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            SharedUtilities.showNotification('Copied to clipboard!', 'success');
            this.copyBtn.textContent = '✓ Copied';
            setTimeout(() => {
                this.copyBtn.innerHTML = '<span>Copy</span><span>📋</span>';
            }, 2000);
        }).catch(() => {
            SharedUtilities.showNotification('Failed to copy', 'error');
        });
    }

    clearAll() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.inputText.focus();
        SharedUtilities.showNotification('Cleared!', 'success');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.duplicateLineRemover = new DuplicateLineRemover();
});
