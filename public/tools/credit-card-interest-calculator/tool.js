/**
 * Credit Card Interest Calculator Tool
 * Calculate credit card payoff timeline and total interest
 */

class CreditCardInterestCalculator {
    constructor() {
        this.currentBalance = document.getElementById('currentBalance');
        this.apr = document.getElementById('apr');
        this.monthlyPayment = document.getElementById('monthlyPayment');

        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');

        this.monthsResult = document.getElementById('monthsResult');
        this.yearsResult = document.getElementById('yearsResult');
        this.totalInterestResult = document.getElementById('totalInterestResult');
        this.totalPaidResult = document.getElementById('totalPaidResult');

        this.scheduleContainer = document.getElementById('scheduleContainer');
        this.paymentSchedule = document.getElementById('paymentSchedule');
        this.chartContainer = document.getElementById('chartContainer');
        this.balanceChart = document.getElementById('balanceChart');

        this.init();
    }

    init() {
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.download());

        // Real-time calculation
        this.currentBalance.addEventListener('input', () => this.calculate(false));
        this.apr.addEventListener('input', () => this.calculate(false));
        this.monthlyPayment.addEventListener('input', () => this.calculate(false));

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.calculate(true);
            }
        });
    }

    calculate(showErrors = false) {
        try {
            const balance = parseFloat(this.currentBalance.value) || 0;
            const apr = parseFloat(this.apr.value) || 0;
            const payment = parseFloat(this.monthlyPayment.value) || 0;

            // Silent mode: only calculate if all fields have values
            if (!showErrors) {
                if (balance <= 0 || apr < 0 || payment <= 0) {
                    this.clearError();
                    return;
                }
            } else {
                if (balance <= 0) {
                    throw new Error('Balance must be greater than 0');
                }

                if (payment <= 0) {
                    throw new Error('Monthly payment must be greater than 0');
                }
            }

            const monthlyRate = apr / 12 / 100;

            // Calculate minimum payment required to actually pay off (not just interest)
            const minPayment = balance * monthlyRate;
            if (payment <= minPayment && apr > 0) {
                if (showErrors) {
                    throw new Error(`Monthly payment must be more than minimum interest payment of ${this.formatCurrency(minPayment)}`);
                } else {
                    return;
                }
            }

            const result = this.simulatePayoff(balance, apr, payment);
            this.displayResults(result);
            this.renderSchedule(result.schedule);
            this.renderChart(result.schedule);
            this.clearError();
            if (showErrors) {
                SharedUtilities.showNotification('Calculation complete!', 'success');
            }

        } catch (error) {
            if (showErrors) {
                this.showError(error.message);
                SharedUtilities.showNotification('Calculation error: ' + error.message, 'error');
            }
        }
    }

    simulatePayoff(initialBalance, apr, monthlyPayment) {
        let balance = initialBalance;
        let totalInterest = 0;
        let months = 0;
        const allMonths = [];
        const monthlyRate = apr / 12 / 100;

        // Simulate all months to calculate totals
        while (balance > 0 && months < 600) { // 50 year max
            months++;

            // Calculate interest for this month on current balance
            const interest = balance * monthlyRate;
            totalInterest += interest;

            // Determine payment for this month
            let payment = monthlyPayment;
            let principal = monthlyPayment - interest;
            
            // Check if this is the final payment
            if (balance + interest <= monthlyPayment) {
                payment = balance + interest;
                principal = balance;
                balance = 0;
            } else {
                // Regular payment
                balance = balance + interest - monthlyPayment;
            }

            // Store all month data for schedule building
            allMonths.push({
                month: months,
                payment: payment,
                principal: principal,
                interest: interest,
                remaining: Math.max(0, balance)
            });
        }

        // Build display schedule: first 12 months + yearly summaries
        const schedule = [];
        
        // Add first 12 months in detail
        for (let i = 0; i < Math.min(12, allMonths.length); i++) {
            schedule.push(allMonths[i]);
        }

        // Add annual summaries for year 2+
        if (allMonths.length > 12) {
            schedule.push({
                month: 'sep',
                payment: 0,
                principal: 0,
                interest: 0,
                remaining: 0,
                isSeparator: true
            });

            for (let year = 2; year * 12 <= allMonths.length; year++) {
                const yearStartIdx = (year - 1) * 12;
                const yearEndIdx = Math.min(year * 12, allMonths.length) - 1;
                
                if (yearStartIdx < allMonths.length) {
                    const yearPayments = allMonths.slice(yearStartIdx, yearEndIdx + 1);
                    
                    let yearPayment = 0;
                    let yearPrincipal = 0;
                    let yearInterest = 0;
                    
                    for (const m of yearPayments) {
                        yearPayment += m.payment;
                        yearPrincipal += m.principal;
                        yearInterest += m.interest;
                    }
                    
                    schedule.push({
                        month: `Year ${year} (Months ${yearStartIdx + 1}-${yearEndIdx + 1})`,
                        payment: yearPayment,
                        principal: yearPrincipal,
                        interest: yearInterest,
                        remaining: allMonths[yearEndIdx].remaining,
                        isYearlySum: true
                    });
                }
            }

            // Handle final partial year if not aligned
            const finalMonth = allMonths.length;
            const finalYear = Math.ceil(finalMonth / 12);
            const lastYearStartMonth = (finalYear - 1) * 12 + 1;
            
            if (lastYearStartMonth < finalMonth) {
                const yearStartIdx = (finalYear - 1) * 12;
                const yearPayments = allMonths.slice(yearStartIdx);
                
                let yearPayment = 0;
                let yearPrincipal = 0;
                let yearInterest = 0;
                
                for (const m of yearPayments) {
                    yearPayment += m.payment;
                    yearPrincipal += m.principal;
                    yearInterest += m.interest;
                }
                
                schedule.push({
                    month: `Year ${finalYear} (Months ${lastYearStartMonth}-${finalMonth})`,
                    payment: yearPayment,
                    principal: yearPrincipal,
                    interest: yearInterest,
                    remaining: 0,
                    isYearlySum: true
                });
            }
        }

        const totalPaid = initialBalance + totalInterest;

        return {
            months,
            totalInterest,
            totalPaid,
            initialBalance,
            schedule
        };
    }

    displayResults(result) {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        
        const years = (result.months / 12).toFixed(1);
        this.monthsResult.textContent = result.months.toLocaleString();
        this.yearsResult.textContent = years;
        this.totalInterestResult.textContent = this.formatCurrency(result.totalInterest);
        this.totalPaidResult.textContent = this.formatCurrency(result.totalPaid);
    }

    renderSchedule(schedule) {
        this.scheduleContainer.style.display = 'block';
        let html = '<table class="schedule-table-inner">';
        html += `
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Remaining Balance</th>
                </tr>
            </thead>
            <tbody>`;

        schedule.forEach((row, idx) => {
            if (row.isSeparator) {
                html += `<tr class="schedule-separator">
                    <td colspan="5" style="text-align: center; font-weight: 600; padding: 0.5rem; color: var(--text-light);">Annual Summaries</td>
                </tr>`;
            } else if (row.isYearlySum) {
                html += `<tr class="yearly-summary">
                    <td>${row.month}</td>
                    <td>${this.formatCurrency(row.payment)}</td>
                    <td>${this.formatCurrency(row.principal)}</td>
                    <td>${this.formatCurrency(row.interest)}</td>
                    <td>${this.formatCurrency(row.remaining)}</td>
                </tr>`;
            } else {
                html += `<tr>
                    <td>${row.month}</td>
                    <td>${this.formatCurrency(row.payment)}</td>
                    <td>${this.formatCurrency(row.principal)}</td>
                    <td>${this.formatCurrency(row.interest)}</td>
                    <td>${this.formatCurrency(row.remaining)}</td>
                </tr>`;
            }
        });

        html += '</tbody></table>';
        this.paymentSchedule.innerHTML = html;
    }

    renderChart(schedule) {
        this.chartContainer.style.display = 'block';
        this.balanceChart.innerHTML = '';

        if (schedule.length === 0) return;

        // Find max balance for scaling
        const maxBalance = Math.max(...schedule.map(s => s.remaining)) || 1;

        schedule.forEach(row => {
            const percentage = (row.remaining / maxBalance) * 100;

            const item = document.createElement('div');
            item.className = 'chart-item';
            item.innerHTML = `
                <div class="chart-month">Month ${row.month}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="chart-value">${this.formatCurrency(row.remaining)}</div>
            `;
            this.balanceChart.appendChild(item);
        });
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
        this.currentBalance.value = '';
        this.apr.value = '18.99';
        this.monthlyPayment.value = '';

        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';

        this.monthsResult.textContent = '-';
        this.yearsResult.textContent = '-';
        this.totalInterestResult.textContent = '$0.00';
        this.totalPaidResult.textContent = '$0.00';

        this.scheduleContainer.style.display = 'none';
        this.chartContainer.style.display = 'none';
        this.clearError();

        SharedUtilities.showNotification('Cleared all values', 'info');
    }

    download() {
        try {
            const balance = parseFloat(this.currentBalance.value) || 0;
            const apr = parseFloat(this.apr.value) || 0;
            const payment = parseFloat(this.monthlyPayment.value) || 0;

            const months = parseInt(this.monthsResult.textContent.replace(/[^0-9]/g, '')) || 0;
            const years = parseFloat(this.yearsResult.textContent) || 0;

            const data = `Credit Card Interest Calculator Results
========================================

Input Parameters:
- Current Balance: ${this.formatCurrency(balance)}
- Annual Percentage Rate (APR): ${apr}%
- Monthly Payment: ${this.formatCurrency(payment)}

Results:
- Payoff Time: ${months} months (${years} years)
- Total Interest Paid: ${this.totalInterestResult.textContent}
- Total Amount Paid: ${this.totalPaidResult.textContent}

Generated on: ${new Date().toLocaleString()}
`;

            SharedUtilities.downloadFile(data, 'credit-card-results.txt');
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

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const calc = new CreditCardInterestCalculator();
    // Trigger initial calculation with default values
    setTimeout(() => calc.calculate(false), 100);
});
