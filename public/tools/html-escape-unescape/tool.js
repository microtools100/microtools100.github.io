// HTML Escape/Unescape Tool

class HTMLEscapeUnescape {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.escapeBtn = document.getElementById('escapeBtn');
        this.unescapeBtn = document.getElementById('unescapeBtn');
        
        this.init();
    }

    init() {
        this.escapeBtn.addEventListener('click', () => this.escape());
        this.unescapeBtn.addEventListener('click', () => this.unescape());
    }

    escape() {
        const text = this.inputText.value;
        
        if (!text) {
            this.outputText.value = '';
            return;
        }

        const escaped = this.escapeHtml(text);
        this.outputText.value = escaped;
        
        // Auto-copy
        navigator.clipboard.writeText(escaped).then(() => {
            window.MicroTools?.utils?.showNotification?.('Escaped and copied to clipboard!', 'success');
        });
    }

    unescape() {
        const text = this.inputText.value;
        
        if (!text) {
            this.outputText.value = '';
            return;
        }

        const unescaped = this.unescapeHtml(text);
        this.outputText.value = unescaped;
        
        // Auto-copy
        navigator.clipboard.writeText(unescaped).then(() => {
            window.MicroTools?.utils?.showNotification?.('Unescaped and copied to clipboard!', 'success');
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
        return text.replace(/[&<>"'\/]/g, char => map[char]);
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
            '&prime;': '′',
            '&Prime;': '″',
            '&lsquo;': ''',
            '&rsquo;': ''',
            '&ldquo;': '"',
            '&rdquo;': '"',
            '&lsaquo;': '‹',
            '&rsaquo;': '›',
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
        
        // Replace named entities
        Object.keys(htmlEntities).forEach(entity => {
            const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            result = result.replace(regex, htmlEntities[entity]);
        });

        // Replace numeric entities (&#123; format)
        result = result.replace(/&#(\d+);/g, (match, dec) => {
            return String.fromCharCode(parseInt(dec, 10));
        });

        // Replace hex entities (&#x1F; format)
        result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });

        return result;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.htmlEscapeUnescape = new HTMLEscapeUnescape();
});
