class NoticeCalculator {
    constructor() {
        this.resignationDate = document.getElementById('resignationDate');
        this.noticeDays = document.getElementById('noticeDays');
        this.excludeWeekends = document.getElementById('excludeWeekends');
        this.endDate = document.getElementById('endDate');
        this.calendarDays = document.getElementById('calendarDays');
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
        const startDate = new Date(this.resignationDate.value);
        const days = parseInt(this.noticeDays.value) || 0;

        if (!this.resignationDate.value || days <= 0) {
            showNotification('Please enter valid date and days', 'error');
            return;
        }

        if (this.excludeWeekends.checked) {
            this.calculateWithWeekends(startDate, days);
        } else {
            this.calculateSimple(startDate, days);
        }
    }

    calculateSimple(startDate, days) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days);

        this.endDate.textContent = SharedUtilities.formatDate(endDate, 'iso');
        this.calendarDays.textContent = days;
        this.workingDays.textContent = days;
    }

    calculateWithWeekends(startDate, days) {
        let current = new Date(startDate);
        let workDays = 0;

        while (workDays < days) {
            current.setDate(current.getDate() + 1);
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workDays++;
            }
        }

        const calendarDays = Math.floor((current - startDate) / (1000 * 60 * 60 * 24));
        this.endDate.textContent = SharedUtilities.formatDate(current, 'iso');
        this.calendarDays.textContent = calendarDays;
        this.workingDays.textContent = days;
    }

    copy() {
        const text = `End Date: ${this.endDate.textContent}\nCalendar Days: ${this.calendarDays.textContent}\nWorking Days: ${this.workingDays.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.resignationDate.value = '';
        this.noticeDays.value = '';
        this.excludeWeekends.checked = true;
        this.endDate.textContent = '—';
        this.calendarDays.textContent = '—';
        this.workingDays.textContent = '—';
        this.resignationDate.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NoticeCalculator();
});