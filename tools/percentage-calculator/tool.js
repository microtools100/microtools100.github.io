class PercentageCalculator {
    constructor() {
        this.originalValue = document.getElementById('originalValue');
        this.newValue = document.getElementById('newValue');
        this.percentageResult = document.getElementById('percentageResult');
        this.differenceResult = document.getElementById('differenceResult');
        this.typeResult = document.getElementById('typeResult');
        this.copyBtn = document.getElementById('copyBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.originalValue.addEventListener('input', () => this.calculate());
        this.newValue.addEventListener('input', () => this.calculate());
        this.copyBtn.addEventListener('click', () => this.copy());
    }

    calculate() {
        const orig = parseFloat(this.originalValue.value);
        const newVal = parseFloat(this.newValue.value);

        if (isNaN(orig) || isNaN(newVal) || orig === 0) {
            this.percentageResult.textContent = '0%';
            this.differenceResult.textContent = '0';
            this.typeResult.textContent = '—';
            return;
        }

        const difference = newVal - orig;
        const percentChange = (difference / orig) * 100;

        this.percentageResult.textContent = percentChange.toFixed(2) + '%';
        this.differenceResult.textContent = difference.toFixed(2);

        if (percentChange > 0) {
            this.typeResult.textContent = 'Increase';
        } else if (percentChange < 0) {
            this.typeResult.textContent = 'Decrease';
        } else {
            this.typeResult.textContent = 'No Change';
        }
    }

    copy() {
        const text = `Percentage Change: ${this.percentageResult.textContent}\nAbsolute Difference: ${this.differenceResult.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PercentageCalculator();
});
