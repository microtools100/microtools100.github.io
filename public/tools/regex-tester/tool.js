class RegexTester {
    constructor() {
        this.regexInput = document.getElementById('regexInput');
        this.regexFlags = document.getElementById('regexFlags');
        this.testInput = document.getElementById('testInput');
        this.highlightedText = document.getElementById('highlightedText');
        this.matchCount = document.getElementById('matchCount');
        this.copyBtn = document.getElementById('copyBtn');

        this.init();
    }

    init() {
        this.regexInput.addEventListener('input', () => this.test());
        this.regexFlags.addEventListener('change', () => this.test());
        this.testInput.addEventListener('input', () => this.test());
        this.copyBtn.addEventListener('click', () => this.copyResults());
    }

    test() {
        try {
            const pattern = this.regexInput.value;
            const flags = this.regexFlags.value;
            const text = this.testInput.value;

            if (!pattern || !text) {
                this.highlightedText.innerHTML = '<p style="color: #999;">Enter a regex pattern and text to test</p>';
                this.matchCount.textContent = '0';
                return;
            }

            const regex = new RegExp(pattern, flags || undefined);
            const matches = [...text.matchAll(regex)];

            this.matchCount.textContent = matches.length;

            if (matches.length === 0) {
                this.highlightedText.innerHTML = '<p style="color: #999;">No matches found</p>';
                return;
            }

            let highlighted = text;
            const replacements = [];

            matches.forEach((match, idx) => {
                replacements.push({
                    index: match.index,
                    length: match[0].length,
                    text: match[0],
                    groups: match.slice(1)
                });
            });

            // Sort by index descending so we can replace without affecting indices
            replacements.sort((a, b) => b.index - a.index);

            replacements.forEach(rep => {
                const before = highlighted.substring(0, rep.index);
                const after = highlighted.substring(rep.index + rep.length);
                highlighted = before + `<mark>${this.escapeHtml(rep.text)}</mark>` + after;
            });

            this.highlightedText.innerHTML = `<pre>${highlighted}</pre>`;
            window.MicroTools?.utils?.showNotification?.(`Found ${matches.length} match(es)`, 'success');
        } catch (error) {
            this.highlightedText.innerHTML = `<p style="color: #d32f2f;">Error: ${this.escapeHtml(error.message)}</p>`;
            this.matchCount.textContent = '0';
        }
    }

    escapeHtml(text) {
        return text.replace(/[&<>"']/g, char => {
            const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
            return map[char];
        });
    }

    copyResults() {
        const text = this.testInput.value;
        const pattern = this.regexInput.value;
        const flags = this.regexFlags.value;

        if (!pattern || !text) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        try {
            const regex = new RegExp(pattern, flags || undefined);
            const matches = [...text.matchAll(regex)];

            const results = `Regex Pattern: /${pattern}/${flags}\n\nMatches (${matches.length}):\n` +
                matches.map((m, i) => `${i + 1}. ${m[0]}`).join('\n');

            navigator.clipboard.writeText(results).then(() => {
                window.MicroTools?.utils?.showNotification?.('Results copied!', 'success');
            });
        } catch (error) {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegexTester();
});