class TextToBinaryConverter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.binaryOutput = document.getElementById('binaryOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.reverseBtn = document.getElementById('reverseBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.separatorToggle = document.getElementById('separatorToggle');
        this.asciiToggle = document.getElementById('asciiToggle');

        this.init();
    }

    init() {
        this.convertBtn.addEventListener('click', () => this.convert());
        this.reverseBtn.addEventListener('click', () => this.reverse());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.separatorToggle.addEventListener('change', () => this.convert());
        this.asciiToggle.addEventListener('change', () => this.convert());
        this.textInput.addEventListener('input', () => this.autoConvert());
    }

    autoConvert() {
        clearTimeout(this.autoConvertTimer);
        this.autoConvertTimer = setTimeout(() => this.convert(), 300);
    }

    convert() {
        const text = this.textInput.value;
        if (!text) {
            this.binaryOutput.value = '';
            return;
        }

        const binary = this.textToBinary(text);
        this.binaryOutput.value = binary;
    }

    textToBinary(text) {
        const separator = this.separatorToggle.checked ? ' ' : '';
        const showASCII = this.asciiToggle.checked;

        return text.split('').map((char, idx) => {
            const ascii = char.charCodeAt(0);
            const bin = ascii.toString(2).padStart(8, '0');
            
            if (showASCII) {
                return `${bin}(${ascii})`;
            }
            return bin;
        }).join(separator);
    }

    binaryToText(binary) {
        // Remove spaces and ASCII codes
        let clean = binary.replace(/[^01]/g, ' ').trim();
        const bytes = clean.split(/\s+/).filter(b => b.length === 8);

        return bytes.map(byte => {
            const ascii = parseInt(byte, 2);
            return String.fromCharCode(ascii);
        }).join('');
    }

    reverse() {
        const isBinary = this.binaryOutput.value.replace(/[^01\s()]/g, '').length > 0;

        if (isBinary) {
            // Convert binary to text
            try {
                const text = this.binaryToText(this.binaryOutput.value);
                this.textInput.value = text;
                this.convert();
                window.MicroTools?.utils?.showNotification?.('Converted from binary!', 'success');
            } catch (error) {
                window.MicroTools?.utils?.showNotification?.('Invalid binary format', 'error');
            }
        } else {
            // Convert text to binary
            this.convert();
        }
    }

    copy() {
        if (!this.binaryOutput.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.binaryOutput.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('Binary copied!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    clear() {
        SharedUtilities.clearElements(
            { inputData: this.textInput, outputData: this.binaryOutput },
            { message: 'Cleared!' }
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TextToBinaryConverter();
});