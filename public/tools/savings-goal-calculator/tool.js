/**
 * Savings Goal Calculator Tool
 * Calculate time to reach savings goal with compound interest
 */

class SavingsGoalCalculator {
    constructor() {
        this.currentSavings = document.getElementById('currentSavings');
        this.monthlyContribution = document.getElementById('monthlyContribution');
        this.annualReturn = document.getElementById('annualReturn');
        this.targetAmount = document.getElementById('targetAmount');

        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');

        this.monthsResult = document.getElementById('monthsResult');
        this.yearsResult = document.getElementById('yearsResult');
        this.totalAmountResult = document.getElementById('totalAmountResult');
        this.totalContributedResult = document.getElementById('totalContributedResult');
        this.totalInterestResult = document.getElementById('totalInterestResult');

        this.timelineContainer = document.getElementById('timelineContainer');
        this.timelineChart = document.getElementById('timelineChart');
        this.breakdownContainer = document.getElementById('breakdownContainer');
        this.breakdownChart = document.getElementById('breakdownChart');

        this.init();
    }

    init() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.download());

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.calculate();
            }
        });
    }

    calculate() {
        try {
            const current = parseFloat(this.currentSavings.value) || 0;
            const monthly = parseFloat(this.monthlyContribution.value) || 0;
            const annualRate = parseFloat(this.annualReturn.value) || 0;
            const target = parseFloat(this.targetAmount.value) || 0;

            if (target <= 0) {
                throw new Error('Target amount must be greater than 0');
            }

            if (current >= target) {
                this.displayResults(0, current, current, 0);
                this.clearError();
                SharedUtilities.showNotification('You have already reached your goal!', 'success');
                return;
            }

            const monthlyRate = annualRate / 12 / 100;
            let months = 0;
            let balance = current;

            // Calculate months to reach target
            if (monthlyRate === 0) {
                // No interest, simple calculation
                if (monthly === 0) {
                    throw new Error('Enter a monthly contribution or expected return');
                }
                months = Math.ceil((target - current) / monthly);
            } else {
                // With compound interest: FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
                // Solve for n iteratively
                for (let i = 1; i <= 10000; i++) {
                    balance = current * Math.pow(1 + monthlyRate, i) + 
                             monthly * (Math.pow(1 + monthlyRate, i) - 1) / monthlyRate;
                    if (balance >= target) {
                        months = i;
                        break;
                    }
                }
                if (months === 0) {
                    throw new Error('Cannot reach target with given parameters');
                }
            }

            const totalContributed = current + (monthly * months);
            const finalAmount = target;
            const totalInterest = finalAmount - totalContributed;

            this.displayResults(months, finalAmount, totalContributed, totalInterest);
            this.renderTimeline(current, months, monthly, monthlyRate);
            this.renderBreakdown(totalContributed, totalInterest, finalAmount);
            this.clearError();
            SharedUtilities.showNotification('Calculation complete!', 'success');

        } catch (error) {
            this.showError(error.message);
            SharedUtilities.showNotification('Calculation error: ' + error.message, 'error');
        }
    }

    displayResults(months, finalAmount, totalContributed, totalInterest) {
        const years = (months / 12).toFixed(1);
        this.monthsResult.textContent = months === 0 ? 'Already reached!' : months.toLocaleString();
        this.yearsResult.textContent = years;
        this.totalAmountResult.textContent = this.formatCurrency(finalAmount);
        this.totalContributedResult.textContent = this.formatCurrency(totalContributed);
        this.totalInterestResult.textContent = this.formatCurrency(totalInterest);
    }

    renderTimeline(startAmount, totalMonths, monthly, monthlyRate) {
        this.timelineContainer.style.display = 'block';
        this.timelineChart.innerHTML = '';

        // Generate milestones: every 3 months or every 10% if longer than 30 months
        let milestones = [];
        const interval = totalMonths > 30 ? Math.ceil(totalMonths / 10) : 3;
        
        for (let m = 0; m <= totalMonths; m += interval) {
            milestones.push({ month: m });
        }
        // Always add the final goal
        if (milestones[milestones.length - 1].month !== totalMonths) {
            milestones.push({ month: totalMonths });
        }

        // Calculate balances for each milestone
        milestones.forEach((milestone, index) => {
            const balance = startAmount * Math.pow(1 + monthlyRate, milestone.month) +
                           monthly * (Math.pow(1 + monthlyRate, milestone.month) - 1) / monthlyRate;

            const percentage = (milestone.month / totalMonths) * 100;
            const label = milestone.month === totalMonths ? 'Goal' : `M${milestone.month}`;

            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-marker">${label}</div>
                <div class="timeline-bar-container">
                    <div class="timeline-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="timeline-label">${this.formatCurrency(balance)}</div>
            `;
            this.timelineChart.appendChild(item);
        });
    }

    renderBreakdown(totalContributed, totalInterest, finalAmount) {
        this.breakdownContainer.style.display = 'block';
        this.breakdownChart.innerHTML = '';

        const contributedPercent = (totalContributed / finalAmount) * 100;
        const interestPercent = (totalInterest / finalAmount) * 100;

        const items = [
            {
                label: `Contributions (${contributedPercent.toFixed(1)}%)`,
                value: totalContributed,
                className: 'contributed'
            },
            {
                label: `Interest Earned (${interestPercent.toFixed(1)}%)`,
                value: totalInterest,
                className: 'interest'
            },
            {
                label: `Final Amount`,
                value: finalAmount,
                className: ''
            }
        ];

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = `breakdown-item ${item.className}`;
            div.innerHTML = `
                <span class="breakdown-label">${item.label}</span>
                <span class="breakdown-value">${this.formatCurrency(item.value)}</span>
            `;
            this.breakdownChart.appendChild(div);
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
        this.currentSavings.value = '';
        this.monthlyContribution.value = '';
        this.annualReturn.value = '5';
        this.targetAmount.value = '';

        this.monthsResult.textContent = '-';
        this.yearsResult.textContent = '-';
        this.totalAmountResult.textContent = '$0.00';
        this.totalContributedResult.textContent = '$0.00';
        this.totalInterestResult.textContent = '$0.00';

        this.timelineContainer.style.display = 'none';
        this.breakdownContainer.style.display = 'none';
        this.clearError();

        SharedUtilities.showNotification('Cleared all values', 'info');
    }

    download() {
        try {
            const current = parseFloat(this.currentSavings.value) || 0;
            const monthly = parseFloat(this.monthlyContribution.value) || 0;
            const rate = parseFloat(this.annualReturn.value) || 0;
            const target = parseFloat(this.targetAmount.value) || 0;

            const months = parseInt(this.monthsResult.textContent.replace(/[^0-9]/g, '')) || 0;
            const years = parseFloat(this.yearsResult.textContent) || 0;

            const data = `Savings Goal Calculator Results
================================

Input Parameters:
- Current Savings: ${this.formatCurrency(current)}
- Monthly Contribution: ${this.formatCurrency(monthly)}
- Annual Return: ${rate}%
- Target Goal: ${this.formatCurrency(target)}

Results:
- Time to Goal: ${months} months (${years} years)
- Total Amount at Goal: ${this.totalAmountResult.textContent}
- Total Contributed: ${this.totalContributedResult.textContent}
- Total Interest Earned: ${this.totalInterestResult.textContent}

Generated on: ${new Date().toLocaleString()}
`;

            SharedUtilities.downloadFile(data, 'savings-goal-results.txt');
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
    new SavingsGoalCalculator();
});
