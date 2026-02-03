/**
 * Debt Payoff Calculator Tool
 * Calculate debt payoff timeline with snowball and avalanche strategies
 */

class DebtPayoffCalculator {
    constructor() {
        this.debtNameInput = document.getElementById('debtName');
        this.debtAmountInput = document.getElementById('debtAmount');
        this.debtRateInput = document.getElementById('debtRate');
        this.addDebtBtn = document.getElementById('addDebtBtn');
        this.debtsListContainer = document.getElementById('debtsListContainer');
        this.monthlyPaymentInput = document.getElementById('monthlyPayment');

        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');
        this.resultsSection = document.getElementById('resultsSection');

        this.debts = [];
        this.init();
    }

    init() {
        this.addDebtBtn.addEventListener('click', () => this.addDebt());
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.download());

        // Allow Enter key to add debt
        this.debtRateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addDebt();
            }
        });

        // Allow Ctrl+Enter to calculate
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.calculate();
            }
        });
    }

    addDebt() {
        try {
            const name = this.debtNameInput.value.trim();
            const amount = parseFloat(this.debtAmountInput.value);
            const rate = parseFloat(this.debtRateInput.value);

            if (!name) throw new Error('Please enter a debt name');
            if (isNaN(amount) || amount <= 0) throw new Error('Please enter a valid amount');
            if (isNaN(rate) || rate < 0) throw new Error('Please enter a valid interest rate');

            this.debts.push({ name, amount, rate });
            this.debtNameInput.value = '';
            this.debtAmountInput.value = '';
            this.debtRateInput.value = '';
            this.renderDebtsList();
            this.clearError();
            SharedUtilities.showNotification(`${name} added!`, 'success');
        } catch (error) {
            this.showError(error.message);
        }
    }

    renderDebtsList() {
        this.debtsListContainer.innerHTML = '';
        if (this.debts.length === 0) return;

        this.debts.forEach((debt, index) => {
            const item = document.createElement('div');
            item.className = 'debt-item';
            item.innerHTML = `
                <div class="debt-info">
                    <div class="debt-name">${debt.name}</div>
                    <div class="debt-details">${this.formatCurrency(debt.amount)} at ${debt.rate.toFixed(2)}% APR</div>
                </div>
                <button class="debt-remove-btn" onclick="debtCalculator.removeDebt(${index})" aria-label="Remove debt">Remove</button>
            `;
            this.debtsListContainer.appendChild(item);
        });
    }

    removeDebt(index) {
        const name = this.debts[index].name;
        this.debts.splice(index, 1);
        this.renderDebtsList();
        SharedUtilities.showNotification(`${name} removed`, 'info');
    }

    calculate() {
        try {
            if (this.debts.length === 0) {
                throw new Error('Please add at least one debt');
            }

            const monthlyPayment = parseFloat(this.monthlyPaymentInput.value);
            if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
                throw new Error('Please enter a valid monthly payment amount');
            }

            // Check if monthly payment is at least enough to cover minimum interest
            const totalMonthlyInterest = this.debts.reduce((sum, debt) => {
                return sum + (debt.amount * (debt.rate / 12 / 100));
            }, 0);

            if (monthlyPayment < totalMonthlyInterest) {
                throw new Error(`Monthly payment (${this.formatCurrency(monthlyPayment)}) is less than the minimum interest accrual (${this.formatCurrency(totalMonthlyInterest)}). You won't make progress on your debt.`);
            }

            // Clone debts for calculation
            const snowballDebts = JSON.parse(JSON.stringify(this.debts)).sort((a, b) => a.amount - b.amount);
            const avalancheDebts = JSON.parse(JSON.stringify(this.debts)).sort((a, b) => b.rate - a.rate);

            const snowballResult = this.calculatePayoffSequence(snowballDebts, monthlyPayment, 'snowball');
            const avalancheResult = this.calculatePayoffSequence(avalancheDebts, monthlyPayment, 'avalanche');

            this.displayResults(snowballResult, avalancheResult, monthlyPayment);
            this.clearError();
            SharedUtilities.showNotification('Calculation complete!', 'success');
        } catch (error) {
            this.showError(error.message);
            SharedUtilities.showNotification('Calculation error: ' + error.message, 'error');
        }
    }

    calculatePayoffSequence(debts, monthlyPayment, method) {
        let debtsRemaining = JSON.parse(JSON.stringify(debts));
        
        // Initialize balance property for each debt
        debtsRemaining.forEach(debt => {
            debt.balance = debt.amount;
        });
        
        let totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
        let totalInterest = 0;
        let months = 0;
        const schedule = [];

        while (debtsRemaining.length > 0 && months < 600) { // 50 year max
            months++;
            
            // Calculate interest for all debts
            let monthlyInterest = 0;
            debtsRemaining.forEach(debt => {
                const monthlyRate = debt.rate / 12 / 100;
                const interest = debt.balance * monthlyRate;
                monthlyInterest += interest;
                debt.balance += interest;
            });
            totalInterest += monthlyInterest;

            // Sort based on method
            if (method === 'snowball') {
                debtsRemaining.sort((a, b) => a.balance - b.balance);
            } else {
                debtsRemaining.sort((a, b) => b.rate - a.rate);
            }

            // Apply payment
            let paymentRemaining = monthlyPayment;
            let monthPayments = [];
            let debtsPaid = new Set();
            
            for (let i = 0; i < debtsRemaining.length; i++) {
                if (paymentRemaining <= 0) break;

                if (debtsRemaining[i].balance <= paymentRemaining) {
                    paymentRemaining -= debtsRemaining[i].balance;
                    monthPayments.push({
                        month: months,
                        debt: debtsRemaining[i].name,
                        payment: debtsRemaining[i].balance,
                        remaining: 0
                    });
                    debtsPaid.add(debtsRemaining[i].name);
                    debtsRemaining.splice(i, 1);
                    i--;
                } else {
                    debtsRemaining[i].balance -= paymentRemaining;
                    monthPayments.push({
                        month: months,
                        debt: debtsRemaining[i].name,
                        payment: paymentRemaining,
                        remaining: debtsRemaining[i].balance
                    });
                    debtsPaid.add(debtsRemaining[i].name);
                    paymentRemaining = 0;
                    break;
                }
            }
            
            // Add remaining debts that didn't get paid this month (interest accumulated)
            for (let i = 0; i < debtsRemaining.length; i++) {
                if (!debtsPaid.has(debtsRemaining[i].name)) {
                    monthPayments.push({
                        month: months,
                        debt: debtsRemaining[i].name,
                        payment: 0,
                        remaining: debtsRemaining[i].balance
                    });
                }
            }
            
            // Add all payments for this month to schedule (show first 12 months + every 3 months after)
            if (months <= 12 || months % 3 === 0 || debtsRemaining.length === 0) {
                schedule.push(...monthPayments);
            }
        }

        return {
            months,
            totalInterest,
            schedule,
            totalDebt
        };
    }

    displayResults(snowballResult, avalancheResult, monthlyPayment) {
        this.resultsSection.style.display = 'block';

        const totalDebt = this.debts.reduce((sum, d) => sum + d.amount, 0);
        const interestSavings = snowballResult.totalInterest - avalancheResult.totalInterest;
        const snowballTotal = totalDebt + snowballResult.totalInterest;
        const avalancheTotal = totalDebt + avalancheResult.totalInterest;

        document.getElementById('totalDebtValue').textContent = this.formatCurrency(totalDebt);
        document.getElementById('monthsToPayoffValue').textContent = avalancheResult.months + ' months (' + 
            (avalancheResult.months / 12).toFixed(1) + ' years)';
        document.getElementById('totalInterestSnowballValue').textContent = this.formatCurrency(snowballResult.totalInterest);
        document.getElementById('totalInterestAvalancheValue').textContent = this.formatCurrency(avalancheResult.totalInterest);
        document.getElementById('interestSavingsValue').textContent = this.formatCurrency(interestSavings);
        
        // Update method-specific info
        const snowballMonthsDisplay = snowballResult.months + ' months (' + (snowballResult.months / 12).toFixed(1) + ' years)';
        const avalancheMonthsDisplay = avalancheResult.months + ' months (' + (avalancheResult.months / 12).toFixed(1) + ' years)';
        
        document.getElementById('snowballMonthsValue').textContent = snowballMonthsDisplay;
        document.getElementById('avalancheMonthsValue').textContent = avalancheMonthsDisplay;
        document.getElementById('snowballInterestValue').textContent = this.formatCurrency(snowballResult.totalInterest);
        document.getElementById('avalancheInterestValue').textContent = this.formatCurrency(avalancheResult.totalInterest);
        document.getElementById('snowballTotalValue').textContent = this.formatCurrency(snowballTotal);
        document.getElementById('avalancheTotalValue').textContent = this.formatCurrency(avalancheTotal);

        this.renderScheduleTable('snowballSchedule', snowballResult.schedule);
        this.renderScheduleTable('avalancheSchedule', avalancheResult.schedule);
    }

    renderScheduleTable(elementId, schedule) {
        const container = document.getElementById(elementId);
        if (schedule.length === 0) {
            container.innerHTML = '<p>No schedule available</p>';
            return;
        }

        let html = '<table class="payment-table"><thead><tr><th>Month</th><th>Debt</th><th>Payment</th><th>Remaining</th></tr></thead><tbody>';
        
        schedule.forEach(row => {
            const isPaymentMonth = row.payment > 0;
            let rowClass = isPaymentMonth ? 'payment-row' : 'interest-row';
            
            // Highlight every 3-month increment
            if (row.month % 3 === 0 && row.month > 0) {
                rowClass += ' three-month-increment';
            }
            
            html += `<tr class="${rowClass}">
                <td>${row.month}</td>
                <td>${row.debt}</td>
                <td>${this.formatCurrency(row.payment)}</td>
                <td>${this.formatCurrency(row.remaining)}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    clearAll() {
        this.debts = [];
        this.debtsListContainer.innerHTML = '';
        this.monthlyPaymentInput.value = '';
        this.resultsSection.style.display = 'none';
        this.clearError();
        SharedUtilities.showNotification('Cleared all debts', 'info');
    }

    download() {
        try {
            const totalDebt = this.debts.reduce((sum, d) => sum + d.amount, 0);
            const monthlyPayment = parseFloat(this.monthlyPaymentInput.value) || 0;

            let data = `Debt Payoff Calculator Results
==============================

Debts:
`;
            this.debts.forEach(debt => {
                data += `- ${debt.name}: ${this.formatCurrency(debt.amount)} @ ${debt.rate}% APR\n`;
            });

            data += `
Total Debt: ${this.formatCurrency(totalDebt)}
Monthly Payment: ${this.formatCurrency(monthlyPayment)}

Total Interest (Snowball): ${document.getElementById('totalInterestSnowballValue').textContent}
Total Interest (Avalanche): ${document.getElementById('totalInterestAvalancheValue').textContent}
Interest Savings: ${document.getElementById('interestSavingsValue').textContent}

Months to Payoff: ${document.getElementById('monthsToPayoffValue').textContent}

Generated on: ${new Date().toLocaleString()}
`;

            SharedUtilities.downloadFile(data, 'debt-payoff-results.txt');
            SharedUtilities.showNotification('Results downloaded!', 'success');
        } catch (error) {
            SharedUtilities.showNotification('Download failed', 'error');
        }
    }

    showError(message) {
        this.errorMsg.textContent = message;
        this.errorMsg.classList.add('show');
    }

    clearError() {
        this.errorMsg.classList.remove('show');
        this.errorMsg.textContent = '';
    }
}

let debtCalculator;

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    debtCalculator = new DebtPayoffCalculator();
});
