// Text Compare/Diff Tool

class TextCompareDiff {
    constructor() {
        this.text1 = document.getElementById('text1');
        this.text2 = document.getElementById('text2');
        this.ignoreCase = document.getElementById('ignoreCase');
        this.ignoreWhitespace = document.getElementById('ignoreWhitespace');
        this.output1 = document.getElementById('output1');
        this.output2 = document.getElementById('output2');
        this.diffStats = document.querySelector('.diff-stats');
        
        this.init();
    }

    init() {
        this.text1.addEventListener('input', () => this.compare());
        this.text2.addEventListener('input', () => this.compare());
        this.ignoreCase.addEventListener('change', () => this.compare());
        this.ignoreWhitespace.addEventListener('change', () => this.compare());
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
        const diff = [];
        const maxLen = Math.max(lines1.length, lines2.length);

        for (let i = 0; i < maxLen; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 === line2) {
                diff.push({ type: 'same', content: line1 });
            } else if (!line1) {
                diff.push({ type: 'add', content: line2 });
            } else if (!line2) {
                diff.push({ type: 'remove', content: line1 });
            } else {
                diff.push({ type: 'modify', content1: line1, content2: line2 });
            }
        }

        return diff;
    }

    displayDiff(diffResult, originalLines1, originalLines2) {
        let html1 = '';
        let html2 = '';

        diffResult.forEach((item, index) => {
            switch (item.type) {
                case 'same':
                    html1 += `<div class="line same-line"><span class="line-num">${index + 1}</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    html2 += `<div class="line same-line"><span class="line-num">${index + 1}</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    break;
                case 'remove':
                    html1 += `<div class="line remove-line"><span class="line-num">-</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    break;
                case 'add':
                    html2 += `<div class="line add-line"><span class="line-num">+</span><pre>${this.escapeHtml(item.content)}</pre></div>`;
                    break;
                case 'modify':
                    html1 += `<div class="line modify-line"><span class="line-num">~</span><pre>${this.escapeHtml(item.content1)}</pre></div>`;
                    html2 += `<div class="line modify-line"><span class="line-num">~</span><pre>${this.escapeHtml(item.content2)}</pre></div>`;
                    break;
            }
        });

        this.output1.innerHTML = html1 || '<div class="empty-state">No differences</div>';
        this.output2.innerHTML = html2 || '<div class="empty-state">No differences</div>';
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
