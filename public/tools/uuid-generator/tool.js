class UUIDGenerator {
    constructor() {
        this.countInput = document.getElementById('count');
        this.generateBtn = document.getElementById('generateBtn');
        this.output = document.getElementById('output');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.formatRadios = document.getElementsByName('format');

        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.formatRadios.forEach(radio => radio.addEventListener('change', () => this.generate()));

        // Generate initial UUIDs
        this.generate();
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    formatUUID(uuid) {
        const format = document.querySelector('input[name="format"]:checked').value;

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

    generate() {
        const count = Math.max(1, Math.min(100, parseInt(this.countInput.value) || 1));
        this.countInput.value = count;

        const uuids = [];
        for (let i = 0; i < count; i++) {
            const uuid = this.generateUUID();
            uuids.push(this.formatUUID(uuid));
        }

        this.output.value = uuids.join('\n');
        window.MicroTools?.utils?.showNotification?.(`Generated ${count} UUID(s)`, 'success');
    }

    copy() {
        if (!this.output.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.output.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('UUIDs copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    clear() {
        SharedUtilities.clearElements(
            { inputData: this.countInput, outputData: this.output },
            { message: 'Cleared!' }
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UUIDGenerator();
});