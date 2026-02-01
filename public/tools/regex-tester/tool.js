// Regex Tester Tool
class RegexTester {
    constructor() {
        this.maxChars = 10000;
        this.autoCopyDelay = 500;
        this.keystrokeDelay = null;
        this.examplePattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
        this.exampleText = "contact@example.com\nuser.name@domain.org\ninvalid.email@\ntest123@test.co.uk";
        
        // Initialize elements - ensure all required elements exist
        this.elements = {
            regexInput: document.getElementById('regexInput'),
            regexFlags: document.getElementById('regexFlags'),
            testInput: document.getElementById('testInput'),
            highlightedText: document.getElementById('highlightedText'),
            matchCount: document.getElementById('matchCount'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            testBtn: document.getElementById('testBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exampleBtn: document.getElementById('exampleBtn'),
            errorMsg: document.querySelector('.error-msg')
        };

        // Validate that all critical elements exist
        if (!this.elements.highlightedText) {
            console.error('Critical element highlightedText not found');
        }

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(
            () => this.executeCopy(),
            this.autoCopyDelay
        );
        this.updatePlaceholder();
    }

    setupEventListeners() {
        // Real-time listeners
        this.elements.regexInput.addEventListener('input', () => this.test());
        this.elements.regexFlags.addEventListener('change', () => this.test());
        this.elements.testInput.addEventListener('input', () => this.test());

        // Button listeners
        if (this.elements.testBtn) {
            this.elements.testBtn.addEventListener('click', () => this.test());
        }

        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyResults());
        }

        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        }

        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.download());
        }

        if (this.elements.exampleBtn) {
            this.elements.exampleBtn.addEventListener('click', () => this.loadExample());
        }

        // Character limit
        this.elements.testInput.addEventListener('input', this.checkCharacterLimit.bind(this));
    }

    setupKeyboardShortcuts() {
        SharedUtilities.setupKeyboardShortcuts({
            'Ctrl+Enter': () => this.test(),
            'Escape': () => this.clearAll(),
            'Ctrl+E': () => this.loadExample()
        });
    }

    test() {
        try {
            if (!this.elements.highlightedText) {
                console.error('highlightedText element not found');
                return;
            }

            const pattern = this.elements.regexInput.value.trim();
            const flags = this.elements.regexFlags.value;
            const text = this.elements.testInput.value;

            if (!pattern || !text) {
                this.elements.highlightedText.innerHTML = '<p style="color: var(--text-color-secondary);">Enter a regex pattern and text to test</p>';
                this.elements.matchCount.textContent = '0';
                this.clearError();
                return;
            }

            const regex = new RegExp(pattern, flags || undefined);
            const matches = [...text.matchAll(regex)];

            this.elements.matchCount.textContent = matches.length;

            if (matches.length === 0) {
                this.elements.highlightedText.innerHTML = '<p style="color: var(--text-color-secondary);">No matches found</p>';
                this.clearError();
                return;
            }

            let highlighted = text;
            const replacements = [];

            matches.forEach((match) => {
                replacements.push({
                    index: match.index,
                    length: match[0].length,
                    text: match[0],
                    groups: match.slice(1)
                });
            });

            // Sort by index descending to replace without affecting indices
            replacements.sort((a, b) => b.index - a.index);

            replacements.forEach(rep => {
                const before = highlighted.substring(0, rep.index);
                const after = highlighted.substring(rep.index + rep.length);
                highlighted = before + `<mark>${this.escapeHtml(rep.text)}</mark>` + after;
            });

            this.elements.highlightedText.innerHTML = `<pre>${highlighted}</pre>`;
            this.clearError();

            SharedUtilities.showNotification(`Found ${matches.length} match(es)!`, 'success');
        } catch (error) {
            this.showError(`Error: ${error.message}`);
            if (this.elements.highlightedText) {
                this.elements.highlightedText.innerHTML = `<p style="color: var(--error-color);">Error: ${this.escapeHtml(error.message)}</p>`;
            }
            this.elements.matchCount.textContent = '0';
            SharedUtilities.showNotification(`Regex Error: ${error.message}`, 'error');
        }
    }

    copyResults() {
        const text = this.elements.testInput.value;
        const pattern = this.elements.regexInput.value.trim();
        const flags = this.elements.regexFlags.value;

        if (!pattern || !text) {
            this.showError('Nothing to copy. Enter a pattern and test text first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        try {
            const regex = new RegExp(pattern, flags || undefined);
            const matches = [...text.matchAll(regex)];

            const results = `Regex Pattern: /${pattern}/${flags}\n\nMatches (${matches.length}):\n` +
                matches.map((m, i) => `${i + 1}. ${m[0]}`).join('\n');

            SharedUtilities.copyToClipboardSilently(results);
            SharedUtilities.showNotification('Results copied to clipboard!', 'success');
            this.clearError();
        } catch (error) {
            this.showError('Failed to copy results.');
            SharedUtilities.showNotification('Failed to copy', 'error');
        }
    }

    download() {
        const text = this.elements.testInput.value;
        const pattern = this.elements.regexInput.value.trim();
        const flags = this.elements.regexFlags.value;

        if (!pattern || !text) {
            this.showError('Nothing to download. Enter a pattern and test text first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        try {
            const regex = new RegExp(pattern, flags || undefined);
            const matches = [...text.matchAll(regex)];

            const results = `Regex Pattern: /${pattern}/${flags}\n\nMatches (${matches.length}):\n` +
                matches.map((m, i) => `${i + 1}. ${m[0]}`).join('\n');

            SharedUtilities.downloadAsFile(results, 'regex-results.txt', 'text/plain', {
                successMessage: 'Results downloaded as regex-results.txt'
            });
            this.clearError();
        } catch (error) {
            this.showError('Failed to download results.');
            SharedUtilities.showNotification('Failed to download', 'error');
        }
    }

    clearAll() {
        this.elements.regexInput.value = '';
        this.elements.testInput.value = '';
        if (this.elements.highlightedText) {
            this.elements.highlightedText.innerHTML = '<p style="color: var(--text-color-secondary);">Enter a regex pattern and text to test</p>';
        }
        this.elements.matchCount.textContent = '0';
        this.elements.regexInput.focus();
        this.clearError();
        SharedUtilities.showNotification('Cleared all inputs', 'info');
    }

    loadExample() {
        this.elements.regexInput.value = this.examplePattern;
        this.elements.testInput.value = this.exampleText;
        this.elements.regexFlags.value = 'g';
        this.test();
        SharedUtilities.showNotification('Example loaded. Try different patterns and flags to see the effect.', 'info');
    }

    checkCharacterLimit() {
        const count = this.elements.testInput.value.length;
        if (count > this.maxChars) {
            SharedUtilities.showNotification(`Character limit exceeded (${this.maxChars} max). Text will be truncated.`, 'warning');
            this.elements.testInput.value = this.elements.testInput.value.substring(0, this.maxChars);
        }
    }

    updatePlaceholder() {
        if (this.elements.highlightedText) {
            this.elements.highlightedText.innerHTML = '<p style="color: var(--text-color-secondary);">Enter a regex pattern and text to test</p>';
        }
    }

    executeCopy() {
        const pattern = this.elements.regexInput.value.trim();
        if (pattern) {
            SharedUtilities.copyToClipboardSilently(pattern);
            SharedUtilities.showNotification('Pattern copied to clipboard', 'success');
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, char => map[char]);
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.regexTester = new RegexTester();
});
