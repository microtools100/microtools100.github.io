/**
 * Line Numbers Utility - Adds synchronized line numbers to textareas
 * Provides Excel/Code Editor-like line numbering with synced scrolling
 * Lightweight (~2.5KB minified) - Zero impact on performance
 */

class LineNumbersUtil {
    constructor(textareaId, options = {}) {
        this.textarea = document.getElementById(textareaId);
        if (!this.textarea) {
            console.warn(`LineNumbersUtil: textarea with id "${textareaId}" not found`);
            return;
        }

        this.options = {
            className: options.className || 'line-numbers',
            containerClass: options.containerClass || 'line-numbers-container',
            gutterClass: options.gutterClass || 'line-numbers-gutter',
            ...options
        };

        this.init();
    }

    init() {
        // Wrap textarea in container if needed
        if (!this.textarea.parentElement.classList.contains(this.options.containerClass)) {
            this.wrapTextarea();
        }

        this.gutter = this.textarea.previousElementSibling;
        if (!this.gutter || !this.gutter.classList.contains(this.options.gutterClass)) {
            this.createGutter();
        }

        // Store original property setter for value
        const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
        if (descriptor && descriptor.set) {
            const originalSetter = descriptor.set;
            const self = this;
            
            // Override the value setter to detect programmatic changes
            Object.defineProperty(this.textarea, 'value', {
                get: descriptor.get,
                set: function(val) {
                    originalSetter.call(this, val);
                    self.updateLineNumbers();
                }
            });
        }

        // Bind events
        this.textarea.addEventListener('input', () => this.updateLineNumbers());
        this.textarea.addEventListener('change', () => this.updateLineNumbers());
        this.textarea.addEventListener('scroll', () => this.syncScroll());
        this.textarea.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Initial line numbers
        this.updateLineNumbers();
    }

    wrapTextarea() {
        const container = document.createElement('div');
        container.className = this.options.containerClass;
        this.textarea.parentNode.insertBefore(container, this.textarea);
        container.appendChild(this.textarea);
    }

    createGutter() {
        const gutter = document.createElement('div');
        gutter.className = this.options.gutterClass;
        this.textarea.parentElement.insertBefore(gutter, this.textarea);
        this.gutter = gutter;
    }

    updateLineNumbers() {
        const lines = this.textarea.value.split('\n').length;
        let html = '';
        for (let i = 1; i <= lines; i++) {
            html += `<div class="line-number">${i}</div>`;
        }
        this.gutter.innerHTML = html;
    }

    syncScroll() {
        this.gutter.scrollTop = this.textarea.scrollTop;
    }

    handleKeydown(e) {
        // Tab support for textarea
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;
            const value = this.textarea.value;
            this.textarea.value = value.substring(0, start) + '\t' + value.substring(end);
            this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
            this.updateLineNumbers();
        }
    }

    /**
     * Static method to initialize line numbers on all textareas with data-line-numbers attribute
     */
    static initializeAll() {
        document.querySelectorAll('textarea[data-line-numbers]').forEach(textarea => {
            new LineNumbersUtil(textarea.id);
        });
    }

    /**
     * Manually trigger line number update (useful after programmatic changes)
     */
    refresh() {
        this.updateLineNumbers();
    }

    /**
     * Destroy line numbers (cleanup)
     */
    destroy() {
        if (this.gutter) {
            this.gutter.remove();
        }
        // Unwrap textarea if needed
        const container = this.textarea.parentElement;
        if (container.classList.contains(this.options.containerClass)) {
            container.parentNode.insertBefore(this.textarea, container);
            container.remove();
        }
    }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', LineNumbersUtil.initializeAll.bind(LineNumbersUtil));
} else {
    LineNumbersUtil.initializeAll();
}

// Export for use in build systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LineNumbersUtil;
}
