class ShiftCalculator {
    constructor() {
        this.startTime = document.getElementById('startTime');
        this.endTime = document.getElementById('endTime');
        this.breakMinutes = document.getElementById('breakMinutes');
        this.totalDuration = document.getElementById('totalDuration');
        this.breakDisplay = document.getElementById('breakDisplay');
        this.workHours = document.getElementById('workHours');
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
            endTotalMin += 24 * 60;
        }

        const totalMin = endTotalMin - startTotalMin;
        const breakMin = parseInt(this.breakMinutes.value) || 0;
        const workMin = totalMin - breakMin;

        const totalHours = (totalMin / 60).toFixed(2);
        const workHours = (workMin / 60).toFixed(2);

        this.totalDuration.textContent = totalHours + ' hrs';
        this.breakDisplay.textContent = breakMin + ' min';
        this.workHours.textContent = workHours + ' hrs';
    }

    copy() {
        const text = `Work Hours: ${this.workHours.textContent}\nBreak: ${this.breakDisplay.textContent}\nTotal: ${this.totalDuration.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.startTime.value = '';
        this.endTime.value = '';
        this.breakMinutes.value = '';
        this.totalDuration.textContent = '—';
        this.breakDisplay.textContent = '—';
        this.workHours.textContent = '—';
        this.startTime.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShiftCalculator();
});