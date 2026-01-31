class JWTDecoder {
    constructor() {
        this.jwtInput = document.getElementById('jwtInput');
        this.headerOutput = document.getElementById('headerOutput');
        this.payloadOutput = document.getElementById('payloadOutput');
        this.signatureOutput = document.getElementById('signatureOutput');
        this.alert = document.getElementById('alert');

        this.init();
    }

    init() {
        this.jwtInput.addEventListener('input', () => this.decode());
    }

    decode() {
        const token = this.jwtInput.value.trim();
        this.alert.innerHTML = '';

        if (!token) {
            this.headerOutput.textContent = '-';
            this.payloadOutput.textContent = '-';
            this.signatureOutput.textContent = '-';
            return;
        }

        const parts = token.split('.');

        if (parts.length !== 3) {
            this.alert.innerHTML = '<p style="color: #d32f2f;">Invalid JWT: Token must have 3 parts separated by dots</p>';
            this.headerOutput.textContent = '-';
            this.payloadOutput.textContent = '-';
            this.signatureOutput.textContent = '-';
            return;
        }

        try {
            const header = this.decodeBase64(parts[0]);
            const payload = this.decodeBase64(parts[1]);
            const signature = parts[2];

            this.headerOutput.textContent = JSON.stringify(JSON.parse(header), null, 2);
            this.payloadOutput.textContent = JSON.stringify(JSON.parse(payload), null, 2);
            this.signatureOutput.textContent = signature;

            // Check expiration
            try {
                const payloadObj = JSON.parse(payload);
                if (payloadObj.exp) {
                    const expiryDate = new Date(payloadObj.exp * 1000);
                    const now = new Date();
                    if (now > expiryDate) {
                        this.alert.innerHTML = `<p style="color: #d32f2f;">⚠️ Token has expired on ${expiryDate.toLocaleString()}</p>`;
                    } else {
                        this.alert.innerHTML = `<p style="color: #388e3c;">✓ Token expires on ${expiryDate.toLocaleString()}</p>`;
                    }
                }
            } catch (e) {
                // Ignore expiration check errors
            }

            window.MicroTools?.utils?.showNotification?.('JWT decoded successfully!', 'success');
        } catch (error) {
            this.headerOutput.textContent = 'Error decoding';
            this.payloadOutput.textContent = 'Error decoding';
            this.signatureOutput.textContent = 'Error decoding';
            this.alert.innerHTML = `<p style="color: #d32f2f;">Invalid JWT: ${error.message}</p>`;
            window.MicroTools?.utils?.showNotification?.('Invalid JWT token', 'error');
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
}

function copySection(elementId) {
    const text = document.getElementById(elementId).textContent;
    if (text === '-' || text === 'Error decoding') {
        window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
    }).catch(() => {
        window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new JWTDecoder();
});