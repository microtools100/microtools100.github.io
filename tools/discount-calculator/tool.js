class DiscountCalculator {
    constructor() {
        this.originalPrice = document.getElementById('originalPrice');
        this.discountValue = document.getElementById('discountValue');
        this.discountUnit = document.getElementById('discountUnit');
        this.secondDiscount = document.getElementById('secondDiscount');
        this.discountAmount = document.getElementById('discountAmount');
        this.finalPrice = document.getElementById('finalPrice');
        this.savings = document.getElementById('savings');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.originalPrice.addEventListener('input', () => this.calculate());
        this.discountValue.addEventListener('input', () => this.calculate());
        this.secondDiscount.addEventListener('input', () => this.calculate());
        
        document.querySelectorAll('input[name="discountType"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.discountUnit.textContent = radio.value === 'percentage' ? '%' : '$';
                this.calculate();
            });
        });
        
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    calculate() {
        const price = parseFloat(this.originalPrice.value);
        const discount = parseFloat(this.discountValue.value);
        const secondDisc = parseFloat(this.secondDiscount.value) || 0;
        const discountType = document.querySelector('input[name="discountType"]:checked').value;

        if (isNaN(price) || isNaN(discount) || price === 0) {
            this.discountAmount.textContent = '$0.00';
            this.finalPrice.textContent = '$0.00';
            this.savings.textContent = '$0.00';
            return;
        }

        let finalPrice = price;
        let totalSavings = 0;

        // First discount
        if (discountType === 'percentage') {
            const discountAmt = price * (discount / 100);
            finalPrice -= discountAmt;
            totalSavings += discountAmt;
        } else {
            finalPrice -= discount;
            totalSavings += discount;
        }

        // Second discount (always percentage, applied to discounted price)
        if (secondDisc > 0) {
            const secondDiscAmt = finalPrice * (secondDisc / 100);
            finalPrice -= secondDiscAmt;
            totalSavings += secondDiscAmt;
        }

        this.discountAmount.textContent = '$' + totalSavings.toFixed(2);
        this.finalPrice.textContent = '$' + Math.max(0, finalPrice).toFixed(2);
        this.savings.textContent = '$' + totalSavings.toFixed(2);
    }

    copy() {
        const text = `Original: ${this.originalPrice.value}\nDiscount: ${this.discountAmount.textContent}\nFinal Price: ${this.finalPrice.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.originalPrice.value = '';
        this.discountValue.value = '';
        this.secondDiscount.value = '';
        this.discountAmount.textContent = '$0.00';
        this.finalPrice.textContent = '$0.00';
        this.savings.textContent = '$0.00';
        document.querySelector('input[name="discountType"][value="percentage"]').checked = true;
        this.discountUnit.textContent = '%';
        this.originalPrice.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DiscountCalculator();
});
