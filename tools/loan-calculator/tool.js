/**
 * Loan Calculator Tool
 * Calculate monthly payments and amortization schedule
 */

class LoanCalculator {
    constructor() {
        this.loanAmount = document.getElementById('loanAmount');
        this.interestRate = document.getElementById('interestRate');
        this.loanTerm = document.getElementById('loanTerm');

        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');

        this.monthlyPayment = document.getElementById('monthlyPayment');
        this.totalInterest = document.getElementById('totalInterest');
        this.totalPaid = document.getElementById('totalPaid');
        this.amortBody = document.getElementById('amortBody');

        this.init();
    }

    init() {
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.download());

        // Real-time calculation without validation errors
        this.loanAmount.addEventListener('input', () => this.calculate(false));
        this.interestRate.addEventListener('input', () => this.calculate(false));
        this.loanTerm.addEventListener('input', () => this.calculate(false));

        // Keyboard shortcuts
        this.loanTerm.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.calculate(true);
            }
        });
    }

    calculate(showErrors = true) {
        try {
            const principal = parseFloat(this.loanAmount.value) || 0;
            const annualRate = parseFloat(this.interestRate.value) || 0;
            const years = parseFloat(this.loanTerm.value) || 0;

            if (showErrors) {
                if (principal <= 0) {
                    throw new Error('Loan amount must be greater than 0');
                }
                if (annualRate < 0) {
                    throw new Error('Interest rate cannot be negative');
                }
                if (years <= 0) {
                    throw new Error('Loan term must be greater than 0');
                }
            } else {
                // Silent mode: only calculate if all fields have values
                if (principal <= 0 || annualRate < 0 || years <= 0) {
                    this.clearResults();
                    this.clearError();
                    return;
                }
            }

            const monthlyRate = annualRate / 100 / 12;
            const numberOfPayments = years * 12;

            // Calculate monthly payment using amortization formula
            // M = P * [r(1+r)^n] / [(1+r)^n - 1]
            let monthlyPaymentAmount = 0;
            if (monthlyRate === 0) {
                // No interest
                monthlyPaymentAmount = principal / numberOfPayments;
            } else {
                const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
                const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
                monthlyPaymentAmount = numerator / denominator;
            }

            const totalPaidAmount = monthlyPaymentAmount * numberOfPayments;
            const totalInterestAmount = totalPaidAmount - principal;

            // Update display
            this.monthlyPayment.textContent = this.formatCurrency(monthlyPaymentAmount);
            this.totalInterest.textContent = this.formatCurrency(totalInterestAmount);
            this.totalPaid.textContent = this.formatCurrency(totalPaidAmount);

            // Generate amortization schedule
            this.generateAmortizationSchedule(principal, monthlyRate, monthlyPaymentAmount, numberOfPayments);

            this.clearError();
            if (showErrors) {
                SharedUtilities.showNotification('Loan calculated!', 'success');
            }

        } catch (error) {
            if (showErrors) {
                this.showError(error.message);
                SharedUtilities.showNotification('Calculation failed: ' + error.message, 'error');
            }
        }
    }

    generateAmortizationSchedule(principal, monthlyRate, monthlyPayment, months) {
        let balance = principal;
        this.amortBody.innerHTML = '';

        // Show first 12 months in detail
        const detailMonths = Math.min(12, months);
        for (let i = 1; i <= detailMonths; i++) {
            // Calculate interest for this month
            const interestPayment = balance * monthlyRate;
            
            // Calculate principal payment
            let principalPayment = monthlyPayment - interestPayment;

            // Handle final payment rounding
            if (balance - principalPayment < 0.01) {
                principalPayment = balance;
            }

            balance -= principalPayment;
            if (balance < 0) balance = 0;

            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i}</td>
                <td>${this.formatCurrency(monthlyPayment)}</td>
                <td>${this.formatCurrency(principalPayment)}</td>
                <td>${this.formatCurrency(interestPayment)}</td>
                <td>${this.formatCurrency(balance)}</td>
            `;
            this.amortBody.appendChild(row);
        }

        // If loan is longer than 12 months, show yearly summaries
        if (months > 12) {
            // Add a separator row
            const separatorRow = document.createElement('tr');
            separatorRow.innerHTML = '<td colspan="5" style="text-align: center; font-weight: 600; padding: 0.5rem 0; border-top: 2px solid var(--border-color); border-bottom: 1px solid var(--border-color);">Annual Summary</td>';
            this.amortBody.appendChild(separatorRow);

            // Show yearly summaries starting from month 24
            for (let year = 2; year * 12 <= months; year++) {
                const yearMonthEnd = year * 12;
                let yearBalance = principal;
                let yearTotalPrincipal = 0;
                let yearTotalInterest = 0;

                // Calculate year totals
                for (let month = 1; month <= yearMonthEnd; month++) {
                    const interestPayment = yearBalance * monthlyRate;
                    let principalPayment = monthlyPayment - interestPayment;

                    if (yearBalance - principalPayment < 0.01) {
                        principalPayment = yearBalance;
                    }

                    if (month > (year - 1) * 12) {
                        yearTotalPrincipal += principalPayment;
                        yearTotalInterest += interestPayment;
                    }

                    yearBalance -= principalPayment;
                    if (yearBalance < 0) yearBalance = 0;
                }

                // Create yearly summary row
                const yearRow = document.createElement('tr');
                yearRow.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
                yearRow.innerHTML = `
                    <td>Year ${year}</td>
                    <td>${this.formatCurrency(yearTotalPrincipal + yearTotalInterest)}</td>
                    <td>${this.formatCurrency(yearTotalPrincipal)}</td>
                    <td>${this.formatCurrency(yearTotalInterest)}</td>
                    <td>${this.formatCurrency(yearBalance)}</td>
                `;
                this.amortBody.appendChild(yearRow);
            }

            // Show final payment if not aligned with yearly summary
            const finalMonth = months;
            if (finalMonth % 12 !== 0) {
                let finalBalance = principal;
                let finalTotalPrincipal = 0;
                let finalTotalInterest = 0;

                for (let month = 1; month <= finalMonth; month++) {
                    const interestPayment = finalBalance * monthlyRate;
                    let principalPayment = monthlyPayment - interestPayment;

                    if (finalBalance - principalPayment < 0.01) {
                        principalPayment = finalBalance;
                    }

                    if (month > Math.floor(finalMonth / 12) * 12) {
                        finalTotalPrincipal += principalPayment;
                        finalTotalInterest += interestPayment;
                    }

                    finalBalance -= principalPayment;
                    if (finalBalance < 0) finalBalance = 0;
                }

                // Create final period row
                const remainingMonths = finalMonth % 12;
                const finalRow = document.createElement('tr');
                finalRow.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
                finalRow.innerHTML = `
                    <td>Month ${finalMonth}</td>
                    <td>${this.formatCurrency(finalTotalPrincipal + finalTotalInterest)}</td>
                    <td>${this.formatCurrency(finalTotalPrincipal)}</td>
                    <td>${this.formatCurrency(finalTotalInterest)}</td>
                    <td>${this.formatCurrency(finalBalance)}</td>
                `;
                this.amortBody.appendChild(finalRow);
            }
        }
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
        this.loanAmount.value = '';
        this.interestRate.value = '';
        this.loanTerm.value = '';

        this.monthlyPayment.textContent = '$0.00';
        this.totalInterest.textContent = '$0.00';
        this.totalPaid.textContent = '$0.00';
        this.amortBody.innerHTML = '';

        this.clearError();
        SharedUtilities.showNotification('Cleared all values', 'info');
    }

    download() {
        try {
            const principal = parseFloat(this.loanAmount.value) || 0;
            const annualRate = parseFloat(this.interestRate.value) || 0;
            const years = parseFloat(this.loanTerm.value) || 0;

            const data = `Loan Calculator Results
=======================

Loan Details:
- Loan Amount: ${this.formatCurrency(principal)}
- Annual Interest Rate: ${annualRate}%
- Loan Term: ${years} years

Monthly Payment: ${this.monthlyPayment.textContent}
Total Interest: ${this.totalInterest.textContent}
Total Amount Paid: ${this.totalPaid.textContent}

Generated on: ${new Date().toLocaleString()}
`;

            SharedUtilities.downloadFile(data, 'loan-calculator-results.txt');
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
    new LoanCalculator();
});
