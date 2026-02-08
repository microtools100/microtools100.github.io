// Regex Tester Tool
class RegexTester {
    constructor() {
        this.maxChars = 10000;
        this.examplePattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
        this.exampleText = "contact@example.com\nuser.name@domain.org\ninvalid.email@\ntest123@test.co.uk";
        
        // Pattern definitions with flags and sample text
        this.patterns = {
            'email|g': {
                pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
                flags: 'g',
                sample: 'contact@example.com user.name@domain.org test123@test.co.uk john.doe@company.com'
            },
            'url|g': {
                pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)',
                flags: 'g',
                sample: 'Visit https://www.example.com or http://google.com Check https://github.com/user/repo'
            },
            'ipv4|g': {
                pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}',
                flags: 'g',
                sample: '192.168.1.1 10.0.0.1 172.16.0.1 8.8.8.8 127.0.0.1'
            },
            'phone|g': {
                pattern: '\\d{3}-\\d{3}-\\d{4}',
                flags: 'g',
                sample: 'Call 555-123-4567 or 202-555-0173 try 800-555-0199'
            },
            'username|g': {
                pattern: '[a-zA-Z0-9_]{3,16}',
                flags: 'g',
                sample: 'john_doe user123 valid_username ab valid_user_2024'
            },
            'hexcolor|g': {
                pattern: '#[a-fA-F0-9]{3}([a-fA-F0-9]{3})?',
                flags: 'g',
                sample: '#FF5733 #fff #0A0B0C color: #ABC'
            },
            'date-mdy|g': {
                pattern: '(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}',
                flags: 'g',
                sample: '01/15/2024 12/31/2023 02/29/2020 03/25/2024'
            },
            'date-dmy|g': {
                pattern: '(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}',
                flags: 'g',
                sample: '15/01/2024 31/12/2023 29/02/2020 25/03/2024'
            },
            'date-iso|g': {
                pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])',
                flags: 'g',
                sample: '2024-01-15 2023-12-31 2020-02-29 2024-03-25'
            },
            'time-24h|g': {
                pattern: '([01]\\d|2[0-3]):([0-5]\\d)(:[0-5]\\d)?',
                flags: 'g',
                sample: '14:30 23:59:59 00:00:00 12:45:30 09:15'
            },
            'html-tags|g': {
                pattern: '<\\w+[^>]*>.*?<\\/\\w+>|<\\w+[^>]*/>',
                flags: 'g',
                sample: '<div>Content</div> <p>Paragraph</p> <img src="test" /> <span>Text</span>'
            },
            'brackets|g': {
                pattern: '\\{[^}]*\\}',
                flags: 'g',
                sample: '{name: "John"} {key: value} {nested: {inner: true}} Some {text}'
            },
            'words|g': {
                pattern: '\\w+',
                flags: 'g',
                sample: 'Hello world this is a test Multiple words on this line'
            },
            'numbers|g': {
                pattern: '-?\\d+\\.?\\d*',
                flags: 'g',
                sample: '42 3.14 -100 0.5 2024 999 2.5'
            },
            'whitespace|g': {
                pattern: '\\s+',
                flags: 'g',
                sample: 'Multiple   spaces  Line  with  tabs'
            },
            '4letter-words|g': {
                pattern: '\\w{4}',
                flags: 'g',
                sample: 'This test code works well Java make your slow data'
            },
            'uppercase-start|g': {
                pattern: '[A-Z]\\w*',
                flags: 'g',
                sample: 'Hello world Good morning EXCELLENT work great'
            },
            'lowercase|g': {
                pattern: '[a-z]+',
                flags: 'g',
                sample: 'Hello World Test ABCDEFG lowercase mixed Case Letters'
            },
            'digits|g': {
                pattern: '\\d+',
                flags: 'g',
                sample: 'Version 2.5.0 Year 2024 Code 42 and 100'
            }
        };
        
        // Initialize elements - ensure all required elements exist
        this.elements = {
            commonPatterns: document.getElementById('commonPatterns'),
            regexInput: document.getElementById('regexInput'),
            regexFlags: document.getElementById('regexFlags'),
            testInput: document.getElementById('testInput'),
            highlightedText: document.getElementById('highlightedText'),
            matchCount: document.getElementById('matchCount'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            clearBtn: document.getElementById('clearBtn'),
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
        this.updatePlaceholder();
    }

    setupEventListeners() {
        // Common patterns selector
        this.elements.commonPatterns.addEventListener('change', () => this.loadPattern());

        // Real-time listeners
        this.elements.regexInput.addEventListener('input', () => this.test());
        this.elements.regexFlags.addEventListener('change', () => this.test());
        this.elements.testInput.addEventListener('input', () => this.test());

        // Button listeners
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyResults());
        }

        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        }

        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.download());
        }

        // Character limit
        this.elements.testInput.addEventListener('input', this.checkCharacterLimit.bind(this));
    }

    setupKeyboardShortcuts() {
        SharedUtilities.setupKeyboardShortcuts({
            'Escape': () => this.clearAll()
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
                highlighted = before + `<mark>${SharedUtilities.escapeHTML(rep.text)}</mark>` + after;
            });

            this.elements.highlightedText.innerHTML = `<pre>${highlighted}</pre>`;
            this.clearError();

            SharedUtilities.showNotification(`Found ${matches.length} match(es)!`, 'success');
        } catch (error) {
            this.showError(`Error: ${error.message}`);
            if (this.elements.highlightedText) {
                this.elements.highlightedText.innerHTML = `<p style="color: var(--error-color);">Error: ${SharedUtilities.escapeHTML(error.message)}</p>`;
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
        
        // Trigger input event for both fields
        this.elements.regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        this.elements.testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        this.test();
        SharedUtilities.showNotification('Example loaded. Try different patterns and flags to see the effect.', 'info');
    }

    loadPattern() {
        const selectedValue = this.elements.commonPatterns.value;
        if (!selectedValue || !this.patterns[selectedValue]) return;

        const patternDef = this.patterns[selectedValue];
        const pattern = patternDef.pattern;
        const flags = patternDef.flags;
        const sample = patternDef.sample;

        // Populate the regex input and flags
        this.elements.regexInput.value = pattern;
        this.elements.regexFlags.value = flags;

        // Populate sample text
        this.elements.testInput.value = sample;

        // Keep the selection visible (don't reset dropdown)
        // Trigger test with the new pattern
        this.elements.regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        this.test();

        SharedUtilities.showNotification(`Pattern loaded: ${pattern.substring(0, 50)}${pattern.length > 50 ? '...' : ''}`, 'info');
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

    showError(message) {
        SharedUtilities.showError(this.elements.errorMsg, message);
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
