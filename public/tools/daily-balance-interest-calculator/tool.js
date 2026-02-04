/**
 * Daily Balance Interest Calculator
 * Calculates savings account interest based on daily balance tracking
 * Supports Simple and Advanced modes with deposit management
 */

class DailyBalanceInterestCalculator {
    constructor() {
        this.currentMode = 'simple';
        this.errorMsg = document.querySelector('.error-msg');
        this.init();
    }

    init() {
        this.setupModeToggle();
        this.setupSimpleMode();
        this.setupAdvancedMode();
        this.setDefaultDates();
    }

    // ==================== Mode Management ====================
    setupModeToggle() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode, e.target);
            });
        });
    }

    switchMode(mode, button) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-content').forEach(el => el.style.display = 'none');
        document.querySelector(`#${mode}Mode`).style.display = 'block';
        
        document.querySelectorAll('.mode-btn').forEach(el => el.classList.remove('active'));
        button.classList.add('active');
    }

    // ==================== Simple Mode ====================
    setupSimpleMode() {
        document.getElementById('simpleCalculateBtn').addEventListener('click', () => this.calculateSimple());
        document.getElementById('simpleClearBtn').addEventListener('click', () => this.clearSimple());
        document.getElementById('simpleCopyBtn').addEventListener('click', () => this.copySimpleResults());
    }

    calculateSimple() {
        const openingBalance = parseFloat(document.getElementById('simpleOpeningBalance').value) || 0;
        const annualRate = parseFloat(document.getElementById('simpleAnnualRate').value) || 0;
        const monthValue = document.getElementById('simpleMonth').value;

        if (!this.validateInputs(openingBalance, annualRate, monthValue)) {
            return;
        }

        const [year, month] = monthValue.split('-').map(Number);
        const daysInMonth = this.getDaysInMonth(year, month);
        
        // Simple mode: consistent balance throughout month
        const dailyInterest = (openingBalance * annualRate) / 36500;
        const totalInterest = dailyInterest * daysInMonth;
        const endingBalance = openingBalance + totalInterest;

        // Display results
        document.getElementById('simpleInterestEarned').textContent = this.formatCurrency(totalInterest);
        document.getElementById('simpleEndingBalance').textContent = this.formatCurrency(endingBalance);
        document.getElementById('simpleDailyAverage').textContent = this.formatCurrency(openingBalance);
        document.getElementById('simpleDaysCount').textContent = daysInMonth;

        document.getElementById('simpleResults').style.display = 'block';
        this.clearError();
    }

    clearSimple() {
        document.getElementById('simpleOpeningBalance').value = '';
        document.getElementById('simpleAnnualRate').value = '';
        document.getElementById('simpleMonth').value = '';
        document.getElementById('simpleResults').style.display = 'none';
    }

    copySimpleResults() {
        const results = `Daily Balance Interest Calculator - Simple Mode Results
=====================================================
Interest Earned: ${document.getElementById('simpleInterestEarned').textContent}
Ending Balance: ${document.getElementById('simpleEndingBalance').textContent}
Daily Average: ${document.getElementById('simpleDailyAverage').textContent}
Days: ${document.getElementById('simpleDaysCount').textContent}`;

        this.copyToClipboard(results);
    }

    // ==================== Advanced Mode ====================
    setupAdvancedMode() {
        document.getElementById('addDepositBtn').addEventListener('click', () => this.addDepositRow());
        document.getElementById('advCalculateBtn').addEventListener('click', () => this.calculateAdvanced());
        document.getElementById('advClearBtn').addEventListener('click', () => this.clearAdvanced());
        document.getElementById('advCopyBtn').addEventListener('click', () => this.copyAdvancedResults());
        document.getElementById('toggleBreakdown').addEventListener('change', (e) => {
            document.getElementById('dailyBreakdownContainer').style.display = e.target.checked ? 'block' : 'none';
        });

        // Setup initial deposit row removal
        this.setupDepositRowRemoval();
    }

    addDepositRow() {
        const tbody = document.getElementById('depositsTableBody');
        const row = document.createElement('tr');
        row.className = 'deposit-row';
        row.innerHTML = `
            <td><input type="date" class="deposit-date" value=""></td>
            <td><input type="number" class="deposit-amount" placeholder="0.00" min="0" step="0.01"></td>
            <td><button class="btn-remove-deposit" type="button" title="Remove this deposit">×</button></td>
        `;
        tbody.appendChild(row);
        this.setupDepositRowRemoval();
    }

    setupDepositRowRemoval() {
        document.querySelectorAll('.btn-remove-deposit').forEach(btn => {
            btn.onclick = () => btn.closest('tr').remove();
        });
    }

    calculateAdvanced() {
        const openingBalance = parseFloat(document.getElementById('advOpeningBalance').value) || 0;
        const annualRate = parseFloat(document.getElementById('advAnnualRate').value) || 0;
        const monthValue = document.getElementById('advMonth').value;
        const bankInterest = document.getElementById('advBankInterest').value ? 
            parseFloat(document.getElementById('advBankInterest').value) : null;

        if (!this.validateInputs(openingBalance, annualRate, monthValue)) {
            return;
        }

        const [year, month] = monthValue.split('-').map(Number);
        const daysInMonth = this.getDaysInMonth(year, month);
        
        // Get deposits
        const deposits = this.getDeposits();
        
        // Calculate daily balances
        const dailyBalances = this.calculateDailyBalances(openingBalance, year, month, deposits);
        
        // Calculate interest
        const result = this.calculateInterestWithBreakdown(dailyBalances, annualRate, daysInMonth);

        // Display results
        document.getElementById('advExpectedInterest').textContent = this.formatCurrency(result.totalInterest);
        document.getElementById('advActualInterest').textContent = bankInterest !== null ? 
            this.formatCurrency(bankInterest) : 'N/A';
        
        const difference = bankInterest !== null ? bankInterest - result.totalInterest : null;
        if (difference !== null) {
            const diffElement = document.getElementById('advDifference');
            diffElement.textContent = this.formatCurrency(difference);
            diffElement.style.color = difference >= 0 ? '#10b981' : '#ef4444';
        } else {
            document.getElementById('advDifference').textContent = 'N/A';
        }

        const endingBalance = openingBalance + result.totalInterest + deposits.reduce((sum, d) => sum + d.amount, 0);
        document.getElementById('advEndingBalance').textContent = this.formatCurrency(endingBalance);

        // Always populate breakdown (regardless of checkbox or bank interest)
        document.getElementById('breakdownOutput').value = result.breakdown;
        
        // Show breakdown container if checked
        if (document.getElementById('toggleBreakdown').checked) {
            document.getElementById('dailyBreakdownContainer').style.display = 'block';
        }

        document.getElementById('advancedResults').style.display = 'block';
        this.clearError();
    }

    getDeposits() {
        const deposits = [];
        document.querySelectorAll('.deposit-row').forEach(row => {
            const date = row.querySelector('.deposit-date').value;
            const amount = parseFloat(row.querySelector('.deposit-amount').value) || 0;
            if (date && amount > 0) {
                deposits.push({ date, amount });
            }
        });
        return deposits.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    calculateDailyBalances(openingBalance, year, month, deposits) {
        const dailyBalances = {};
        const daysInMonth = this.getDaysInMonth(year, month);
        
        let currentBalance = openingBalance;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Check for deposits on this date
            deposits.forEach(deposit => {
                if (deposit.date === dateStr) {
                    currentBalance += deposit.amount;
                }
            });
            
            dailyBalances[day] = currentBalance;
        }
        
        return dailyBalances;
    }

    calculateInterestWithBreakdown(dailyBalances, annualRate, daysInMonth) {
        let totalInterest = 0;
        let breakdown = 'Day\t\tBalance\t\tDaily Interest\n';
        breakdown += '='.repeat(50) + '\n';

        for (let day = 1; day <= daysInMonth; day++) {
            const balance = dailyBalances[day];
            const dailyInterest = (balance * annualRate) / 36500;
            totalInterest += dailyInterest;
            
            breakdown += `${day}\t\t$${balance.toFixed(2)}\t\t$${dailyInterest.toFixed(6)}\n`;
        }

        breakdown += '='.repeat(50) + '\n';
        breakdown += `TOTAL INTEREST: $${totalInterest.toFixed(2)}\n`;

        return {
            totalInterest: this.roundToNearestCent(totalInterest),
            breakdown
        };
    }

    clearAdvanced() {
        document.getElementById('advOpeningBalance').value = '';
        document.getElementById('advAnnualRate').value = '';
        document.getElementById('advMonth').value = '';
        document.getElementById('advBankInterest').value = '';
        document.getElementById('advancedResults').style.display = 'none';
        document.getElementById('toggleBreakdown').checked = false;
        document.getElementById('dailyBreakdownContainer').style.display = 'none';
        
        // Reset deposits to single row
        const tbody = document.getElementById('depositsTableBody');
        tbody.innerHTML = `
            <tr class="deposit-row">
                <td><input type="date" class="deposit-date" value=""></td>
                <td><input type="number" class="deposit-amount" placeholder="0.00" min="0" step="0.01"></td>
                <td><button class="btn-remove-deposit" type="button" title="Remove this deposit">×</button></td>
            </tr>
        `;
        this.setupDepositRowRemoval();
    }

    copyAdvancedResults() {
        const results = `Daily Balance Interest Calculator - Advanced Mode Results
==========================================================
Expected Interest: ${document.getElementById('advExpectedInterest').textContent}
Bank Interest: ${document.getElementById('advActualInterest').textContent}
Difference: ${document.getElementById('advDifference').textContent}
Ending Balance: ${document.getElementById('advEndingBalance').textContent}`;

        this.copyToClipboard(results);
    }

    // ==================== Utility Functions ====================
    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    validateInputs(balance, rate, monthValue) {
        this.clearError();

        if (balance < 0) {
            this.showError('Opening balance must be greater than or equal to 0');
            return false;
        }

        if (rate < 0 || rate > 100) {
            this.showError('Interest rate must be between 0 and 100');
            return false;
        }

        if (!monthValue) {
            this.showError('Please select a month and year');
            return false;
        }

        return true;
    }

    roundToNearestCent(amount) {
        return Math.round(amount * 100) / 100;
    }

    formatCurrency(amount) {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    setDefaultDates() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const defaultMonth = `${year}-${month}`;

        document.getElementById('simpleMonth').value = defaultMonth;
        document.getElementById('advMonth').value = defaultMonth;
        document.querySelector('.deposit-date').value = today.toISOString().split('T')[0];
    }

    showError(message) {
        this.errorMsg.textContent = message;
        this.errorMsg.classList.add('show');
    }

    clearError() {
        this.errorMsg.classList.remove('show');
        this.errorMsg.textContent = '';
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            SharedUtilities.showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            SharedUtilities.showNotification('Failed to copy', 'error');
        });
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DailyBalanceInterestCalculator();
    });
} else {
    new DailyBalanceInterestCalculator();
}
