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

        // Get the calculate button if it exists
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate(true));
        }

        // Keyboard shortcut - Ctrl/Cmd+Enter to calculate
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

            // Validation
            if (balance <= 0) {
                throw new Error('Balance must be greater than 0');
            }

            if (payment <= 0) {
                throw new Error('Monthly payment must be greater than 0');
            }

            if (apr < 0) {
                throw new Error('APR cannot be negative');
            }

            // Handle zero APR case
            if (apr === 0) {
                const months = Math.ceil(balance / payment);
                const result = {
                    months: months,
                    totalInterest: 0,
                    totalPaid: balance,
                    initialBalance: balance,
                    schedule: []
                };
                this.displayResults(result);
                this.renderSchedule(this.generateZeroAprSchedule(balance, payment, months));
                this.renderChart(this.generateZeroAprSchedule(balance, payment, months));
                this.clearError();
                if (typeof SharedUtilities !== 'undefined') {
                    SharedUtilities.showNotification('Calculation complete!', 'success');
                }
                return;
            }

            const monthlyRate = apr / 12 / 100;

            // Calculate minimum payment required to actually pay off (not just interest)
            // This is: balance × monthly interest rate
            // Example: $5000 × (18% / 12 / 100) = $5000 × 0.015 = $75 minimum
            const minPayment = balance * monthlyRate;
            
            // Check if payment is insufficient
            if (payment <= minPayment) {
                throw new Error(`Monthly payment must be more than minimum interest payment of ${this.formatCurrency(minPayment)}`);
            }

            const result = this.simulatePayoff(balance, apr, payment);
            // Always display results, even if it exceeds 600 months
            // The warning will be shown in displayPayoffWarnings()
            this.displayResults(result);
            this.renderSchedule(result.schedule);
            this.renderChart(result.schedule);
            this.clearError();
            if (typeof SharedUtilities !== 'undefined') {
                SharedUtilities.showNotification('Calculation complete!', 'success');
            }

        } catch (error) {
            this.showError(error.message);
            if (typeof SharedUtilities !== 'undefined') {
                SharedUtilities.showNotification('Calculation error: ' + error.message, 'error');
            }
        }
    }

    generateZeroAprSchedule(balance, payment, totalMonths) {
        const schedule = [];
        let remaining = balance;
        
        for (let month = 1; month <= Math.min(totalMonths, 12); month++) {
            const monthPayment = Math.min(payment, remaining);
            remaining -= monthPayment;
            
            schedule.push({
                month: month,
                payment: monthPayment,
                principal: monthPayment,
                interest: 0,
                remaining: Math.max(0, remaining)
            });
        }
        
        // If more than 12 months, add yearly summary
        if (totalMonths > 12) {
            schedule.push({
                month: 'sep',
                payment: 0,
                principal: 0,
                interest: 0,
                remaining: 0,
                isSeparator: true
            });
            
            let currentRemaining = balance - (Math.min(12, totalMonths) * payment);
            for (let year = 2; year <= Math.ceil(totalMonths / 12); year++) {
                const monthsInYear = Math.min(12, totalMonths - (year - 1) * 12);
                const yearPayment = monthsInYear * payment;
                currentRemaining -= yearPayment;
                
                schedule.push({
                    month: `Year ${year} (${monthsInYear} months)`,
                    payment: yearPayment,
                    principal: yearPayment,
                    interest: 0,
                    remaining: Math.max(0, currentRemaining),
                    isYearlySum: true
                });
            }
        }
        
        return schedule;
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

        // Display warning messages based on payoff time
        this.displayPayoffWarnings(result);
    }

    displayPayoffWarnings(result) {
        // Ensure SharedUtilities is available
        if (typeof SharedUtilities === 'undefined') {
            console.warn('SharedUtilities not loaded yet');
            return;
        }

        if (result.months < 1) {
            // Less than 1 month - very fast payoff
            const days = (result.months * 30).toFixed(0);
            const message = `⚡ Excellent! Your payment of $${parseFloat(this.monthlyPayment.value).toFixed(2)} will pay off this debt in just ${days} days (less than 1 month). Interest: $${result.totalInterest.toFixed(2)}`;
            SharedUtilities.showNotification(message, 'success', 5000);
        } else if (result.months >= 600) {
            // Hit the 50-year max limit
            const suggestedPayment = this.calculateSuggestedPayment(parseFloat(this.currentBalance.value), parseFloat(this.apr.value)).toFixed(2);
            const message = `⚠️ At your current payment ($${parseFloat(this.monthlyPayment.value).toFixed(2)}), payoff exceeds 50 years. Consider increasing to $${suggestedPayment}/month for a 5-year payoff.`;
            SharedUtilities.showNotification(message, 'error', 7000);
        } else if (result.months >= 360) {
            // 30+ years - long payoff time
            const years = (result.months / 12).toFixed(1);
            const interestPercent = ((result.totalInterest / parseFloat(this.currentBalance.value)) * 100).toFixed(0);
            const message = `⏰ Long timeline ahead: ${years} years to pay off. Interest cost: $${result.totalInterest.toFixed(2)} (${interestPercent}% of balance). Increasing payment by $50-100 can save years and thousands.`;
            SharedUtilities.showNotification(message, 'warning', 6000);
        }
    }

    calculateSuggestedPayment(balance, apr) {
        // Suggest a payment that would pay off in 5 years (60 months)
        const monthlyRate = apr / 12 / 100;
        if (monthlyRate === 0) {
            return balance / 60;
        }
        // Using amortization formula: P = (r * PV) / (1 - (1 + r)^-n)
        const months = 60;
        const payment = (monthlyRate * balance) / (1 - Math.pow(1 + monthlyRate, -months));
        return payment;
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

        if (typeof SharedUtilities !== 'undefined') {
            SharedUtilities.showNotification('Cleared all values', 'info');
        }
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

            if (typeof SharedUtilities !== 'undefined') {
                SharedUtilities.downloadFile(data, 'credit-card-results.txt');
                SharedUtilities.showNotification('Results downloaded!', 'success');
            }
        } catch (error) {
            if (typeof SharedUtilities !== 'undefined') {
                SharedUtilities.showNotification('Download failed', 'error');
            }
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
});
