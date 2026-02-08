class UnitPriceCalculator {
    constructor() {
        this.totalPrice = document.getElementById('totalPrice');
        this.quantity = document.getElementById('quantity');
        this.unitPreset = document.getElementById('unitPreset');
        this.customUnit = document.getElementById('customUnit');
        this.customUnitGroup = document.getElementById('customUnitGroup');
        this.unitPrice = document.getElementById('unitPrice');
        this.unitDisplay = document.getElementById('unitDisplay');
        this.comparePrice = document.getElementById('comparePrice');
        this.compareQuantity = document.getElementById('compareQuantity');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.comparisonResults = document.getElementById('comparisonResults');
        this.product1UnitPrice = document.getElementById('product1UnitPrice');
        this.product2UnitPrice = document.getElementById('product2UnitPrice');
        this.bestValue = document.getElementById('bestValue');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.totalPrice.addEventListener('input', () => this.calculate());
        this.quantity.addEventListener('input', () => this.calculate());
        this.unitPreset.addEventListener('change', () => this.updateUnitDisplay());
        this.customUnit.addEventListener('input', () => this.calculate());
        this.comparePrice.addEventListener('input', () => this.updateComparison());
        this.compareQuantity.addEventListener('input', () => this.updateComparison());
        this.calculateBtn.addEventListener('click', () => this.updateComparison());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    updateUnitDisplay() {
        if (this.unitPreset.value === 'custom') {
            this.customUnitGroup.style.display = 'block';
            this.customUnit.focus();
        } else {
            this.customUnitGroup.style.display = 'none';
            this.customUnit.value = '';
        }
        this.calculate();
    }

    getUnitLabel() {
        if (this.unitPreset.value === 'custom') {
            return this.customUnit.value || 'unit';
        }
        return this.unitPreset.value;
    }

    calculate() {
        const price = parseFloat(this.totalPrice.value);
        const qty = parseFloat(this.quantity.value);
        const unitLabel = this.getUnitLabel();

        if (isNaN(price) || isNaN(qty) || qty === 0) {
            this.unitPrice.textContent = '$0.00';
            this.unitDisplay.textContent = unitLabel || 'unit';
            return;
        }

        const unitPriceVal = price / qty;
        this.unitPrice.textContent = '$' + unitPriceVal.toFixed(2);
        this.unitDisplay.textContent = unitLabel || 'unit';
    }

    updateComparison() {
        const price1 = parseFloat(this.totalPrice.value);
        const qty1 = parseFloat(this.quantity.value);
        const price2 = parseFloat(this.comparePrice.value);
        const qty2 = parseFloat(this.compareQuantity.value);

        if (isNaN(price1) || isNaN(qty1) || isNaN(price2) || isNaN(qty2) || qty1 === 0 || qty2 === 0) {
            this.comparisonResults.style.display = 'none';
            return;
        }

        const unitPrice1 = price1 / qty1;
        const unitPrice2 = price2 / qty2;

        this.product1UnitPrice.textContent = '$' + unitPrice1.toFixed(2);
        this.product2UnitPrice.textContent = '$' + unitPrice2.toFixed(2);

        if (unitPrice1 < unitPrice2) {
            this.bestValue.textContent = 'Product 1 ✓';
        } else if (unitPrice2 < unitPrice1) {
            this.bestValue.textContent = 'Product 2 ✓';
        } else {
            this.bestValue.textContent = 'Same Price';
        }

        this.comparisonResults.style.display = 'block';
    }

    copy() {
        const text = `Unit Price: ${this.unitPrice.textContent} per ${this.unitDisplay.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.totalPrice.value = '';
        this.quantity.value = '';
        this.unitPreset.value = 'custom';
        this.customUnit.value = '';
        this.customUnitGroup.style.display = 'none';
        this.comparePrice.value = '';
        this.compareQuantity.value = '';
        this.unitPrice.textContent = '$0.00';
        this.unitDisplay.textContent = 'unit';
        this.comparisonResults.style.display = 'none';
        this.totalPrice.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UnitPriceCalculator();
});
