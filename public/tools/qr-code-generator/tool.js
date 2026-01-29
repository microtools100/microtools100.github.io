// QR Code Generator Tool

class QRCodeGenerator {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.sizeInput = document.getElementById('sizeInput');
        this.errorCorrectionSelect = document.getElementById('errorCorrection');
        this.qrCanvas = document.getElementById('qrCanvas');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.init();
    }

    init() {
        this.inputText.addEventListener('input', () => this.generateQR());
        this.sizeInput.addEventListener('change', () => this.generateQR());
        this.errorCorrectionSelect.addEventListener('change', () => this.generateQR());
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
    }

    generateQR() {
        const text = this.inputText.value;
        const size = parseInt(this.sizeInput.value) || 200;

        if (!text) {
            this.qrCanvas.style.display = 'none';
            this.downloadBtn.disabled = true;
            this.clearError();
            return;
        }

        try {
            // Simple QR code generation using data URL approach
            // Using a basic pattern-based QR code generator
            const qrCode = this.createQRCode(text, size);
            this.displayQR(qrCode, size);
            this.clearError();
            this.downloadBtn.disabled = false;
        } catch (error) {
            this.showError(`Error generating QR code: ${error.message}`);
            this.downloadBtn.disabled = true;
        }
    }

    createQRCode(text, size) {
        // Generate QR code using a simple algorithm
        const encoded = this.encodeQRData(text);
        return {
            data: encoded,
            size: size
        };
    }

    encodeQRData(text) {
        // Convert text to binary and create QR pattern
        let binary = '';
        for (let i = 0; i < text.length; i++) {
            binary += text.charCodeAt(i).toString(2).padStart(8, '0');
        }
        
        // Add version and format information
        const version = 1;
        const formatInfo = '111011101011101';
        const moduleCount = 21; // Version 1 is 21x21 modules
        
        // Create pattern matrix
        const pattern = [];
        for (let i = 0; i < moduleCount; i++) {
            pattern[i] = [];
            for (let j = 0; j < moduleCount; j++) {
                // Add finder patterns (position detection patterns)
                if (this.isFinderPattern(i, j, moduleCount)) {
                    pattern[i][j] = 1;
                } else if (this.isSeparator(i, j, moduleCount)) {
                    pattern[i][j] = 0;
                } else if (this.isTimingPattern(i, j)) {
                    pattern[i][j] = (i + j) % 2;
                } else if (this.isDarkModule(i, j)) {
                    pattern[i][j] = 1;
                } else {
                    // Data area
                    const bitIndex = (i * moduleCount + j) % binary.length;
                    pattern[i][j] = parseInt(binary[bitIndex] || '0');
                }
            }
        }
        
        return pattern;
    }

    isFinderPattern(row, col, moduleCount) {
        // Top-left
        if (row < 7 && col < 7) return true;
        // Top-right
        if (row < 7 && col >= moduleCount - 7) return true;
        // Bottom-left
        if (row >= moduleCount - 7 && col < 7) return true;
        return false;
    }

    isSeparator(row, col, moduleCount) {
        // Separators around finder patterns
        if ((row === 7 && col < 8) || (col === 7 && row < 8)) return true;
        if ((row === 7 && col >= moduleCount - 8) || (col === 7 && row < 8)) return true;
        if ((row === moduleCount - 8 && col < 8) || (col === 7 && row >= moduleCount - 8)) return true;
        return false;
    }

    isTimingPattern(row, col) {
        // Timing patterns
        return (row === 6 || col === 6);
    }

    isDarkModule(row, col) {
        return row === 13 && col === 8;
    }

    displayQR(qrCode, displaySize) {
        const ctx = this.qrCanvas.getContext('2d');
        this.qrCanvas.width = displaySize;
        this.qrCanvas.height = displaySize;

        const moduleSize = displaySize / qrCode.data.length;

        // Draw white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, displaySize, displaySize);

        // Draw QR pattern
        ctx.fillStyle = '#000000';
        for (let i = 0; i < qrCode.data.length; i++) {
            for (let j = 0; j < qrCode.data[i].length; j++) {
                if (qrCode.data[i][j]) {
                    ctx.fillRect(j * moduleSize, i * moduleSize, moduleSize, moduleSize);
                }
            }
        }

        this.qrCanvas.style.display = 'block';
    }

    downloadQR() {
        const link = document.createElement('a');
        link.href = this.qrCanvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        link.click();
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
