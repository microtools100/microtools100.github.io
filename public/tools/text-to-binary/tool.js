/**
 * Text to Binary Converter Tool
 * Converts text to binary representation and vice versa with ASCII codes
 */

class TextToBinaryConverter {
    constructor() {
        this.elements = {
            textInput: document.getElementById('textInput'),
            binaryOutput: document.getElementById('binaryOutput'),
            convertBtn: document.getElementById('convertBtn'),
            copyBtn: document.getElementById('copyBtn'),
            clearBtn: document.getElementById('clearBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            exampleBtn: document.getElementById('exampleBtn'),
            separatorToggle: document.getElementById('separatorToggle'),
            asciiToggle: document.getElementById('asciiToggle'),
            errorMsg: document.querySelector('.error-msg'),
            charCount: document.getElementById('charCount'),
            byteCount: document.getElementById('byteCount'),
            binaryLength: document.getElementById('binaryLength'),
            inputLabel: document.getElementById('inputLabel'),
            outputLabel: document.getElementById('outputLabel'),
            inputHint: document.getElementById('inputHint'),
            modeRadios: document.querySelectorAll('input[name="conversionMode"]')
        };

        this.currentMode = 'textToBinary';
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
        this.elements.convertBtn.addEventListener('click', () => this.main());
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        this.elements.exampleBtn.addEventListener('click', () => this.loadExample());
        
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.download());
        }
        
        this.elements.separatorToggle.addEventListener('change', () => this.main());
        this.elements.asciiToggle.addEventListener('change', () => this.main());
        this.elements.textInput.addEventListener('input', () => this.autoConvert());

        // Mode selection listeners
        this.elements.modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.changeMode(e.target.value));
        });
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
            // Escape: Clear all
            if (e.key === 'Escape') {
                e.preventDefault();
                this.clearAll();
            }
            // Ctrl/Cmd + E: Example
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.loadExample();
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
     * Show error message
     */
    showError(message) {
        this.elements.errorMsg.textContent = message;
        this.elements.errorMsg.classList.add('show');
        setTimeout(() => {
            this.elements.errorMsg.classList.remove('show');
        }, 4000);
    }

    /**
     * Change conversion mode between text-to-binary and binary-to-text
     */
    changeMode(mode) {
        this.currentMode = mode;
        this.clearAll();
        
        if (mode === 'textToBinary') {
            this.elements.inputLabel.textContent = 'Enter Text';
            this.elements.outputLabel.textContent = 'Binary Output';
            this.elements.inputHint.textContent = 'Maximum 10,000 characters.';
            this.elements.textInput.placeholder = 'Type or paste your text here...\n\nExample:\nHello World';
            this.elements.binaryOutput.placeholder = 'Binary representation will appear here...';
            this.elements.separatorToggle.parentElement.style.display = 'block';
            this.elements.asciiToggle.parentElement.style.display = 'block';
        } else {
            this.elements.inputLabel.textContent = 'Enter Binary';
            this.elements.outputLabel.textContent = 'Text Output';
            this.elements.inputHint.textContent = 'Paste binary code with spaces or newlines between bytes (8 bits each).';
            this.elements.textInput.placeholder = 'Paste binary code here...\n\nExample:\n01001000 01100101 01101100 01101100 01101111';
            this.elements.binaryOutput.placeholder = 'Text output will appear here...';
            this.elements.separatorToggle.parentElement.style.display = 'none';
            this.elements.asciiToggle.parentElement.style.display = 'none';
        }
    }

    /**
     * Main conversion method
     */
    main() {
        const input = this.elements.textInput.value;
        
        if (!input) {
            this.elements.binaryOutput.value = '';
            this.updateStats(0, 0, 0);
            return;
        }

        try {
            let output;
            if (this.currentMode === 'textToBinary') {
                output = this.textToBinary(input);
                const byteCount = input.length;
                const binaryLength = output.replace(/[^01]/g, '').length;
                this.updateStats(input.length, byteCount, binaryLength);
            } else {
                output = this.binaryToText(input);
                this.updateStats(output.length, output.length, 0);
            }
            
            this.elements.binaryOutput.value = output;
            SharedUtilities.showNotification('Converted successfully!', 'success');
        } catch (error) {
            this.showError('Conversion error: ' + error.message);
        }
    }

    /**
     * Update statistics display
     */
    updateStats(charCount, byteCount, binaryLength) {
        if (this.elements.charCount) this.elements.charCount.textContent = charCount;
        if (this.elements.byteCount) this.elements.byteCount.textContent = byteCount;
        if (this.elements.binaryLength) this.elements.binaryLength.textContent = binaryLength;
    }

    /**
     * Convert text to binary
     */
    textToBinary(text) {
        const separator = this.elements.separatorToggle.checked ? ' ' : '';
        const showASCII = this.elements.asciiToggle.checked;

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
        // Remove ASCII codes in parentheses if present
        let clean = binary.replace(/\(\d+\)/g, '').replace(/[^01]/g, ' ').trim();
        const bytes = clean.split(/\s+/).filter(b => b.length === 8 || b.length > 0);

        let result = '';
        for (const byte of bytes) {
            if (byte.length === 8) {
                const ascii = parseInt(byte, 2);
                if (ascii >= 0 && ascii <= 127) {
                    result += String.fromCharCode(ascii);
                }
            }
        }

        if (!result) {
            throw new Error('Invalid binary format. Each character must be 8 bits.');
        }

        return result;
    }

    /**
     * Load example data
     */
    loadExample() {
        if (this.currentMode === 'textToBinary') {
            const example = 'Hello World';
            this.elements.textInput.value = example;
        } else {
            const example = '01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100';
            this.elements.textInput.value = example;
        }
        this.elements.textInput.focus();
        this.main();
        SharedUtilities.showNotification('Example loaded!', 'success');
    }

    /**
     * Copy output to clipboard using SharedUtilities
     */
    copyToClipboard() {
        if (!this.elements.binaryOutput.value) {
            this.showError('Nothing to copy');
            return;
        }

        SharedUtilities.copyToClipboard(
            this.elements.binaryOutput.value,
            'Binary copied to clipboard!'
        );
    }

    /**
     * Clear all input and output
     */
    clearAll() {
        this.elements.textInput.value = '';
        this.elements.binaryOutput.value = '';
        this.updateStats(0, 0, 0);
        this.elements.textInput.focus();
        SharedUtilities.showNotification('Cleared!', 'success');
    }

    /**
     * Download output as text file
     */
    download() {
        if (!this.elements.binaryOutput.value) {
            this.showError('Nothing to download');
            return;
        }

        const content = this.elements.binaryOutput.value;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'text-to-binary.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        SharedUtilities.showNotification('Downloaded!', 'success');
    }
}

// Initialize tool when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TextToBinaryConverter();
});