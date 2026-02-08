// UUID Generator Tool - Standardized Implementation
class UUIDGenerator {
    constructor() {
        this.maxUUIDs = 100;
        this.autoCopyDelay = 500;
        this.keystrokeDelay = null;
        
        this.elements = {
            countInput: document.getElementById('count'),
            output: document.getElementById('output'),
            displayCount: document.getElementById('displayCount'),
            displayFormat: document.getElementById('displayFormat'),
            generateBtn: document.getElementById('generateBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exampleBtn: document.getElementById('exampleBtn'),
            formatRadios: document.getElementsByName('format'),
            errorMsg: document.querySelector('.error-msg')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.keystrokeDelay = SharedUtilities.createKeystrokeDelay(
            () => this.generate(),
            this.autoCopyDelay
        );
        // Generate initial UUIDs
        this.generate();
    }

    setupEventListeners() {
        // Real-time listener for count changes
        if (this.elements.countInput) {
            this.elements.countInput.addEventListener('input', () => this.generate());
        }

        // Format change listeners
        this.elements.formatRadios.forEach(radio => {
            radio.addEventListener('change', () => this.generate());
        });

        // Button listeners
        if (this.elements.generateBtn) {
            this.elements.generateBtn.addEventListener('click', () => this.generate());
        }

        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }

        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.download());
        }

        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        }

        if (this.elements.exampleBtn) {
            this.elements.exampleBtn.addEventListener('click', () => this.loadExample());
        }
    }

    setupKeyboardShortcuts() {
        SharedUtilities.setupKeyboardShortcuts({
            'Ctrl+Enter': () => this.generate(),
            'Escape': () => this.clearAll()
        });
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    getSelectedFormat() {
        return document.querySelector('input[name="format"]:checked').value;
    }

    formatUUID(uuid, format) {
        switch (format) {
            case 'uppercase':
                return uuid.toUpperCase();
            case 'nohyphens':
                return uuid.replace(/-/g, '');
            case 'braces':
                return '{' + uuid + '}';
            default:
                return uuid;
        }
    }

    getFormatLabel(format) {
        const labels = {
            'standard': 'Standard (with hyphens)',
            'uppercase': 'Uppercase',
            'nohyphens': 'No hyphens',
            'braces': 'With braces {uuid}'
        };
        return labels[format] || 'Standard';
    }

    generate() {
        try {
            const count = Math.max(1, Math.min(this.maxUUIDs, parseInt(this.elements.countInput.value) || 1));
            this.elements.countInput.value = count;

            const format = this.getSelectedFormat();
            const uuids = [];

            for (let i = 0; i < count; i++) {
                const uuid = this.generateUUID();
                uuids.push(this.formatUUID(uuid, format));
            }

            this.elements.output.value = uuids.join('\n');
            
            // Update display info
            this.elements.displayCount.textContent = count;
            this.elements.displayFormat.textContent = this.getFormatLabel(format);

            this.clearError();
            SharedUtilities.showNotification(`Generated ${count} UUID(s)`, 'success');
        } catch (error) {
            this.showError(`Error generating UUIDs: ${error.message}`);
            SharedUtilities.showNotification('Failed to generate UUIDs', 'error');
        }
    }

    copyToClipboard() {
        const text = this.elements.output.value;
        if (!text) {
            this.showError('No UUIDs to copy. Generate some first.');
            SharedUtilities.showNotification('No UUIDs to copy', 'warning');
            return;
        }

        try {
            SharedUtilities.copyToClipboardSilently(text);
            SharedUtilities.showNotification('UUIDs copied to clipboard!', 'success');
            this.clearError();
        } catch (error) {
            this.showError('Failed to copy to clipboard');
            SharedUtilities.showNotification('Failed to copy', 'error');
        }
    }

    download() {
        const text = this.elements.output.value;
        if (!text) {
            this.showError('No UUIDs to download. Generate some first.');
            SharedUtilities.showNotification('No UUIDs to download', 'warning');
            return;
        }

        try {
            const format = this.getSelectedFormat();
            const filename = `uuids-${format}-${Date.now()}.txt`;
            SharedUtilities.downloadAsFile(text, filename, 'text/plain', {
                successMessage: `UUIDs downloaded as ${filename}`
            });
            this.clearError();
        } catch (error) {
            this.showError('Failed to download UUIDs');
            SharedUtilities.showNotification('Failed to download', 'error');
        }
    }

    clearAll() {
        this.elements.countInput.value = 1;
        this.elements.output.value = '';
        this.elements.displayCount.textContent = '1';
        this.elements.displayFormat.textContent = 'Standard (with hyphens)';
        this.clearError();
        this.elements.countInput.focus();
        SharedUtilities.showNotification('Cleared all UUIDs', 'info');
    }

    loadExample() {
        SharedUtilities.loadExample(this.elements.countInput, '5', () => {
            this.generate();
            SharedUtilities.showNotification('Generated 5 example UUIDs. Try different formats!', 'info');
        });
    }

    showError(message) {
        SharedUtilities.showError(this.elements.errorMsg, message);
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
    window.uuidGenerator = new UUIDGenerator();
});
