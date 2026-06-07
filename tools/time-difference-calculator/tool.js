class TimeDifferenceCalculator {
    constructor() {
        this.startTime = document.getElementById('startTime');
        this.endTime = document.getElementById('endTime');
        this.hours = document.getElementById('hours');
        this.minutes = document.getElementById('minutes');
        this.totalTime = document.getElementById('totalTime');
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
        if (!this.startTime.value || !this.endTime.value) {
            showNotification('Please enter both times', 'error');
            return;
        }

        const [startHour, startMin] = this.startTime.value.split(':').map(Number);
        const [endHour, endMin] = this.endTime.value.split(':').map(Number);

        let startTotalMin = startHour * 60 + startMin;
        let endTotalMin = endHour * 60 + endMin;

        if (endTotalMin < startTotalMin) {
            endTotalMin += 24 * 60; // Next day
        }

        const diffMin = endTotalMin - startTotalMin;
        const h = Math.floor(diffMin / 60);
        const m = diffMin % 60;

        this.hours.textContent = h;
        this.minutes.textContent = m;
        this.totalTime.textContent = h + 'h ' + m + 'm';
    }

    copy() {
        const text = `Duration: ${this.totalTime.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.startTime.value = '';
        this.endTime.value = '';
        this.hours.textContent = '—';
        this.minutes.textContent = '—';
        this.totalTime.textContent = '—';
        this.startTime.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimeDifferenceCalculator();
});