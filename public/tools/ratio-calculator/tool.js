class RatioCalculator {
    constructor() {
        this.ratioA = document.getElementById('ratioA');
        this.ratioB = document.getElementById('ratioB');
        this.simplifiedRatio = document.getElementById('simplifiedRatio');
        this.ratioFraction = document.getElementById('ratioFraction');
        this.scaledRatio = document.getElementById('scaledRatio');
        this.scaleBy = document.getElementById('scaleBy');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.ratioA.addEventListener('input', () => this.calculate());
        this.ratioB.addEventListener('input', () => this.calculate());
        this.scaleBy.addEventListener('input', () => this.calculate());
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a || 1;
    }

    calculate() {
        const a = parseFloat(this.ratioA.value);
        const b = parseFloat(this.ratioB.value);
        const scale = parseFloat(this.scaleBy.value) || 1;

        if (isNaN(a) || isNaN(b) || a === 0 || b === 0) {
            this.simplifiedRatio.textContent = '0:0';
            this.ratioFraction.textContent = '0/0';
            this.scaledRatio.textContent = '0:0';
            return;
        }

        const divisor = this.gcd(a, b);
        const simplifiedA = a / divisor;
        const simplifiedB = b / divisor;

        this.simplifiedRatio.textContent = `${simplifiedA.toFixed(2)}:${simplifiedB.toFixed(2)}`;
        this.ratioFraction.textContent = `${simplifiedA.toFixed(2)}/${simplifiedB.toFixed(2)}`;

        const scaledA = simplifiedA * scale;
        const scaledB = simplifiedB * scale;
        this.scaledRatio.textContent = `${scaledA.toFixed(2)}:${scaledB.toFixed(2)}`;
    }

    copy() {
        const text = `Simplified: ${this.simplifiedRatio.textContent}\nFraction: ${this.ratioFraction.textContent}\nScaled: ${this.scaledRatio.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.ratioA.value = '';
        this.ratioB.value = '';
        this.scaleBy.value = '1';
        this.simplifiedRatio.textContent = '0:0';
        this.ratioFraction.textContent = '0/0';
        this.scaledRatio.textContent = '0:0';
        this.ratioA.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RatioCalculator();
});
