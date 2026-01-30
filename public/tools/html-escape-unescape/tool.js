// HTML Escape/Unescape Tool

class HTMLEscapeUnescape {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.escapeBtn = document.getElementById('escapeBtn');
        this.unescapeBtn = document.getElementById('unescapeBtn');
        this.copyBtn = document.querySelector('.copy-btn');
        this.init();
    }

    init() {
        if (this.escapeBtn) {
            this.escapeBtn.addEventListener('click', () => this.escape());
        }
        if (this.unescapeBtn) {
            this.unescapeBtn.addEventListener('click', () => this.unescape());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copy());
        }
    }

    escape() {
        const text = this.inputText.value;
        if (!text || text.trim().length === 0) {
            this.outputText.value = '';
            return;
        }
        const escaped = this.escapeHtml(text);
        this.outputText.value = escaped;
    }

    unescape() {
        const text = this.inputText.value;
        if (!text || text.trim().length === 0) {
            this.outputText.value = '';
            return;
        }
        const unescaped = this.unescapeHtml(text);
        this.outputText.value = unescaped;
    }

    copy() {
        const text = this.outputText.value;
        if (!text) {
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return text.replace(/[&<>"'\/]/g, function(char) {
            return map[char];
        });
    }

    unescapeHtml(text) {
        const htmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x27;': "'",
            '&#x2F;': '/',
            '&#47;': '/',
            '&apos;': "'",
            '&nbsp;': '\u00A0',
            '&copy;': '©',
            '&reg;': '®',
            '&euro;': '€',
            '&pound;': '£',
            '&yen;': '¥',
            '&cent;': '¢',
            '&deg;': '°',
            '&sect;': '§',
            '&para;': '¶',
            '&middot;': '·',
            '&hellip;': '…',
            '&bull;': '•',
            '&prime;': '\u2032',
            '&Prime;': '\u2033',
            '&lsquo;': '\u2018',
            '&rsquo;': '\u2019',
            '&ldquo;': '\u201C',
            '&rdquo;': '\u201D',
            '&lsaquo;': '\u2039',
            '&rsaquo;': '\u203A',
            '&dagger;': '†',
            '&Dagger;': '‡',
            '&times;': '×',
            '&divide;': '÷',
            '&plusmn;': '±',
            '&minus;': '−',
            '&infin;': '∞',
            '&int;': '∫',
            '&sum;': '∑',
            '&prod;': '∏',
            '&radic;': '√',
            '&le;': '≤',
            '&ge;': '≥',
            '&ne;': '≠',
            '&equiv;': '≡'
        };

        let result = text;
        for (const entity in htmlEntities) {
            if (htmlEntities.hasOwnProperty(entity)) {
                const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                result = result.replace(regex, htmlEntities[entity]);
            }
        }

        result = result.replace(/&#(\d+);/g, function(match, dec) {
            try {
                return String.fromCharCode(parseInt(dec, 10));
            } catch (e) {
                return match;
            }
        });

        result = result.replace(/&#x([0-9a-fA-F]+);/gi, function(match, hex) {
            try {
                return String.fromCharCode(parseInt(hex, 16));
            } catch (e) {
                return match;
            }
        });

        return result;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.htmlEscapeUnescape = new HTMLEscapeUnescape();
});
