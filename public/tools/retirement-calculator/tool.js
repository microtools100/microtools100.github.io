/**
 * Retirement Calculator Tool
 * Calculate retirement readiness and longevity
 */

class RetirementCalculator {
    constructor() {
        this.currentAge = document.getElementById('currentAge');
        this.retirementAge = document.getElementById('retirementAge');
        this.lifeExpectancy = document.getElementById('lifeExpectancy');
        this.currentSavings = document.getElementById('currentSavings');
        this.annualSavings = document.getElementById('annualSavings');
        this.expectedReturn = document.getElementById('expectedReturn');
        this.annualExpenses = document.getElementById('annualExpenses');
        this.inflationRate = document.getElementById('inflationRate');

        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');
        this.resultsContainer = document.getElementById('resultsContainer');

        this.currentAdjustment = 0;
        this.expenseAdjustment = 0;

        this.init();
    }

    init() {
        // Add auto-calculation on input change
        this.currentAge.addEventListener('input', () => this.calculate(false));
        this.retirementAge.addEventListener('input', () => this.calculate(false));
        this.lifeExpectancy.addEventListener('input', () => this.calculate(false));
        this.currentSavings.addEventListener('input', () => this.calculate(false));
        this.annualSavings.addEventListener('input', () => this.calculate(false));
        this.expectedReturn.addEventListener('input', () => this.calculate(false));
        this.annualExpenses.addEventListener('input', () => this.calculate(false));
        this.inflationRate.addEventListener('input', () => this.calculate(false));

        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.download());

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
            const age = parseInt(this.currentAge.value) || 0;
            const retirementAge = parseInt(this.retirementAge.value) || 0;
            const lifeExpectancy = parseInt(this.lifeExpectancy.value) || 0;
            const savings = parseFloat(this.currentSavings.value) || 0;
            const annualSav = (parseFloat(this.annualSavings.value) || 0) + this.currentAdjustment;
            const returnRate = parseFloat(this.expectedReturn.value) || 0;
            const expenses = (parseFloat(this.annualExpenses.value) || 0) + this.expenseAdjustment;
            const inflation = parseFloat(this.inflationRate.value) || 0;

            // In silent mode, skip if fields are empty
            if (!showErrors) {
                if (age <= 0 || retirementAge <= 0 || lifeExpectancy <= 0 || expenses <= 0) {
                    this.updateQuickSummary(0, 0, 0, 'N/A');
                    this.clearError();
                    return;
                }
            }

            if (age <= 0 || retirementAge <= 0 || lifeExpectancy <= 0) {
                throw new Error('Please enter valid ages');
            }

            if (retirementAge <= age) {
                throw new Error('Retirement age must be after current age');
            }

            if (expenses <= 0) {
                throw new Error('Annual expenses must be greater than 0');
            }

            const yearsToRetirement = retirementAge - age;
            const yearsInRetirement = lifeExpectancy - retirementAge;

            // Calculate savings at retirement
            const savingsAtRetirement = this.calculateSavingsAtRetirement(
                savings, 
                annualSav, 
                returnRate, 
                yearsToRetirement
            );

            // Calculate if money lasts and when it runs out
            const { canLast, runOutAge, finalBalance } = this.calculateRetirementLongevity(
                savingsAtRetirement,
                expenses,
                returnRate,
                inflation,
                yearsInRetirement,
                retirementAge
            );

            this.displayResults({
                savingsAtRetirement,
                yearsInRetirement,
                canLast,
                runOutAge,
                finalBalance,
                retirementAge,
                lifeExpectancy
            });

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

    calculateSavingsAtRetirement(initial, annual, returnRate, years) {
        const rate = returnRate / 100;
        const monthlyRate = rate / 12;
        const months = years * 12;

        // FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
        let balance = initial * Math.pow(1 + monthlyRate, months);
        balance += (annual / 12) * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

        return balance;
    }

    calculateRetirementLongevity(initialBalance, annualExpenses, returnRate, inflationRate, yearsInRetirement, retirementAge) {
        let balance = initialBalance;
        const monthlyRate = returnRate / 12 / 100;
        const monthlyInflation = inflationRate / 12 / 100;
        let currentExpenses = annualExpenses;
        let runOutAge = null;
        const totalMonths = yearsInRetirement * 12;

        for (let month = 1; month <= totalMonths; month++) {
            // Add investment returns
            balance = balance * (1 + monthlyRate);

            // Increase expenses due to inflation
            if (month % 12 === 0) {
                currentExpenses *= (1 + inflationRate / 100);
            }

            // Withdraw monthly expenses
            const monthlyExpense = currentExpenses / 12;
            balance -= monthlyExpense;

            // Check if money ran out
            if (balance <= 0 && !runOutAge) {
                const yearsOut = month / 12;
                runOutAge = retirementAge + yearsOut;
            }
        }

        const canLast = balance > 0;
        const finalBalance = Math.max(0, balance);

        return { canLast, runOutAge, finalBalance };
    }

    displayResults(result) {
        // Update Quick Summary
        const yearsToRetire = parseInt(this.retirementAge.value) - parseInt(this.currentAge.value);
        const status = result.canLast ? '✓ On Track' : '⚠ Shortfall';
        
        this.updateQuickSummary(yearsToRetire, result.savingsAtRetirement, result.finalBalance, status);
        
        this.resultsContainer.style.display = 'block';

        const statusCard = document.getElementById('statusCard');
        const statusTitle = document.getElementById('statusTitle');
        const statusMessage = document.getElementById('statusMessage');

        // Update status
        if (result.canLast) {
            statusCard.className = 'status-card';
            statusTitle.textContent = '✓ On Track';
            statusMessage.textContent = `Your savings should support your retirement needs through age ${result.lifeExpectancy}.`;
        } else if (result.runOutAge) {
            statusCard.className = 'status-card danger';
            statusTitle.textContent = '⚠ Shortfall Alert';
            statusMessage.textContent = `Your money may run out around age ${Math.floor(result.runOutAge)}. Consider adjusting savings or expenses.`;
        }

        document.getElementById('savingsAtRetirement').textContent = this.formatCurrency(result.savingsAtRetirement);
        document.getElementById('yearsInRetirement').textContent = Math.round(result.yearsInRetirement) + ' years';
        
        if (result.runOutAge) {
            document.getElementById('moneyRunsOutAge').textContent = 'Age ' + Math.floor(result.runOutAge);
        } else {
            document.getElementById('moneyRunsOutAge').textContent = 'Beyond age ' + result.lifeExpectancy;
        }

        const currentExpenses = parseFloat(this.annualExpenses.value) || 0;
        const surplus = result.finalBalance;
        document.getElementById('shortfallSurplus').textContent = this.formatCurrency(surplus);

        // Generate and display insights
        const insights = this.generateInsights(result);
        document.getElementById('insightsText').innerHTML = insights;

        this.renderTimeline(result);
    }

    updateQuickSummary(yearsToRetire, retirementSavings, yearlyBudget, status) {
        document.getElementById('yearsToRetireQuick').textContent = yearsToRetire || '0';
        document.getElementById('retirementSavingsQuick').textContent = this.formatCurrency(retirementSavings);
        document.getElementById('yearlyBudgetQuick').textContent = this.formatCurrency(yearlyBudget);
        document.getElementById('retirementStatusQuick').textContent = status;
    }

    generateInsights(result) {
        let insights = '';
        const savingsAtRetirement = result.savingsAtRetirement;
        const annualExpenses = parseFloat(this.annualExpenses.value) || 0;
        const yearsToRetirement = parseInt(this.retirementAge.value) - parseInt(this.currentAge.value);
        const yearsInRetirement = result.yearsInRetirement;
        const rateOfReturn = parseFloat(this.expectedReturn.value) || 0;
        const annualSavings = parseFloat(this.annualSavings.value) || 0;

        if (result.canLast) {
            insights = `✓ <strong>Excellent news:</strong> Your retirement savings should last through age ${result.lifeExpectancy}. `;
            
            // Calculate buffer
            const buffer = result.finalBalance / annualExpenses;
            if (buffer > 5) {
                insights += `You'll have a comfortable buffer of approximately ${buffer.toFixed(1)} years of expenses remaining, giving you flexibility for unexpected costs or increased spending.`;
            } else if (buffer > 1) {
                insights += `You'll have approximately ${buffer.toFixed(1)} years of expenses as a safety buffer. Consider saving a bit more for unexpected healthcare costs.`;
            } else {
                insights += `Your funds will last, but with minimal surplus. Any major expenses or longevity beyond ${result.lifeExpectancy} could be challenging.`;
            }
        } else {
            insights = `⚠️ <strong>Heads up:</strong> Your money may run out around age ${Math.floor(result.runOutAge)}. `;
            const shortfallYears = Math.floor(result.runOutAge) - Math.floor(this.retirementAge.value);
            const totalShortfall = -result.finalBalance;
            
            insights += `To fix this, consider: `;
            
            // Calculate impact of different adjustments
            const workOneMore = this.calculateSavingsAtRetirement(
                parseFloat(this.currentSavings.value) || 0,
                annualSavings,
                rateOfReturn,
                yearsToRetirement + 1
            );
            const spendLess = (workOneMore * 1.05 / annualExpenses) * 12; // rough estimate
            
            insights += `(1) Work ${Math.max(1, Math.ceil(totalShortfall / annualSavings / 2))} more years, `;
            insights += `(2) Increase annual savings by ${Math.max(500, Math.ceil(totalShortfall / yearsToRetirement)).toLocaleString()}, or `;
            insights += `(3) Reduce annual expenses by ${Math.max(1000, Math.ceil(totalShortfall / yearsInRetirement)).toLocaleString()}.`;
        }

        // Additional insights based on savings rate
        if (annualSavings < annualExpenses * 0.2) {
            insights += ` Your annual savings (${this.formatCurrency(annualSavings)}) is quite low compared to expenses (${this.formatCurrency(annualExpenses)}). Try to save at least 20-30% of annual expenses.`;
        }

        // Inflation warning
        const inflationRate = parseFloat(this.inflationRate.value) || 0;
        if (inflationRate > 4) {
            insights += ` Note: Your assumed inflation rate of ${inflationRate}% is above typical; this makes expenses grow faster, potentially straining your budget.`;
        }

        return insights;
    }

    renderTimeline(result) {
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';

        const stages = [
            {
                label: 'To Retirement',
                years: parseInt(this.retirementAge.value) - parseInt(this.currentAge.value),
                type: 'accumulation'
            },
            {
                label: 'In Retirement',
                years: result.yearsInRetirement,
                type: 'spending'
            }
        ];

        const maxYears = Math.max(...stages.map(s => s.years)) || 1;

        stages.forEach(stage => {
            const percentage = (stage.years / maxYears) * 100;
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-label">${stage.label}</div>
                <div class="timeline-bar-container">
                    <div class="timeline-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="timeline-amount">${stage.years} yrs</div>
            `;
            timeline.appendChild(item);
        });
    }

    adjustSavings(amount) {
        this.currentAdjustment += amount;
        this.calculate();
        SharedUtilities.showNotification(`Annual savings adjusted by ${this.formatCurrency(amount)}`, 'info');
    }

    adjustExpenses(amount) {
        this.expenseAdjustment += amount;
        this.calculate();
        SharedUtilities.showNotification(`Annual expenses adjusted by ${this.formatCurrency(amount)}`, 'info');
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
        this.currentAge.value = '35';
        this.retirementAge.value = '65';
        this.lifeExpectancy.value = '85';
        this.currentSavings.value = '100000';
        this.annualSavings.value = '15000';
        this.expectedReturn.value = '7';
        this.annualExpenses.value = '50000';
        this.inflationRate.value = '3';

        this.currentAdjustment = 0;
        this.expenseAdjustment = 0;
        
        // Reset Quick Summary
        this.updateQuickSummary(0, 0, 0, 'N/A');
        
        this.resultsContainer.style.display = 'none';
        this.clearError();

        // Trigger auto-calculation after clearing
        setTimeout(() => this.calculate(false), 100);
    }

    download() {
        try {
            const age = parseInt(this.currentAge.value) || 0;
            const retirementAge = parseInt(this.retirementAge.value) || 0;
            const lifeExpectancy = parseInt(this.lifeExpectancy.value) || 0;
            const savings = parseFloat(this.currentSavings.value) || 0;
            const annualSav = parseFloat(this.annualSavings.value) || 0;
            const returnRate = parseFloat(this.expectedReturn.value) || 0;
            const expenses = parseFloat(this.annualExpenses.value) || 0;
            const inflation = parseFloat(this.inflationRate.value) || 0;

            const data = `Retirement Calculator Results
============================

Personal Information:
- Current Age: ${age}
- Retirement Age: ${retirementAge}
- Life Expectancy: ${lifeExpectancy}

Savings & Income:
- Current Savings: ${this.formatCurrency(savings)}
- Annual Savings: ${this.formatCurrency(annualSav)}
- Expected Return: ${returnRate}%

Retirement Spending:
- Annual Expenses: ${this.formatCurrency(expenses)}
- Inflation Rate: ${inflation}%

Results:
- Savings at Retirement: ${document.getElementById('savingsAtRetirement').textContent}
- Years in Retirement: ${document.getElementById('yearsInRetirement').textContent}
- Money Runs Out At: ${document.getElementById('moneyRunsOutAge').textContent}
- Final Balance/Shortfall: ${document.getElementById('shortfallSurplus').textContent}

Generated on: ${new Date().toLocaleString()}
`;

            SharedUtilities.downloadFile(data, 'retirement-plan.txt');
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

let retirementCalculator;

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    retirementCalculator = new RetirementCalculator();
    // Auto-calculate on page load
    setTimeout(() => retirementCalculator.calculate(false), 100);
});
