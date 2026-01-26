// QR Code Generator Tool

class QRCodeGenerator {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.sizeInput = document.getElementById('sizeInput');
        this.errorCorrectionSelect = document.getElementById('errorCorrection');
        this.qrCodeContainer = document.getElementById('qrCodeContainer');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.currentQRCode = null;
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.generateQR());
        this.sizeInput.addEventListener('change', () => this.generateQR());
        this.errorCorrectionSelect.addEventListener('change', () => this.generateQR());
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
        
        // Generate initial QR code if input has content
        if (this.inputText.value) {
            this.generateQR();
        }
    }

    generateQR() {
        const text = this.inputText.value.trim();
        const size = parseInt(this.sizeInput.value) || 300;
        const errorCorrection = this.errorCorrectionSelect.value;

        // Clear previous QR code
        this.qrCodeContainer.innerHTML = '';
        this.currentQRCode = null;

        if (!text) {
            this.qrCodeContainer.style.display = 'none';
            this.downloadBtn.disabled = true;
            this.clearError();
            return;
        }

        try {
            // Map error correction levels
            const correctionLevelMap = {
                'L': 'L',  // ~7% recovery
                'M': 'M',  // ~15% recovery
                'Q': 'Q',  // ~25% recovery
                'H': 'H'   // ~30% recovery
            };

            // Create QR code using qrcodejs library
            this.currentQRCode = new QRCode(this.qrCodeContainer, {
                text: text,
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#FFFFFF',
                correctLevel: QRCode.CorrectLevel[correctionLevelMap[errorCorrection]]
            });

            this.qrCodeContainer.style.display = 'flex';
            this.qrCodeContainer.style.justifyContent = 'center';
            this.qrCodeContainer.style.alignItems = 'center';
            
            this.downloadBtn.disabled = false;
            this.clearError();
        } catch (error) {
            this.showError(`Error generating QR code: ${error.message}`);
            this.downloadBtn.disabled = true;
            this.qrCodeContainer.style.display = 'none';
        }
    }

    downloadQR() {
        if (!this.currentQRCode) {
            this.showError('No QR code to download. Please generate one first.');
            return;
        }

        try {
            // Get the canvas from the QR code
            const canvas = this.qrCodeContainer.querySelector('canvas');
            
            if (!canvas) {
                this.showError('Unable to download QR code. Please try again.');
                return;
            }

            // Create download link
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qrcode.png';
            link.click();
            
            // Optional: Show success message
            console.log('QR code downloaded successfully');
        } catch (error) {
            this.showError(`Error downloading QR code: ${error.message}`);
        }
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
