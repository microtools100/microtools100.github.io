class WeeklyHoursCalculator {
    constructor() {
        this.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        this.totalHours = document.getElementById('totalHours');
        this.averageHours = document.getElementById('averageHours');
        this.workingDays = document.getElementById('workingDays');
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
        let total = 0;
        let workDays = 0;

        for (const day of this.days) {
            const input = document.getElementById(day);
            const hours = parseFloat(input.value) || 0;
            if (hours > 0) {
                total += hours;
                workDays++;
            }
        }

        const average = workDays > 0 ? (total / workDays).toFixed(2) : 0;

        this.totalHours.textContent = total.toFixed(2) + ' hrs';
        this.averageHours.textContent = average + ' hrs';
        this.workingDays.textContent = workDays + ' days';
    }

    copy() {
        const text = `Total: ${this.totalHours.textContent}\nAverage: ${this.averageHours.textContent}\nDays: ${this.workingDays.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        for (const day of this.days) {
            document.getElementById(day).value = '';
        }
        this.totalHours.textContent = '—';
        this.averageHours.textContent = '—';
        this.workingDays.textContent = '—';
        document.getElementById('monday').focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeeklyHoursCalculator();
});