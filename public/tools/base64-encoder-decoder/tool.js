// Base64 Encoder/Decoder Tool - Production Ready

class Base64Tool {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.encodeBtn = document.getElementById('encodeBtn');
        this.decodeBtn = document.getElementById('decodeBtn');
        this.copyBtn = document.querySelector('.copy-btn');
        this.errorMsg = document.querySelector('.error-msg');
        this.init();
    }

    init() {
        this.encodeBtn.addEventListener('click', () => this.encode());
        this.decodeBtn.addEventListener('click', () => this.decode());
        this.inputText.addEventListener('input', () => this.clearError());
        this.inputText.addEventListener('input', () => this.autoConvert());
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.style.display = 'none';
        }
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.style.display = 'block';
        }
    }

    encode() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.outputText.value = '';
            this.clearError();
            return;
        }

        try {
            const encoded = btoa(unescape(encodeURIComponent(text)));
            this.outputText.value = encoded;
            this.clearError();
            this.copyToClipboard();
        } catch (error) {
            this.showError('Error encoding: Invalid characters detected');
        }
    }

    decode() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.outputText.value = '';
            this.clearError();
            return;
        }

        try {
            if (!this.isValidBase64(text)) {
                this.showError('Invalid Base64 format. Ensure input contains only Base64 characters (A-Z, a-z, 0-9, +, /, =)');
                return;
            }
            const decoded = decodeURIComponent(escape(atob(text)));
            this.outputText.value = decoded;
            this.clearError();
            this.copyToClipboard();
        } catch (error) {
            this.showError('Error decoding: Invalid Base64 string');
        }
    }

    isValidBase64(str) {
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(str)) return false;
        try {
            atob(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    autoConvert() {
        // Optional: auto-detect if input looks like Base64 and auto-decode
        const text = this.inputText.value.trim();
        if (text.length > 10 && /^[A-Za-z0-9+/]+={0,2}$/.test(text)) {
            // Input looks like base64 - could auto-decode, but keep manual for user control
        }
    }

    copyToClipboard() {
        const text = this.outputText.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.base64Tool = new Base64Tool();
});
