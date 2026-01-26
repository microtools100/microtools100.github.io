class ImageToBase64Converter {
    constructor() {
        this.imageInput = document.getElementById('imageInput');
        this.preview = document.getElementById('preview');
        this.noPreview = document.getElementById('noPreview');
        this.fileSize = document.getElementById('fileSize');
        this.dimensions = document.getElementById('dimensions');
        this.base64Size = document.getElementById('base64Size');
        this.base64Output = document.getElementById('base64Output');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.formatRadios = document.getElementsByName('format');

        this.currentBase64 = null;
        this.currentImageName = null;

        this.init();
    }

    init() {
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.formatRadios.forEach(radio => radio.addEventListener('change', () => this.updateOutput()));
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            window.MicroTools?.utils?.showNotification?.('File too large (max 5MB)', 'error');
            this.clear();
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentBase64 = e.target.result;
            this.currentImageName = file.name;

            // Show preview
            this.preview.src = this.currentBase64;
            this.preview.style.display = 'block';
            this.noPreview.style.display = 'none';

            // Get image dimensions
            this.preview.onload = () => {
                this.dimensions.textContent = `${this.preview.naturalWidth} × ${this.preview.naturalHeight}px`;
                this.fileSize.textContent = this.formatBytes(file.size);
                this.base64Size.textContent = this.formatBytes(this.currentBase64.length);
                this.updateOutput();
                window.MicroTools?.utils?.showNotification?.('Image loaded successfully!', 'success');
            };
        };

        reader.readAsDataURL(file);
    }

    updateOutput() {
        if (!this.currentBase64) {
            this.base64Output.value = '';
            return;
        }

        const format = document.querySelector('input[name="format"]:checked').value;
        let output;

        switch (format) {
            case 'base64only':
                output = this.currentBase64.split(',')[1];
                break;
            case 'htmlimg':
                output = `<img src="${this.currentBase64}" alt="Image">`;
                break;
            case 'cssbg':
                output = `.element {\n  background-image: url('${this.currentBase64}');\n  background-size: cover;\n}`;
                break;
            default:
                output = this.currentBase64;
        }

        this.base64Output.value = output;
    }

    copy() {
        if (!this.base64Output.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.base64Output.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    download() {
        if (!this.currentBase64) {
            window.MicroTools?.utils?.showNotification?.('No image to download', 'warning');
            return;
        }

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image to Base64</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 2rem;
            background: #f5f5f5;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        img {
            max-width: 100%;
            border-radius: 4px;
            margin: 1rem 0;
        }
        pre {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Image Preview</h1>
        <img src="${this.currentBase64}" alt="Converted Image">
        
        <h2>Base64 Data URL</h2>
        <pre>${this.escapeHtml(this.currentBase64)}</pre>
    </div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image-to-base64-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.MicroTools?.utils?.showNotification?.('Downloaded HTML file!', 'success');
    }

    clear() {
        this.imageInput.value = '';
        this.preview.src = '';
        this.preview.style.display = 'none';
        this.noPreview.style.display = 'block';
        this.fileSize.textContent = '-';
        this.dimensions.textContent = '-';
        this.base64Size.textContent = '-';
        this.base64Output.value = '';
        this.currentBase64 = null;
        this.currentImageName = null;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    escapeHtml(text) {
        return text.replace(/[&<>"']/g, char => {
            const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
            return map[char];
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageToBase64Converter();
});