class ProbationCalculator {
    constructor() {
        this.startDate = document.getElementById('startDate');
        this.probationMonths = document.getElementById('probationMonths');
        this.confirmationDate = document.getElementById('confirmationDate');
        this.dayCount = document.getElementById('dayCount');
        this.status = document.getElementById('status');
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
        if (!this.startDate.value) {
            showNotification('Please enter a start date', 'error');
            return;
        }

        const start = new Date(this.startDate.value);
        const months = parseInt(this.probationMonths.value) || 0;

        if (months <= 0) {
            showNotification('Please enter valid months', 'error');
            return;
        }

        const confirmation = new Date(start);
        confirmation.setMonth(confirmation.getMonth() + months);

        const days = Math.floor((confirmation - start) / (1000 * 60 * 60 * 24));
        const statusText = new Date() < confirmation ? 'In Progress' : 'Completed';

        this.confirmationDate.textContent = SharedUtilities.formatDate(confirmation, 'iso');
        this.dayCount.textContent = days + ' days';
        this.status.textContent = statusText;
    }

    copy() {
        const text = `Confirmation: ${this.confirmationDate.textContent}\nDays: ${this.dayCount.textContent}\nStatus: ${this.status.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.startDate.value = '';
        this.probationMonths.value = '';
        this.confirmationDate.textContent = '—';
        this.dayCount.textContent = '—';
        this.status.textContent = '—';
        this.startDate.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProbationCalculator();
});