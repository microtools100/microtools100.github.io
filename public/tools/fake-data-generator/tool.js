// Fake Data Generator Tool - Production Ready

class FakeDataGenerator {
    constructor() {
        this.typeSelect = document.getElementById('typeSelect');
        this.countInput = document.getElementById('countInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.querySelector('.copy-btn');
        this.output = document.getElementById('output');
        this.errorMsg = document.querySelector('.error-msg');

        this.firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica', 'Robert', 'Linda', 'William', 'Karen', 'Richard', 'Patricia', 'Joseph', 'Barbara', 'Thomas', 'Susan', 'Charles', 'Lisa'];
        this.lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
        this.domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'test.com', 'mail.com', 'email.com'];
        this.streets = ['Main', 'Oak', 'Elm', 'Maple', 'Pine', 'Cedar', 'Birch', 'Walnut', 'Cherry', 'Spruce'];
        this.cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Boston', 'Nashville'];
        this.states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];

        this.init();
    }

    init() {
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.generate());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    generate() {
        const type = this.typeSelect.value;
        const count = Math.min(100, Math.max(1, parseInt(this.countInput.value) || 1));

        try {
            let data = [];
            for (let i = 0; i < count; i++) {
                if (type === 'names') data.push(this.generateName());
                else if (type === 'emails') data.push(this.generateEmail());
                else if (type === 'phones') data.push(this.generatePhone());
                else if (type === 'addresses') data.push(this.generateAddress());
            }

            this.output.value = data.join('\n');
            this.clearError();
            window.MicroTools?.utils?.showNotification?.(`Generated ${count} ${type}!`, 'success');
            this.copyToClipboard();
        } catch (error) {
            this.showError('Error generating data');
        }
    }

    generateName() {
        const first = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
        const last = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
        return `${first} ${last}`;
    }

    generateEmail() {
        const name = this.generateName().toLowerCase().replace(' ', '.');
        const domain = this.domains[Math.floor(Math.random() * this.domains.length)];
        return `${name}${Math.floor(Math.random() * 999)}@${domain}`;
    }

    generatePhone() {
        const areaCode = Math.floor(Math.random() * 900) + 100;
        const exchange = Math.floor(Math.random() * 900) + 100;
        const number = Math.floor(Math.random() * 9000) + 1000;
        return `+1-${areaCode}-${exchange}-${number}`;
    }

    generateAddress() {
        const street = this.streets[Math.floor(Math.random() * this.streets.length)];
        const num = Math.floor(Math.random() * 9999) + 1;
        const city = this.cities[Math.floor(Math.random() * this.cities.length)];
        const state = this.states[Math.floor(Math.random() * this.states.length)];
        const zip = Math.floor(Math.random() * 90000) + 10000;
        return `${num} ${street} St, ${city}, ${state} ${zip}`;
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.style.display = 'block';
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.style.display = 'none';
        }
    }

    copyToClipboard() {
        const text = this.output.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            window.MicroTools?.utils?.showNotification?.('Copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.fakeDataGenerator = new FakeDataGenerator();
});
