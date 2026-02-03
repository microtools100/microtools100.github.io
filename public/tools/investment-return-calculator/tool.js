/**
 * Investment Return Calculator Tool
 * Calculate investment growth with compound interest
 */

class InvestmentReturnCalculator {
    constructor() {
        this.initialInvestment = document.getElementById('initialInvestment');
        this.monthlyContribution = document.getElementById('monthlyContribution');
        this.annualReturn = document.getElementById('annualReturn');
        this.yearsInvest = document.getElementById('yearsInvest');

        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.getElementById('errorMsg');

        this.finalAmountResult = document.getElementById('finalAmountResult');
        this.totalInvestedResult = document.getElementById('totalInvestedResult');
        this.totalGainsResult = document.getElementById('totalGainsResult');
        this.roiResult = document.getElementById('roiResult');

        this.growthChartContainer = document.getElementById('growthChartContainer');
        this.growthChart = document.getElementById('growthChart');
        this.breakdownContainer = document.getElementById('breakdownContainer');
        this.breakdownChart = document.getElementById('breakdownChart');
        this.yearlyTableContainer = document.getElementById('yearlyTableContainer');
        this.yearlyTable = document.getElementById('yearlyTable');

        this.init();
    }

    init() {
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.download());

        // Real-time calculation
        this.initialInvestment.addEventListener('input', () => this.calculate(false));
        this.monthlyContribution.addEventListener('input', () => this.calculate(false));
        this.annualReturn.addEventListener('input', () => this.calculate(false));
        this.yearsInvest.addEventListener('input', () => this.calculate(false));

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
            const initial = parseFloat(this.initialInvestment.value) || 0;
            const monthly = parseFloat(this.monthlyContribution.value) || 0;
            const annualRate = parseFloat(this.annualReturn.value) || 0;
            const years = parseFloat(this.yearsInvest.value) || 0;

            // Silent mode: only calculate if all fields have values
            if (!showErrors) {
                if (initial < 0 || monthly < 0 || annualRate < 0 || years <= 0) {
                    this.clearError();
                    return;
                }
            } else {
                if (years <= 0) {
                    throw new Error('Investment period must be greater than 0');
                }
            }

            const result = this.calculateGrowth(initial, monthly, annualRate, years);
            this.displayResults(result);
            this.renderYearlyTable(result.monthlyData);
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

    calculateGrowth(initial, monthly, annualRate, years) {
        const monthlyRate = annualRate / 12 / 100;
        const months = Math.round(years * 12);
        let balance = initial;
        let totalInvested = initial;
        const allMonths = [];

        // Calculate all months
        for (let month = 1; month <= months; month++) {
            // Add interest
            balance = balance * (1 + monthlyRate) + monthly;
            totalInvested += monthly;

            allMonths.push({
                month: month,
                year: Math.ceil(month / 12),
                balance,
                invested: totalInvested,
                gains: Math.max(0, balance - totalInvested)
            });
        }

        // Build display data: first 12 months + yearly summaries
        const monthlyData = [];
        
        // Add first 12 months in detail
        for (let i = 0; i < Math.min(12, allMonths.length); i++) {
            const m = allMonths[i];
            monthlyData.push({
                label: `Month ${m.month}`,
                year: m.year,
                balance: m.balance,
                invested: m.invested,
                gains: m.gains
            });
        }

        // Add annual summaries for year 2+
        if (allMonths.length > 12) {
            monthlyData.push({
                isSeparator: true,
                label: 'Annual Summaries'
            });

            for (let year = 2; year * 12 <= allMonths.length; year++) {
                const yearEndIdx = Math.min(year * 12, allMonths.length) - 1;
                const yearData = allMonths[yearEndIdx];
                
                monthlyData.push({
                    label: `Year ${year}`,
                    year: year,
                    balance: yearData.balance,
                    invested: yearData.invested,
                    gains: yearData.gains,
                    isYearlySum: true
                });
            }

            // Handle final partial year
            const finalMonth = allMonths.length;
            const finalYear = Math.ceil(finalMonth / 12);
            if (finalMonth % 12 !== 0 && finalYear > 1) {
                const lastFull = Math.floor(allMonths.length / 12) * 12;
                if (lastFull > 0 && lastFull < allMonths.length) {
                    const finalData = allMonths[allMonths.length - 1];
                    monthlyData.push({
                        label: `Year ${finalYear} (Partial)`,
                        year: finalYear,
                        balance: finalData.balance,
                        invested: finalData.invested,
                        gains: finalData.gains,
                        isYearlySum: true
                    });
                }
            }
        }

        const finalAmount = balance;
        const totalGains = Math.max(0, finalAmount - totalInvested);
        const roi = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;

        return {
            finalAmount,
            totalInvested,
            totalGains,
            roi,
            monthlyData,
            yearlyData: allMonths.filter((_, i) => (i + 1) % 12 === 0 || i === allMonths.length - 1).map((m, idx) => ({
                year: idx + 1,
                balance: m.balance,
                invested: m.invested,
                gains: m.gains
            }))
        };
    }

    displayResults(result) {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        
        // Update quick summary
        document.getElementById('finalAmountQuick').textContent = this.formatCurrency(result.finalAmount);
        document.getElementById('totalInvestedQuick').textContent = this.formatCurrency(result.totalInvested);
        document.getElementById('totalGainsQuick').textContent = this.formatCurrency(result.totalGains);
        document.getElementById('roiQuick').textContent = result.roi.toFixed(1) + '%';

        // Generate and display insights
        const insights = this.generateInsights(result);
        document.getElementById('insightsText').innerHTML = insights;
    }

    generateInsights(result) {
        let insights = '';
        const monthly = parseFloat(this.monthlyContribution.value) || 0;
        const initial = parseFloat(this.initialInvestment.value) || 0;
        const annualRate = parseFloat(this.annualReturn.value) || 0;
        const years = parseFloat(this.yearsInvest.value) || 0;

        // Power of compound interest
        const interestPercentage = (result.totalGains / result.totalInvested) * 100;
        
        insights = `<strong>💰 Your Investment Results:</strong> Over ${years.toFixed(1)} years, your ${this.formatCurrency(result.totalInvested)} grows to ${this.formatCurrency(result.finalAmount)}. `;
        
        if (result.totalGains > 0) {
            insights += `Your investments earned ${this.formatCurrency(result.totalGains)} in gains (${interestPercentage.toFixed(1)}% return on invested capital). `;
        }

        // Analyze contribution impact
        if (initial > 0 && monthly > 0) {
            const initialGain = initial * Math.pow(1 + annualRate/100/12, years * 12) - initial;
            const contributionPercentage = (monthly * years * 12 / result.totalInvested) * 100;
            insights += `Your regular ${this.formatCurrency(monthly)}/month contributions make up ${contributionPercentage.toFixed(0)}% of total invested capital and significantly boost your final amount. `;
        } else if (monthly > 0) {
            insights += `Your consistent ${this.formatCurrency(monthly)}/month contributions demonstrate the power of regular investing—this disciplined approach compounds significantly over time. `;
        } else if (initial > 0) {
            insights += `You're relying on one-time investment growth. Consider adding monthly contributions—even small ones grow exponentially with compound interest. `;
        }

        // ROI analysis
        if (result.roi > 200) {
            insights += `🚀 <strong>Exceptional ROI of ${result.roi.toFixed(1)}%!</strong> Your money tripled or more. This is the power of compound interest over a long period with strong returns. `;
        } else if (result.roi > 100) {
            insights += `📈 <strong>Strong ROI of ${result.roi.toFixed(1)}%.</strong> You've more than doubled your investment through compound growth. Consider keeping these funds invested to unlock even more gains. `;
        } else if (result.roi > 0) {
            insights += `📊 <strong>Solid ROI of ${result.roi.toFixed(1)}%.</strong> Your investments are growing steadily. Longer timelines and higher return rates unlock exponential growth potential. `;
        }

        // Time impact analysis
        if (years >= 20) {
            insights += `⏱️ <strong>Time is Your Secret Weapon:</strong> Your ${years.toFixed(1)}-year investment horizon is ideal for compounding. This timeline maximizes the exponential growth effect. `;
        } else if (years >= 10) {
            insights += `⏱️ <strong>Good Investment Horizon:</strong> ${years.toFixed(1)} years allows meaningful compounding. If possible, consider extending to 20+ years for exponential gains. `;
        } else {
            insights += `⏱️ <strong>Short Timeline:</strong> You're investing for ${years.toFixed(1)} years. While this builds wealth, compound interest accelerates dramatically after year 10. `;
        }

        // Action recommendations
        insights += `<br><strong>💡 Smart Next Steps:</strong> `;
        
        if (annualRate < 6) {
            insights += `Your expected return of ${annualRate}% is conservative. A balanced portfolio typically returns 6-8%, so consider diversifying. `;
        }
        
        if (years < 5) {
            insights += `If possible, extend your timeline to 10+ years to unlock exponential growth potential. `;
        }
        
        if (monthly < 500) {
            insights += `Increasing monthly contributions by even $100 can significantly boost your final amount over time. `;
        }

        insights += `Keep investing consistently and let compound interest work for you!`;

        return insights;
    }

    renderGrowthChart(monthlyData) {
        this.growthChartContainer.style.display = 'block';
        this.growthChart.innerHTML = '';

        if (monthlyData.length === 0) return;

        const validData = monthlyData.filter(d => !d.isSeparator);
        const maxAmount = Math.max(...validData.map(d => d.balance)) || 1;

        monthlyData.forEach((data, index) => {
            if (data.isSeparator) {
                const sep = document.createElement('div');
                sep.className = 'chart-separator';
                sep.textContent = 'Annual Summaries';
                this.growthChart.appendChild(sep);
                return;
            }

            const investedPercent = (data.invested / maxAmount) * 100;
            const gainsPercent = (data.gains / maxAmount) * 100;

            const row = document.createElement('div');
            row.className = data.isYearlySum ? 'chart-row yearly-summary' : 'chart-row';

            row.innerHTML = `
                <div class="chart-year">${data.label}</div>
                <div class="chart-bars-container">
                    <div class="chart-bar-invested" style="width: ${investedPercent}%; background: var(--accent-color);">${data.invested > 0 ? '$' + (data.invested / 1000).toFixed(0) + 'k' : ''}</div>
                    <div class="chart-bar-gains" style="width: ${gainsPercent}%; background: var(--success-color);">${data.gains > 0 ? '+$' + (data.gains / 1000).toFixed(0) + 'k' : ''}</div>
                </div>
                <div class="chart-amount">${this.formatCurrency(data.balance)}</div>
            `;
            this.growthChart.appendChild(row);
        });
    }

    renderBreakdown(totalInvested, totalGains, finalAmount) {
        this.breakdownContainer.style.display = 'block';
        this.breakdownChart.innerHTML = '';

        const investedPercent = (totalInvested / finalAmount) * 100;
        const gainsPercent = (totalGains / finalAmount) * 100;

        const items = [
            {
                label: `Invested (${investedPercent.toFixed(1)}%)`,
                value: totalInvested,
                className: 'invested'
            },
            {
                label: `Investment Gains (${gainsPercent.toFixed(1)}%)`,
                value: totalGains,
                className: 'gains'
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

    renderYearlyTable(monthlyData) {
        this.yearlyTableContainer.style.display = 'block';

        // Find max balance for scaling the bars
        const validData = monthlyData.filter(d => !d.isSeparator);
        const maxBalance = Math.max(...validData.map(d => d.balance)) || 1;

        let html = '<table class="schedule-table-inner">';
        html += `
            <thead>
                <tr>
                    <th>Period</th>
                    <th colspan="2">Growth Visualization</th>
                    <th>Total Invested</th>
                    <th>Gains</th>
                    <th>Total Balance</th>
                </tr>
            </thead>
            <tbody>`;

        monthlyData.forEach((data) => {
            if (data.isSeparator) {
                html += `<tr class="schedule-separator">
                    <td colspan="6" style="text-align: center; font-weight: 600; padding: 0.5rem; color: var(--text-light);">Annual Summaries</td>
                </tr>`;
            } else if (data.isYearlySum) {
                const investedPercent = (data.invested / maxBalance) * 100;
                const gainsPercent = (data.gains / maxBalance) * 100;
                html += `<tr class="yearly-summary">
                    <td>${data.label}</td>
                    <td colspan="2" style="padding: 0.5rem;">
                        <div style="display: flex; gap: 2px; height: 24px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${investedPercent}%; background: var(--accent-color);"></div>
                            <div style="width: ${gainsPercent}%; background: var(--success-color);"></div>
                        </div>
                    </td>
                    <td>${this.formatCurrency(data.invested)}</td>
                    <td>${this.formatCurrency(data.gains)}</td>
                    <td>${this.formatCurrency(data.balance)}</td>
                </tr>`;
            } else {
                const investedPercent = (data.invested / maxBalance) * 100;
                const gainsPercent = (data.gains / maxBalance) * 100;
                html += `<tr>
                    <td>${data.label}</td>
                    <td colspan="2" style="padding: 0.5rem;">
                        <div style="display: flex; gap: 2px; height: 20px; background: var(--border-color); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${investedPercent}%; background: var(--accent-color);"></div>
                            <div style="width: ${gainsPercent}%; background: var(--success-color);"></div>
                        </div>
                    </td>
                    <td>${this.formatCurrency(data.invested)}</td>
                    <td>${this.formatCurrency(data.gains)}</td>
                    <td>${this.formatCurrency(data.balance)}</td>
                </tr>`;
            }
        });

        html += '</tbody></table>';
        this.yearlyTable.innerHTML = html;
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
        this.initialInvestment.value = '';
        this.monthlyContribution.value = '';
        this.annualReturn.value = '8';
        this.yearsInvest.value = '';

        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';

        // Clear quick summary
        document.getElementById('finalAmountQuick').textContent = '$0.00';
        document.getElementById('totalInvestedQuick').textContent = '$0.00';
        document.getElementById('totalGainsQuick').textContent = '$0.00';
        document.getElementById('roiQuick').textContent = '0%';

        this.yearlyTableContainer.style.display = 'none';
        this.clearError();

        SharedUtilities.showNotification('Cleared all values', 'info');
    }

    download() {
        try {
            const initial = parseFloat(this.initialInvestment.value) || 0;
            const monthly = parseFloat(this.monthlyContribution.value) || 0;
            const rate = parseFloat(this.annualReturn.value) || 0;
            const years = parseFloat(this.yearsInvest.value) || 0;

            const data = `Investment Return Calculator Results
====================================

Input Parameters:
- Initial Investment: ${this.formatCurrency(initial)}
- Monthly Contribution: ${this.formatCurrency(monthly)}
- Expected Annual Return: ${rate}%
- Investment Period: ${years} years

Results:
- Final Amount: ${this.finalAmountResult.textContent}
- Total Invested: ${this.totalInvestedResult.textContent}
- Total Gains: ${this.totalGainsResult.textContent}
- Return on Investment (ROI): ${this.roiResult.textContent}

Generated on: ${new Date().toLocaleString()}
`;

            SharedUtilities.downloadFile(data, 'investment-return-results.txt');
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
    const calc = new InvestmentReturnCalculator();
    // Trigger initial calculation with default values
    setTimeout(() => calc.calculate(false), 100);
});
