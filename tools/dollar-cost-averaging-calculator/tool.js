/**
 * Dollar-Cost Averaging Calculator Tool
 * Calculate DCA strategy returns with simulated price fluctuations
 */

class DollarCostAveragingCalculator {
    constructor() {
        this.investmentFrequency = document.getElementById('investmentFrequency');
        this.amountPerPeriod = document.getElementById('amountPerPeriod');
        this.investmentYears = document.getElementById('investmentYears');
        this.expectedReturn = document.getElementById('expectedReturn');
        this.volatility = document.getElementById('volatility');

        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');

        this.dcaFinalValue = document.getElementById('dcaFinalValue');
        this.totalInvested = document.getElementById('totalInvested');
        this.totalShares = document.getElementById('totalShares');
        this.avgCostPerShare = document.getElementById('avgCostPerShare');
        this.finalPrice = document.getElementById('finalPrice');

        this.comparisonContainer = document.getElementById('comparisonContainer');
        this.purchaseChartContainer = document.getElementById('purchaseChartContainer');
        this.valueChartContainer = document.getElementById('valueChartContainer');

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
            const frequency = this.investmentFrequency.value;
            const amount = parseFloat(this.amountPerPeriod.value) || 0;
            const years = parseFloat(this.investmentYears.value) || 0;
            const annualReturn = parseFloat(this.expectedReturn.value) || 0;
            const volatility = parseFloat(this.volatility.value) || 0;

            if (amount <= 0) {
                throw new Error('Investment amount must be greater than 0');
            }
            if (years <= 0) {
                throw new Error('Investment period must be greater than 0');
            }

            // Calculate periods
            const periodsPerYear = frequency === 'monthly' ? 12 : frequency === 'biweekly' ? 26 : 52;
            const totalPeriods = Math.round(years * periodsPerYear);

            // Simulate price movements
            const { prices, endPrice } = this.simulatePrices(totalPeriods, annualReturn, volatility, periodsPerYear);

            // Calculate DCA results
            const dcaResult = this.calculateDCA(amount, prices);

            // Calculate lump sum for comparison
            const lumpSumResult = this.calculateLumpSum(amount * totalPeriods, prices[prices.length - 1], endPrice);

            this.displayResults(dcaResult, lumpSumResult, endPrice);
            this.renderCharts(prices, dcaResult);
            this.clearError();
            SharedUtilities.showNotification('Calculation complete!', 'success');

        } catch (error) {
            this.showError(error.message);
            SharedUtilities.showNotification('Calculation error: ' + error.message, 'error');
        }
    }

    simulatePrices(periods, annualReturn, volatility, periodsPerYear) {
        let price = 100; // Starting price
        const prices = [price];
        const monthlyReturn = annualReturn / 12 / 100;
        const monthlyVol = volatility / Math.sqrt(12) / 100;

        for (let i = 1; i < periods; i++) {
            // Geometric Brownian Motion simulation
            const drift = (monthlyReturn - (monthlyVol * monthlyVol) / 2) * (1 / (periodsPerYear / 12));
            const randomWalk = monthlyVol * this.normalRandom() * Math.sqrt(1 / (periodsPerYear / 12));
            price = price * Math.exp(drift + randomWalk);
            prices.push(price);
        }

        return {
            prices,
            endPrice: price
        };
    }

    normalRandom() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    calculateDCA(amountPerPeriod, prices) {
        let totalShares = 0;
        let totalInvested = 0;

        prices.forEach(price => {
            const shares = amountPerPeriod / price;
            totalShares += shares;
            totalInvested += amountPerPeriod;
        });

        const finalValue = totalShares * prices[prices.length - 1];
        const avgCost = totalInvested / totalShares;

        return {
            totalShares,
            totalInvested,
            finalValue,
            avgCost,
            gains: finalValue - totalInvested,
            roi: ((finalValue - totalInvested) / totalInvested) * 100
        };
    }

    calculateLumpSum(initialAmount, priceAtStart, finalPrice) {
        const shares = initialAmount / priceAtStart;
        const finalValue = shares * finalPrice;

        return {
            totalInvested: initialAmount,
            shares,
            finalValue,
            gains: finalValue - initialAmount,
            roi: ((finalValue - initialAmount) / initialAmount) * 100
        };
    }

    displayResults(dcaResult, lumpSumResult, endPrice) {
        this.dcaFinalValue.textContent = this.formatCurrency(dcaResult.finalValue);
        this.totalInvested.textContent = this.formatCurrency(dcaResult.totalInvested);
        this.totalShares.textContent = dcaResult.totalShares.toFixed(2);
        this.avgCostPerShare.textContent = this.formatCurrency(dcaResult.avgCost);
        this.finalPrice.textContent = this.formatCurrency(endPrice);

        this.comparisonContainer.style.display = 'block';
        document.getElementById('dcaValue').textContent = this.formatCurrency(dcaResult.finalValue);
        document.getElementById('lumpSumValue').textContent = this.formatCurrency(lumpSumResult.finalValue);
    }

    renderCharts(prices, dcaResult) {
        this.renderPurchaseChart(prices, dcaResult);
        this.renderValueChart(prices, dcaResult);
    }

    renderPurchaseChart(prices, dcaResult) {
        this.purchaseChartContainer.style.display = 'block';
        const chart = document.getElementById('purchaseChart');
        chart.innerHTML = '';

        const samplePrices = this.samplePrices(prices, 10);
        const maxPrice = Math.max(...samplePrices.map(p => p.price));
        const frequency = this.investmentFrequency.value;
        const periodsPerYear = frequency === 'monthly' ? 12 : frequency === 'biweekly' ? 26 : 52;
        const years = parseFloat(this.investmentYears.value);
        const indexStep = Math.round((prices.length - 1) / 9);

        samplePrices.forEach((item, idx) => {
            const price = prices[item.index];
            const amountPerPeriod = parseFloat(this.amountPerPeriod.value);
            const shares = amountPerPeriod / price;
            const percentage = (price / maxPrice) * 100;

            const div = document.createElement('div');
            div.className = 'purchase-item';
            div.innerHTML = `
                <div class="purchase-price">${this.formatCurrency(price)}</div>
                <div class="purchase-bar-container">
                    <div class="purchase-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="purchase-shares">${shares.toFixed(2)} shares</div>
            `;
            chart.appendChild(div);
        });
    }

    renderValueChart(prices, dcaResult) {
        this.valueChartContainer.style.display = 'block';
        const chart = document.getElementById('valueChart');
        chart.innerHTML = '';

        const amountPerPeriod = parseFloat(this.amountPerPeriod.value);
        const frequency = this.investmentFrequency.value;
        const periodsPerYear = frequency === 'monthly' ? 12 : frequency === 'biweekly' ? 26 : 52;

        let totalInvested = 0;
        let totalShares = 0;
        let maxValue = 0;

        const samplePoints = [];
        const step = Math.max(1, Math.floor(prices.length / 12));

        for (let i = 0; i < prices.length; i += step) {
            for (let j = 0; j <= i; j++) {
                if (j === 0 || j % Math.ceil(step) === 0) {
                    totalShares += amountPerPeriod / prices[j];
                    totalInvested += amountPerPeriod;
                }
            }

            // Reset for proper calculation
            totalInvested = 0;
            totalShares = 0;
            for (let j = 0; j <= i; j++) {
                totalShares += amountPerPeriod / prices[j];
                totalInvested += amountPerPeriod;
            }

            const value = totalShares * prices[i];
            maxValue = Math.max(maxValue, value);
            samplePoints.push({
                period: i,
                invested: totalInvested,
                value: value
            });
        }

        samplePoints.slice(0, 13).forEach(point => {
            const percentage = (point.value / maxValue) * 100;
            const period = Math.round(point.period / step);

            const div = document.createElement('div');
            div.className = 'value-item';
            div.innerHTML = `
                <div class="value-label">Period ${period}</div>
                <div class="value-bar-container">
                    <div class="value-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="value-amount">${this.formatCurrency(point.value)}</div>
            `;
            chart.appendChild(div);
        });
    }

    samplePrices(prices, count) {
        const result = [];
        const step = Math.floor(prices.length / count);
        for (let i = 0; i < count; i++) {
            const index = i * step;
            if (index < prices.length) {
                result.push({ index, price: prices[index] });
            }
        }
        return result;
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
        this.investmentFrequency.value = 'monthly';
        this.amountPerPeriod.value = '';
        this.investmentYears.value = '5';
        this.expectedReturn.value = '8';
        this.volatility.value = '15';

        this.dcaFinalValue.textContent = '$0.00';
        this.totalInvested.textContent = '$0.00';
        this.totalShares.textContent = '0';
        this.avgCostPerShare.textContent = '$0.00';
        this.finalPrice.textContent = '$0.00';

        this.comparisonContainer.style.display = 'none';
        this.purchaseChartContainer.style.display = 'none';
        this.valueChartContainer.style.display = 'none';
        this.clearError();

        SharedUtilities.showNotification('Cleared all values', 'info');
    }

    download() {
        try {
            const frequency = this.investmentFrequency.value;
            const amount = parseFloat(this.amountPerPeriod.value) || 0;
            const years = parseFloat(this.investmentYears.value) || 0;
            const expectedReturn = parseFloat(this.expectedReturn.value) || 0;
            const volatility = parseFloat(this.volatility.value) || 0;

            const data = `Dollar-Cost Averaging Calculator Results
======================================

Investment Strategy:
- Frequency: ${frequency}
- Amount per Period: ${this.formatCurrency(amount)}
- Investment Period: ${years} years
- Expected Annual Return: ${expectedReturn}%
- Price Volatility: ${volatility}%

DCA Results:
- Final Value: ${this.dcaFinalValue.textContent}
- Total Invested: ${this.totalInvested.textContent}
- Total Shares: ${this.totalShares.textContent}
- Average Cost Per Share: ${this.avgCostPerShare.textContent}
- Final Price Per Share: ${this.finalPrice.textContent}

Comparison:
- DCA Final Value: ${document.getElementById('dcaValue').textContent}
- Lump Sum Final Value: ${document.getElementById('lumpSumValue').textContent}

Generated on: ${new Date().toLocaleString()}
`;

            SharedUtilities.downloadFile(data, 'dca-results.txt');
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
    new DollarCostAveragingCalculator();
});
