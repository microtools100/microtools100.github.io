// QR Code Generator Tool

class QRCodeGenerator {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.sizeInput = document.getElementById('sizeInput');
        this.errorCorrectionSelect = document.getElementById('errorCorrection');
        this.qrContainer = document.getElementById('qrContainer');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.currentQR = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        this.inputText.addEventListener('input', () => this.generateQR());
        this.sizeInput.addEventListener('change', () => this.generateQR());
        this.errorCorrectionSelect.addEventListener('change', () => this.generateQR());
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+D to download
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                if (!this.downloadBtn.disabled) {
                    this.downloadQR();
                }
            }
            // Ctrl+L to focus input
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.inputText.focus();
            }
        });
    }

    generateQR() {
        const text = this.inputText.value.trim();
        const size = parseInt(this.sizeInput.value) || 200;
        const errorCorrection = this.errorCorrectionSelect.value;

        if (!text) {
            this.qrContainer.style.display = 'none';
            this.downloadBtn.disabled = true;
            this.clearError();
            return;
        }

        try {
            // Clear previous QR code
            this.qrContainer.innerHTML = '';
            
            // Validate text length (QR code has size limitations)
            if (text.length > 2953) {
                this.showError('Text is too long. Maximum 2953 characters allowed.');
                this.downloadBtn.disabled = true;
                return;
            }

            // Map error correction levels
            const errorCorrectionMap = {
                'L': QRCode.CorrectLevel.L,
                'M': QRCode.CorrectLevel.M,
                'Q': QRCode.CorrectLevel.Q,
                'H': QRCode.CorrectLevel.H
            };

            // Create new QR code
            this.currentQR = new QRCode(this.qrContainer, {
                text: text,
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#FFFFFF',
                correctLevel: errorCorrectionMap[errorCorrection]
            });

            // Display container
            this.qrContainer.style.display = 'block';
            this.downloadBtn.disabled = false;
            this.clearError();

        } catch (error) {
            this.showError(`Error generating QR code: ${error.message}`);
            this.qrContainer.style.display = 'none';
            this.downloadBtn.disabled = true;
        }
    }

    downloadQR() {
        try {
            // Get the canvas from the QR code container
            const canvas = this.qrContainer.querySelector('canvas');
            
            if (!canvas) {
                this.showError('QR code not generated. Please enter text first.');
                return;
            }

            // Convert canvas to image and download
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            SharedUtilities.showNotification('QR code downloaded successfully!', 'success');
        } catch (error) {
            this.showError(`Download failed: ${error.message}`);
        }
    }

    copyToClipboard() {
        const text = this.inputText.value.trim();
        if (!text) {
            SharedUtilities.showNotification('No QR code text to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            SharedUtilities.showNotification('Text copied to clipboard', 'success');
        }).catch(() => {
            SharedUtilities.showNotification('Failed to copy text', 'error');
        });
    }

    clearAll() {
        this.inputText.value = '';
        this.qrContainer.innerHTML = '';
        this.qrContainer.style.display = 'none';
        this.downloadBtn.disabled = true;
        this.clearError();
        SharedUtilities.showNotification('QR code cleared', 'info');
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.style.display = 'block';
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.style.display = 'none';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.qrCodeGenerator = new QRCodeGenerator();
});
