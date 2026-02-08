class RoundingCalculator {
    constructor() {
        this.inputNumbers = document.getElementById('inputNumbers');
        this.outputNumbers = document.getElementById('outputNumbers');
        this.decimalPlaces = document.getElementById('decimalPlaces');
        this.roundingMethod = document.getElementById('roundingMethod');
        this.addThousands = document.getElementById('addThousands');
        this.currencyFormat = document.getElementById('currencyFormat');
        this.formatBtn = document.getElementById('formatBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.formatBtn.addEventListener('click', () => this.format());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    format() {
        const input = this.inputNumbers.value;
        if (!input.trim()) {
            showNotification('Please enter numbers', 'error');
            return;
        }

        const decimals = parseInt(this.decimalPlaces.value) || 0;
        const method = this.roundingMethod.value;
        const useThousands = this.addThousands.checked;
        const useCurrency = this.currencyFormat.checked;

        // Parse numbers from input (handle both newlines and commas)
        const numbers = input.split(/[\n,]+/)
            .map(n => n.trim())
            .filter(n => n.length > 0)
            .map(n => parseFloat(n))
            .filter(n => !isNaN(n));

        if (numbers.length === 0) {
            showNotification('No valid numbers found', 'error');
            return;
        }

        const formatted = numbers.map(num => {
            const rounded = this.roundNumber(num, decimals, method);
            return this.formatNumberWithOptions(rounded, decimals, useThousands, useCurrency);
        });

        this.outputNumbers.value = formatted.join('\n');
    }

    formatNumberWithOptions(num, decimals, useThousands, useCurrency) {
        let formatted = num.toFixed(decimals);

        if (useThousands) {
            const [intPart, decPart] = formatted.split('.');
            const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            formatted = decPart ? `${withCommas}.${decPart}` : withCommas;
        }

        if (useCurrency) {
            formatted = `$${formatted}`;
        }

        return formatted;
    }

    copy() {
        const text = this.outputNumbers.value;
        if (!text.trim()) {
            showNotification('Nothing to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            showNotification('Failed to copy', 'error');
        });
    }

    download() {
        const text = this.outputNumbers.value;
        if (!text.trim()) {
            showNotification('Nothing to download', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted-numbers.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clear() {
        this.inputNumbers.value = '';
        this.outputNumbers.value = '';
        this.decimalPlaces.value = '2';
        this.roundingMethod.value = 'round';
        this.addThousands.checked = false;
        this.currencyFormat.checked = false;
        this.inputNumbers.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RoundingCalculator();
});
