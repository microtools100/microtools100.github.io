class AttendanceCalculator {
    constructor() {
        this.presentDays = document.getElementById('presentDays');
        this.totalDays = document.getElementById('totalDays');
        this.percentage = document.getElementById('percentage');
        this.absentDays = document.getElementById('absentDays');
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
        const present = parseInt(this.presentDays.value) || 0;
        const total = parseInt(this.totalDays.value) || 0;

        if (present < 0 || total <= 0 || present > total) {
            showNotification('Please enter valid days', 'error');
            return;
        }

        const percent = (present / total) * 100;
        const absent = total - present;
        const statusText = percent >= 75 ? 'Good ✓' : 'Low ✗';

        this.percentage.textContent = percent.toFixed(2) + '%';
        this.absentDays.textContent = absent;
        this.status.textContent = statusText;
    }

    copy() {
        const text = `Attendance: ${this.percentage.textContent}\nAbsent: ${this.absentDays.textContent}\nStatus: ${this.status.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.presentDays.value = '';
        this.totalDays.value = '';
        this.percentage.textContent = '—';
        this.absentDays.textContent = '—';
        this.status.textContent = '—';
        this.presentDays.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AttendanceCalculator();
});