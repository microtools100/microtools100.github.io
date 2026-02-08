class WorkingDaysCalculator {
    constructor() {
        this.startDate = document.getElementById('startDate');
        this.endDate = document.getElementById('endDate');
        this.holidays = document.getElementById('holidays');
        this.holidaysGroup = document.getElementById('holidaysGroup');
        this.includeHolidays = document.getElementById('includeHolidays');
        this.workingDays = document.getElementById('workingDays');
        this.weekendDays = document.getElementById('weekendDays');
        this.totalDays = document.getElementById('totalDays');
        this.holidayCount = document.getElementById('holidayCount');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.includeHolidays.addEventListener('change', () => {
            this.holidaysGroup.style.display = this.includeHolidays.checked ? 'block' : 'none';
        });
    }

    calculate() {
        const start = this.startDate.value;
        const end = this.endDate.value;

        if (!start || !end) {
            showNotification('Please enter both dates', 'error');
            return;
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate > endDate) {
            showNotification('Start date must be before end date', 'error');
            return;
        }

        // Parse holidays only if checkbox is enabled
        let holidayDates = [];
        if (this.includeHolidays.checked) {
            holidayDates = this.holidays.value
                .split(/[,\n]+/)
                .map(d => d.trim())
                .filter(d => d.length > 0)
                .map(d => new Date(d))
                .filter(d => !isNaN(d.getTime()));
        }

        let working = 0;
        let weekend = 0;
        let holiday = 0;
        let total = 0;

        let current = new Date(startDate);
        while (current <= endDate) {
            total++;
            const dayOfWeek = current.getDay();

            // Check if it's a holiday
            if (this.isHoliday(current, holidayDates)) {
                holiday++;
            }
            // Check if it's a weekend (Saturday = 6, Sunday = 0)
            else if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekend++;
            }
            // It's a working day
            else {
                working++;
            }

            current.setDate(current.getDate() + 1);
        }

        this.workingDays.textContent = working;
        this.weekendDays.textContent = weekend;
        this.totalDays.textContent = total;
        this.holidayCount.textContent = holiday;
    }

    isHoliday(date, holidays) {
        return holidays.some(h => 
            date.getDate() === h.getDate() &&
            date.getMonth() === h.getMonth() &&
            date.getFullYear() === h.getFullYear()
        );
    }

    copy() {
        const text = `Working Days: ${this.workingDays.textContent}\nWeekend Days: ${this.weekendDays.textContent}\nTotal Days: ${this.totalDays.textContent}\nHolidays: ${this.holidayCount.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            showNotification('Failed to copy', 'error');
        });
    }

    clear() {
        this.startDate.value = '';
        this.endDate.value = '';
        this.holidays.value = '';
        this.includeHolidays.checked = false;
        this.holidaysGroup.style.display = 'none';
        this.workingDays.textContent = '—';
        this.weekendDays.textContent = '—';
        this.totalDays.textContent = '—';
        this.holidayCount.textContent = '—';
        this.startDate.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorkingDaysCalculator();
});
