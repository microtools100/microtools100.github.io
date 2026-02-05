// Text Compare/Diff Tool

class TextCompareDiff {
    constructor() {
        this.text1 = document.getElementById('text1');
        this.text2 = document.getElementById('text2');
        this.ignoreCase = document.getElementById('ignoreCase');
        this.ignoreWhitespace = document.getElementById('ignoreWhitespace');
        this.output1 = document.getElementById('output1');
        this.output2 = document.getElementById('output2');
        this.diffStats = document.getElementById('diff-stats');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn1 = document.getElementById('copyBtn1');
        this.copyBtn2 = document.getElementById('copyBtn2');
        
        this.init();
    }

    init() {
        this.text1.addEventListener('input', () => this.compare());
        this.text2.addEventListener('input', () => this.compare());
        this.ignoreCase.addEventListener('change', () => this.compare());
        this.ignoreWhitespace.addEventListener('change', () => this.compare());
        
        // Button listeners
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn1.addEventListener('click', () => this.copyOutput(this.output1, 'Copied original text!'));
        this.copyBtn2.addEventListener('click', () => this.copyOutput(this.output2, 'Copied modified text!'));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    handleKeyboardShortcuts(e) {
        // Escape to clear all
        if (e.key === 'Escape') {
            e.preventDefault();
            this.clearAll();
        }
    }

    compare() {
        let t1 = this.text1.value;
        let t2 = this.text2.value;

        if (this.ignoreCase.checked) {
            t1 = t1.toLowerCase();
            t2 = t2.toLowerCase();
        }

        if (this.ignoreWhitespace.checked) {
            t1 = t1.replace(/\s+/g, ' ').trim();
            t2 = t2.replace(/\s+/g, ' ').trim();
        }

        const lines1 = t1.split('\n');
        const lines2 = t2.split('\n');

        const diffResult = this.diffLines(lines1, lines2);
        this.displayDiff(diffResult, lines1, lines2);
        this.displayStats(t1, t2, diffResult);
    }

    diffLines(lines1, lines2) {
        // Create a map of lines for better matching
        const diff = [];
        const used2 = new Set();
        const maxLen = Math.max(lines1.length, lines2.length);

        // Simple line-by-line comparison algorithm
        for (let i = 0; i < maxLen; i++) {
            const line1 = lines1[i];
            const line2 = lines2[i];

            if (line1 === undefined) {
                // Remaining lines in text2 are additions
                diff.push({ type: 'add', content: line2 });
            } else if (line2 === undefined) {
                // Remaining lines in text1 are removals
                diff.push({ type: 'remove', content: line1 });
            } else if (line1 === line2) {
                // Lines are identical
                diff.push({ type: 'same', content: line1 });
            } else {
                // Lines are different
                diff.push({ type: 'modify', content1: line1, content2: line2 });
            }
        }

        return diff;
    }

    displayDiff(diffResult, originalLines1, originalLines2) {
        let html1 = '';
        let html2 = '';
        let lineNum1 = 1;
        let lineNum2 = 1;

        diffResult.forEach((item) => {
            switch (item.type) {
                case 'same':
                    html1 += `<div class="line same-line"><span class="line-num">${lineNum1}</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    html2 += `<div class="line same-line"><span class="line-num">${lineNum2}</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    lineNum1++;
                    lineNum2++;
                    break;
                case 'remove':
                    html1 += `<div class="line remove-line"><span class="line-num">-</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    lineNum1++;
                    break;
                case 'add':
                    html2 += `<div class="line add-line"><span class="line-num">+</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    lineNum2++;
                    break;
                case 'modify':
                    html1 += `<div class="line modify-line"><span class="line-num">${lineNum1}</span><pre>${this.escapeHtml(item.content1)}</pre></div>`;
                    html2 += `<div class="line modify-line"><span class="line-num">${lineNum2}</span><pre>${this.escapeHtml(item.content2)}</pre></div>`;
                    lineNum1++;
                    lineNum2++;
                    break;
            }
        });

        this.output1.innerHTML = html1 || '<div class="empty-state">No content to compare</div>';
        this.output2.innerHTML = html2 || '<div class="empty-state">No content to compare</div>';
    }

    displayStats(text1, text2, diffResult) {
        const sameLines = diffResult.filter(d => d.type === 'same').length;
        const removedLines = diffResult.filter(d => d.type === 'remove').length;
        const addedLines = diffResult.filter(d => d.type === 'add').length;
        const modifiedLines = diffResult.filter(d => d.type === 'modify').length;

        const similarity = ((sameLines / Math.max(text1.split('\n').length, text2.split('\n').length)) * 100).toFixed(1);

        const html = `
            <div class="stat-item">
                <span class="stat-label">Same Lines</span>
                <span class="stat-value">${sameLines}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Modified Lines</span>
                <span class="stat-value modify-count">${modifiedLines}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Removed Lines</span>
                <span class="stat-value remove-count">${removedLines}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Added Lines</span>
                <span class="stat-value add-count">${addedLines}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Similarity</span>
                <span class="stat-value">${similarity}%</span>
            </div>
        `;

        this.diffStats.innerHTML = html;
    }

    copyOutput(outputElement, message = 'Copied to clipboard!') {
        const text = outputElement.textContent;
        if (!text.trim()) {
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        SharedUtilities.showNotification(message, 'success');
    }

    copyToClipboard(text, message = 'Copied to clipboard!') {
        if (!text.trim()) {
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        SharedUtilities.showNotification(message, 'success');
    }

    clearAll() {
        this.text1.value = '';
        this.text2.value = '';
        this.output1.innerHTML = '';
        this.output2.innerHTML = '';
        this.diffStats.innerHTML = '';
        this.text1.focus();
        SharedUtilities.showNotification('Cleared all inputs', 'info');
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.textCompareDiff = new TextCompareDiff();
});
