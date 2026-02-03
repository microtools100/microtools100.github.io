/**
 * Budget Calculator Tool
 * Plan and manage monthly budget with expense tracking
 */

class BudgetCalculator {
    constructor() {
        this.monthlyIncomeInput = document.getElementById('monthlyIncome');
        this.expenseInputs = {
            housing: document.getElementById('housing'),
            food: document.getElementById('food'),
            transportation: document.getElementById('transportation'),
            utilities: document.getElementById('utilities'),
            insurance: document.getElementById('insurance'),
            entertainment: document.getElementById('entertainment'),
            subscriptions: document.getElementById('subscriptions'),
            personalCare: document.getElementById('personalCare'),
            otherExpenses: document.getElementById('otherExpenses')
        };

        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');

        this.init();
    }

    init() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.download());

        // Real-time calculation
        this.monthlyIncomeInput.addEventListener('input', () => this.calculate());
        Object.values(this.expenseInputs).forEach(input => {
            input.addEventListener('input', () => this.calculate());
        });

        // Keyboard shortcuts
        this.monthlyIncomeInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.calculate();
            }
        });
    }

    calculate() {
        try {
            const income = parseFloat(this.monthlyIncomeInput.value) || 0;
            
            let totalExpenses = 0;
            const expenses = {};
            
            for (const [key, input] of Object.entries(this.expenseInputs)) {
                const value = parseFloat(input.value) || 0;
                expenses[key] = value;
                totalExpenses += value;
            }

            const monthlySavings = income - totalExpenses;
            const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;
            const annualSavings = monthlySavings * 12;

            // Update summary
            document.getElementById('summaryIncome').textContent = this.formatCurrency(income);
            document.getElementById('summaryExpenses').textContent = this.formatCurrency(totalExpenses);
            document.getElementById('summarySavings').textContent = this.formatCurrency(monthlySavings);
            document.getElementById('summarySavingsRate').textContent = savingsRate.toFixed(1) + '%';
            document.getElementById('summaryAnnual').textContent = this.formatCurrency(annualSavings);

            // Update chart
            this.renderChart(expenses, totalExpenses);

            this.clearError();
            SharedUtilities.showNotification('Budget calculated!', 'success');
        } catch (error) {
            this.showError('Calculation error: ' + error.message);
            SharedUtilities.showNotification('Calculation failed', 'error');
        }
    }

    renderChart(expenses, total) {
        const chart = document.getElementById('expenseChart');
        chart.innerHTML = '';

        const expenseLabels = {
            housing: 'Housing',
            food: 'Food & Groceries',
            transportation: 'Transportation',
            utilities: 'Utilities',
            insurance: 'Insurance',
            entertainment: 'Entertainment',
            subscriptions: 'Subscriptions',
            personalCare: 'Personal Care',
            otherExpenses: 'Other'
        };

        const colors = [
            '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
            '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#f59e0b'
        ];

        let colorIndex = 0;
        let nonZeroItems = 0;

        for (const [key, label] of Object.entries(expenseLabels)) {
            const value = expenses[key];
            if (value > 0) {
                nonZeroItems++;
                const percentage = total > 0 ? (value / total) * 100 : 0;
                
                const chartItem = document.createElement('div');
                chartItem.className = 'chart-item';
                chartItem.innerHTML = `
                    <div class="chart-label">
                        <span>${label}</span>
                        <span>${this.formatCurrency(value)} (${percentage.toFixed(1)}%)</span>
                    </div>
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="width: ${percentage}%; background: ${colors[colorIndex % colors.length]};"></div>
                    </div>
                `;
                chart.appendChild(chartItem);
                colorIndex++;
            }
        }

        if (nonZeroItems === 0) {
            chart.innerHTML = '<p style="color: var(--text-light); text-align: center;">Enter expenses to see breakdown</p>';
        }
    }

    clearAll() {
        this.monthlyIncomeInput.value = '';
        Object.values(this.expenseInputs).forEach(input => {
            input.value = '';
        });
        document.getElementById('summaryIncome').textContent = '$0.00';
        document.getElementById('summaryExpenses').textContent = '$0.00';
        document.getElementById('summarySavings').textContent = '$0.00';
        document.getElementById('summarySavingsRate').textContent = '0%';
        document.getElementById('summaryAnnual').textContent = '$0.00';
        document.getElementById('expenseChart').innerHTML = '';
        this.clearError();
    }

    download() {
        const income = parseFloat(this.monthlyIncomeInput.value) || 0;
        let totalExpenses = 0;

        for (const input of Object.values(this.expenseInputs)) {
            totalExpenses += parseFloat(input.value) || 0;
        }

        const savings = income - totalExpenses;
        const savingsRate = income > 0 ? (savings / income) * 100 : 0;

        const csv = 'Monthly Budget Report\n\n';
        const data = csv + `Monthly Income,${income.toFixed(2)}\n` +
                     `Housing,${parseFloat(this.expenseInputs.housing.value) || 0}\n` +
                     `Food & Groceries,${parseFloat(this.expenseInputs.food.value) || 0}\n` +
                     `Transportation,${parseFloat(this.expenseInputs.transportation.value) || 0}\n` +
                     `Utilities,${parseFloat(this.expenseInputs.utilities.value) || 0}\n` +
                     `Insurance,${parseFloat(this.expenseInputs.insurance.value) || 0}\n` +
                     `Entertainment,${parseFloat(this.expenseInputs.entertainment.value) || 0}\n` +
                     `Subscriptions,${parseFloat(this.expenseInputs.subscriptions.value) || 0}\n` +
                     `Personal Care,${parseFloat(this.expenseInputs.personalCare.value) || 0}\n` +
                     `Other Expenses,${parseFloat(this.expenseInputs.otherExpenses.value) || 0}\n\n` +
                     `Total Expenses,${totalExpenses.toFixed(2)}\n` +
                     `Monthly Savings,${savings.toFixed(2)}\n` +
                     `Savings Rate,${savingsRate.toFixed(1)}%\n` +
                     `Annual Savings,${(savings * 12).toFixed(2)}\n`;

        SharedUtilities.downloadFile(data, 'budget-report.csv', 'text/csv');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }

    showError(message) {
        this.errorMsg.textContent = message;
        this.errorMsg.classList.add('show');
    }

    clearError() {
        this.errorMsg.classList.remove('show');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BudgetCalculator());
} else {
    new BudgetCalculator();
}
