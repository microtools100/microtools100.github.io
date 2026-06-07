class MultipleTimeAdder {
    constructor() {
        this.timeInput = document.getElementById('timeInput');
        this.totalHours = document.getElementById('totalHours');
        this.totalMinutes = document.getElementById('totalMinutes');
        this.totalSeconds = document.getElementById('totalSeconds');
        this.addBtn = document.getElementById('addBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTimes());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    timeToSeconds(timeStr) {
        const parts = timeStr.trim().split(':');
        let totalSec = 0;

        if (parts.length === 3) {
            // HH:MM:SS format
            totalSec = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) {
            // HH:MM format (first part is hours, second is minutes)
            totalSec = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60;
        } else if (parts.length === 1) {
            // Decimal hours format (1.5, 2.25, etc.)
            const num = parseFloat(parts[0]);
            totalSec = num * 3600;
        }

        return totalSec;
    }

    secondsToTime(totalSec) {
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        return { hours, mins, secs };
    }

    addTimes() {
        const input = this.timeInput.value;
        if (!input.trim()) {
            showNotification('Please enter times', 'error');
            return;
        }

        const lines = input.split('\n').filter(l => l.trim().length > 0);
        let totalSec = 0;

        for (const line of lines) {
            totalSec += this.timeToSeconds(line);
        }

        const { hours, mins, secs } = this.secondsToTime(totalSec);

        this.totalHours.textContent = hours + ':' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
        this.totalMinutes.textContent = (totalSec / 60).toFixed(2) + ' minutes';
        this.totalSeconds.textContent = totalSec + ' seconds';
    }

    copy() {
        const text = `Total: ${this.totalHours.textContent}\nMinutes: ${this.totalMinutes.textContent}\nSeconds: ${this.totalSeconds.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.timeInput.value = '';
        this.totalHours.textContent = '—';
        this.totalMinutes.textContent = '—';
        this.totalSeconds.textContent = '—';
        this.timeInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MultipleTimeAdder();
});