/**
 * Text to Binary Converter Tool
 * Converts text to binary representation and vice versa
 */

class TextToBinaryConverter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.binaryOutput = document.getElementById('binaryOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.reverseBtn = document.getElementById('reverseBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.separatorToggle = document.getElementById('separatorToggle');
        this.asciiToggle = document.getElementById('asciiToggle');

        this.autoConvertTimer = null;
        this.init();
    }

    /**
     * Initialize event listeners and keyboard shortcuts
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        this.convertBtn.addEventListener('click', () => this.main());
        this.reverseBtn.addEventListener('click', () => this.reverse());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.download());
        }
        this.separatorToggle.addEventListener('change', () => this.main());
        this.asciiToggle.addEventListener('change', () => this.main());
        this.textInput.addEventListener('input', () => this.autoConvert());
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Convert
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.main();
            }
            // Ctrl/Cmd + Shift + C: Copy
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
                e.preventDefault();
                this.copyToClipboard();
            }
            // Ctrl/Cmd + Shift + X: Clear
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'x') {
                e.preventDefault();
                this.clearAll();
            }
        });
    }

    /**
     * Auto-convert with debounce
     */
    autoConvert() {
        clearTimeout(this.autoConvertTimer);
        this.autoConvertTimer = setTimeout(() => this.main(), 300);
    }

    /**
     * Main conversion method
     */
    main() {
        const text = this.textInput.value;
        if (!text) {
            this.binaryOutput.value = '';
            return;
        }

        try {
            const binary = this.textToBinary(text);
            this.binaryOutput.value = binary;
            window.MicroTools?.utils?.showNotification?.('Converted successfully!', 'success');
        } catch (error) {
            window.MicroTools?.utils?.showNotification?.('Conversion error', 'error');
        }
    }

    /**
     * Convert text to binary
     */
    textToBinary(text) {
        const separator = this.separatorToggle.checked ? ' ' : '';
        const showASCII = this.asciiToggle.checked;

        return text.split('').map((char) => {
            const ascii = char.charCodeAt(0);
            const bin = ascii.toString(2).padStart(8, '0');
            
            if (showASCII) {
                return `${bin}(${ascii})`;
            }
            return bin;
        }).join(separator);
    }

    /**
     * Convert binary to text
     */
    binaryToText(binary) {
        let clean = binary.replace(/[^01]/g, ' ').trim();
        const bytes = clean.split(/\s+/).filter(b => b.length === 8);

        return bytes.map(byte => {
            const ascii = parseInt(byte, 2);
            return String.fromCharCode(ascii);
        }).join('');
    }

    /**
     * Reverse conversion (text to binary or binary to text)
     */
    reverse() {
        const isBinary = this.binaryOutput.value.replace(/[^01\s()]/g, '').length > 0;

        if (isBinary) {
            try {
                const text = this.binaryToText(this.binaryOutput.value);
                this.textInput.value = text;
                this.main();
                window.MicroTools?.utils?.showNotification?.('Converted from binary!', 'success');
            } catch (error) {
                window.MicroTools?.utils?.showNotification?.('Invalid binary format', 'error');
            }
        } else {
            this.main();
        }
    }

    /**
     * Copy output to clipboard using SharedUtilities
     */
    copyToClipboard() {
        if (!this.binaryOutput.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        SharedUtilities.copyToClipboard(this.binaryOutput.value, 'Binary copied to clipboard!', 'success');
    }

    /**
     * Clear all input and output
     */
    clearAll() {
        SharedUtilities.clearElements(
            { inputData: this.textInput, outputData: this.binaryOutput },
            { message: 'Cleared!' }
        );
    }

    /**
     * Download output as text file
     */
    download() {
        if (!this.binaryOutput.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to download', 'warning');
            return;
        }

        const blob = new Blob([this.binaryOutput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'binary-output.txt';
        link.click();
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TextToBinaryConverter();
});