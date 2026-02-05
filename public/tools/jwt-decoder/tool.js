// JWT Decoder Tool - Standardized Implementation
class JWTDecoder {
    constructor() {
        this.maxChars = 10000;
        this.exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
        
        this.elements = {
            jwtInput: document.getElementById('jwtInput'),
            headerOutput: document.getElementById('headerOutput'),
            payloadOutput: document.getElementById('payloadOutput'),
            signatureOutput: document.getElementById('signatureOutput'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            clearBtn: document.getElementById('clearBtn'),
            errorMsg: document.querySelector('.error-msg')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Real-time listener
        if (this.elements.jwtInput) {
            this.elements.jwtInput.addEventListener('input', () => this.decode());
        }

        // Button listeners
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyAll());
        }

        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        }

        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.download());
        }

        // Character limit
        if (this.elements.jwtInput) {
            this.elements.jwtInput.addEventListener('input', this.checkCharacterLimit.bind(this));
        }
    }

    setupKeyboardShortcuts() {
        SharedUtilities.setupKeyboardShortcuts({
            'Escape': () => this.clearAll()
        });
    }

    decode() {
        try {
            const token = this.elements.jwtInput.value.trim();

            if (!token) {
                this.clearOutputs();
                this.clearError();
                return;
            }

            const parts = token.split('.');

            if (parts.length !== 3) {
                this.showError('Invalid JWT: Token must have 3 parts separated by dots');
                this.clearOutputs();
                SharedUtilities.showNotification('Invalid JWT format', 'error');
                return;
            }

            const header = this.decodeBase64(parts[0]);
            const payload = this.decodeBase64(parts[1]);
            const signature = parts[2];

            this.elements.headerOutput.textContent = JSON.stringify(JSON.parse(header), null, 2);
            this.elements.payloadOutput.textContent = JSON.stringify(JSON.parse(payload), null, 2);
            this.elements.signatureOutput.textContent = signature;

            // Check expiration
            let expirationMessage = '';
            try {
                const payloadObj = JSON.parse(payload);
                if (payloadObj.exp) {
                    const expiryDate = new Date(payloadObj.exp * 1000);
                    const now = new Date();
                    if (now > expiryDate) {
                        expirationMessage = `⚠️ Token has expired on ${expiryDate.toLocaleString()}`;
                        this.showError(expirationMessage);
                        SharedUtilities.showNotification('JWT has expired', 'warning');
                    } else {
                        expirationMessage = `✓ Token expires on ${expiryDate.toLocaleString()}`;
                        this.clearError();
                        SharedUtilities.showNotification('JWT decoded successfully!', 'success');
                    }
                } else {
                    this.clearError();
                    SharedUtilities.showNotification('JWT decoded successfully!', 'success');
                }
            } catch (e) {
                this.clearError();
                SharedUtilities.showNotification('JWT decoded successfully!', 'success');
            }
        } catch (error) {
            this.showError(`Invalid JWT: ${error.message}`);
            this.clearOutputs();
            SharedUtilities.showNotification(`Decode error: ${error.message}`, 'error');
        }
    }

    copyAll() {
        const header = this.elements.headerOutput.textContent;
        const payload = this.elements.payloadOutput.textContent;
        const signature = this.elements.signatureOutput.textContent;

        if (header === '-' || payload === '-' || signature === '-') {
            this.showError('Nothing to copy. Decode a JWT first.');
            SharedUtilities.showNotification('No JWT decoded yet', 'warning');
            return;
        }

        try {
            const allComponents = `HEADER:\n${header}\n\nPAYLOAD:\n${payload}\n\nSIGNATURE:\n${signature}`;
            SharedUtilities.copyToClipboardSilently(allComponents);
            SharedUtilities.showNotification('All JWT components copied!', 'success');
            this.clearError();
        } catch (error) {
            this.showError('Failed to copy JWT components');
            SharedUtilities.showNotification('Failed to copy', 'error');
        }
    }

    download() {
        const header = this.elements.headerOutput.textContent;
        const payload = this.elements.payloadOutput.textContent;
        const signature = this.elements.signatureOutput.textContent;

        if (header === '-' || payload === '-' || signature === '-') {
            this.showError('Nothing to download. Decode a JWT first.');
            SharedUtilities.showNotification('No JWT decoded yet', 'warning');
            return;
        }

        try {
            const content = `HEADER:\n${header}\n\nPAYLOAD:\n${payload}\n\nSIGNATURE:\n${signature}`;
            SharedUtilities.downloadAsFile(content, 'jwt-decoded.txt', 'text/plain', {
                successMessage: 'JWT components downloaded as jwt-decoded.txt'
            });
            this.clearError();
        } catch (error) {
            this.showError('Failed to download JWT components');
            SharedUtilities.showNotification('Failed to download', 'error');
        }
    }

    clearAll() {
        this.elements.jwtInput.value = '';
        this.clearOutputs();
        this.clearError();
        this.elements.jwtInput.focus();
        SharedUtilities.showNotification('Cleared all inputs', 'info');
    }

    loadExample() {
        this.elements.jwtInput.value = this.exampleToken;
        this.decode();
        SharedUtilities.showNotification('Example JWT loaded. You can modify it to test decoding.', 'info');
    }

    clearOutputs() {
        this.elements.headerOutput.textContent = '-';
        this.elements.payloadOutput.textContent = '-';
        this.elements.signatureOutput.textContent = '-';
    }

    checkCharacterLimit() {
        const count = this.elements.jwtInput.value.length;
        if (count > this.maxChars) {
            SharedUtilities.showNotification(`Character limit exceeded (${this.maxChars} max). Text will be truncated.`, 'warning');
            this.elements.jwtInput.value = this.elements.jwtInput.value.substring(0, this.maxChars);
        }
    }

    decodeBase64(str) {
        try {
            // Replace URL-safe Base64 characters
            const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            
            // Add padding if necessary
            const padding = (4 - (base64.length % 4)) % 4;
            const padded = base64 + '='.repeat(padding);
            
            // Decode Base64
            const binary = atob(padded);
            
            // Convert to UTF-8
            return decodeURIComponent(Array.prototype.map.call(binary, (c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            throw new Error('Invalid Base64 encoding: ' + e.message);
        }
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
    window.jwtDecoder = new JWTDecoder();
});
