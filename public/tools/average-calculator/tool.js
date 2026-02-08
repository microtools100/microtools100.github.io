class AverageCalculator {
    constructor() {
        this.numbersInput = document.getElementById('numbers');
        this.weightsInput = document.getElementById('weights');
        this.weightsGroup = document.getElementById('weightsGroup');
        this.weightsToggle = document.getElementById('useWeighted');
        this.average = document.getElementById('average');
        this.median = document.getElementById('median');
        this.weighted = document.getElementById('weighted');
        this.weightedLine = document.getElementById('weightedLine');
        this.count = document.getElementById('count');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.weightsToggle.addEventListener('change', () => {
            this.weightsGroup.style.display = this.weightsToggle.checked ? 'block' : 'none';
        });
    }

    calculate() {
        const input = this.numbersInput.value;
        if (!input.trim()) {
            showNotification('Please enter numbers', 'error');
            return;
        }

        const numbers = input
            .split(/[\s,;]+/)
            .map(n => parseFloat(n.trim()))
            .filter(n => !isNaN(n));

        if (numbers.length === 0) {
            showNotification('No valid numbers found', 'error');
            return;
        }

        const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const med = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];

        this.average.textContent = avg.toFixed(2);
        this.median.textContent = med.toFixed(2);
        this.count.textContent = numbers.length;

        if (this.weightsToggle.checked) {
            const weightsInput = this.weightsInput.value;
            const weights = weightsInput
                .split(/[\s,;]+/)
                .map(w => parseFloat(w.trim()))
                .filter(w => !isNaN(w));

            if (weights.length === numbers.length) {
                const weightedAvg = numbers.reduce((sum, n, i) => sum + n * weights[i], 0) / weights.reduce((a, b) => a + b, 0);
                this.weighted.textContent = weightedAvg.toFixed(2);
                this.weightedLine.style.display = 'block';
            } else {
                showNotification('Number of weights must match number of values', 'error');
            }
        } else {
            this.weightedLine.style.display = 'none';
        }
    }

    copy() {
        const text = `Average: ${this.average.textContent}\nMedian: ${this.median.textContent}\nCount: ${this.count.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.numbersInput.value = '';
        this.weightsInput.value = '';
        this.average.textContent = '—';
        this.median.textContent = '—';
        this.weighted.textContent = '—';
        this.count.textContent = '—';
        this.weightsGroup.style.display = 'none';
        this.weightsToggle.checked = false;
        this.numbersInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AverageCalculator();
});
