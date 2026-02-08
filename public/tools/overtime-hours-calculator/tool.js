class OvertimeCalculator {
    constructor() {
        this.totalHours = document.getElementById('totalHours');
        this.standardHours = document.getElementById('standardHours');
        this.overtimeHours = document.getElementById('overtimeHours');
        this.regularHours = document.getElementById('regularHours');
        this.totalResult = document.getElementById('totalResult');
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
        const total = parseFloat(this.totalHours.value) || 0;
        const standard = parseFloat(this.standardHours.value) || 0;

        if (total <= 0 || standard <= 0) {
            showNotification('Please enter valid hours', 'error');
            return;
        }

        const overtime = Math.max(0, total - standard);
        const regular = Math.min(total, standard);

        this.overtimeHours.textContent = overtime.toFixed(2) + ' hrs';
        this.regularHours.textContent = regular.toFixed(2) + ' hrs';
        this.totalResult.textContent = total.toFixed(2) + ' hrs';
    }

    copy() {
        const text = `Overtime: ${this.overtimeHours.textContent}\nRegular: ${this.regularHours.textContent}\nTotal: ${this.totalResult.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.totalHours.value = '';
        this.standardHours.value = '';
        this.overtimeHours.textContent = '—';
        this.regularHours.textContent = '—';
        this.totalResult.textContent = '—';
        this.totalHours.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OvertimeCalculator();
});