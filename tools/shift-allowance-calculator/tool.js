class ShiftAllowanceCalculator {
    constructor() {
        this.shiftCount = document.getElementById('shiftCount');
        this.allowanceRate = document.getElementById('allowanceRate');
        this.totalAllowance = document.getElementById('totalAllowance');
        this.shiftsDisplay = document.getElementById('shiftsDisplay');
        this.rateDisplay = document.getElementById('rateDisplay');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    calculate() {
        const shifts = parseFloat(this.shiftCount.value) || 0;
        const rate = parseFloat(this.allowanceRate.value) || 0;

        if (shifts <= 0 || rate <= 0) {
            showNotification('Please enter valid values', 'error');
            return;
        }

        const total = shifts * rate;

        this.totalAllowance.textContent = '$' + total.toFixed(2);
        this.shiftsDisplay.textContent = shifts;
        this.rateDisplay.textContent = '$' + rate.toFixed(2);
    }

    copy() {
        const text = `Total Allowance: ${this.totalAllowance.textContent}\nShifts: ${this.shiftsDisplay.textContent}\nRate: ${this.rateDisplay.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.shiftCount.value = '';
        this.allowanceRate.value = '';
        this.totalAllowance.textContent = '$0.00';
        this.shiftsDisplay.textContent = '—';
        this.rateDisplay.textContent = '$0.00';
        this.shiftCount.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShiftAllowanceCalculator();
});