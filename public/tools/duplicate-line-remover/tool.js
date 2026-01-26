// Duplicate Line Remover Tool

class DuplicateLineRemover {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.caseSensitive = document.getElementById('caseSensitive');
        this.trimLines = document.getElementById('trimLines');
        this.sortLines = document.getElementById('sortLines');
        this.statsContainer = document.querySelector('.stats-container');
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.removeDuplicates());
        this.caseSensitive.addEventListener('change', () => this.removeDuplicates());
        this.trimLines.addEventListener('change', () => this.removeDuplicates());
        this.sortLines.addEventListener('change', () => this.removeDuplicates());
    }

    removeDuplicates() {
        const text = this.inputText.value;
        
        if (!text) {
            this.outputText.value = '';
            this.displayStats(0, 0);
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

        // Auto-copy and notify
        navigator.clipboard.writeText(result).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        });

        // Display stats
        const removedCount = originalCount - uniqueLines.length;
        this.displayStats(removedCount, uniqueLines.length);
    }

    displayStats(removedCount, uniqueCount) {
        const html = `
            <div class="stat-item">
                <div class="stat-value">${removedCount}</div>
                <div class="stat-label">Duplicates Removed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${uniqueCount}</div>
                <div class="stat-label">Unique Lines</div>
            </div>
        `;
        
        this.statsContainer.innerHTML = html;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.duplicateLineRemover = new DuplicateLineRemover();
});
