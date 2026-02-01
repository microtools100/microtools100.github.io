/**
 * Fake Data Generator Tool
 * Generate fake names, emails, phone numbers, addresses, usernames, and birth dates
 */

class FakeDataGenerator {
    constructor() {
        this.typeSelect = document.getElementById('dataTypeSelect');
        this.countInput = document.getElementById('quantityInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.output = document.getElementById('outputText');
        this.errorMsg = document.getElementById('errorMsg');

        this.firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica', 'Robert', 'Linda', 'William', 'Karen', 'Richard', 'Patricia', 'Joseph', 'Barbara', 'Thomas', 'Susan', 'Charles', 'Lisa'];
        this.lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
        this.domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'test.com', 'mail.com', 'email.com'];
        this.streets = ['Main', 'Oak', 'Elm', 'Maple', 'Pine', 'Cedar', 'Birch', 'Walnut', 'Cherry', 'Spruce'];
        this.cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Boston', 'Nashville'];
        this.states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];

        this.init();
    }

    /**
     * Initialize event listeners
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.generate());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.generate();
            }
        });
    }

    /**
     * Clear error message
     */
    clearError() {
        if (this.errorMsg) {
            this.errorMsg.classList.remove('show');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.classList.add('show');
        }
    }

    /**
     * Generate fake data
     */
    generate() {
        const type = this.typeSelect.value;
        const count = Math.min(1000, Math.max(1, parseInt(this.countInput.value) || 1));

        try {
            let data = [];
            for (let i = 0; i < count; i++) {
                if (type === 'names') data.push(this.generateName());
                else if (type === 'emails') data.push(this.generateEmail());
                else if (type === 'phones') data.push(this.generatePhone());
                else if (type === 'addresses') data.push(this.generateAddress());
                else if (type === 'usernames') data.push(this.generateUsername());
                else if (type === 'dates') data.push(this.generateDate());
            }

            this.output.value = data.join('\n');
            this.clearError();
            SharedUtilities.showNotification(`Generated ${count} ${type}!`, 'success');
            this.copyBtn.disabled = false;
        } catch (error) {
            this.showError(`Error generating data: ${error.message}`);
            SharedUtilities.showNotification('Error generating data', 'error');
        }
    }

    /**
     * Generate a random full name
     */
    generateName() {
        const first = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
        const last = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
        return `${first} ${last}`;
    }

    /**
     * Generate a random email address
     */
    generateEmail() {
        const name = this.generateName().toLowerCase().replace(' ', '.');
        const domain = this.domains[Math.floor(Math.random() * this.domains.length)];
        return `${name}${Math.floor(Math.random() * 999)}@${domain}`;
    }

    /**
     * Generate a random phone number
     */
    generatePhone() {
        const areaCode = Math.floor(Math.random() * 900) + 100;
        const exchange = Math.floor(Math.random() * 900) + 100;
        const number = Math.floor(Math.random() * 9000) + 1000;
        return `+1-${areaCode}-${exchange}-${number}`;
    }

    /**
     * Generate a random address
     */
    generateAddress() {
        const street = this.streets[Math.floor(Math.random() * this.streets.length)];
        const num = Math.floor(Math.random() * 9999) + 1;
        const city = this.cities[Math.floor(Math.random() * this.cities.length)];
        const state = this.states[Math.floor(Math.random() * this.states.length)];
        const zip = Math.floor(Math.random() * 90000) + 10000;
        return `${num} ${street} St, ${city}, ${state} ${zip}`;
    }

    /**
     * Generate a random username
     */
    generateUsername() {
        const adjectives = ['Cool', 'Quick', 'Smart', 'Bright', 'Swift', 'Clever', 'Happy', 'Lucky'];
        const nouns = ['Tiger', 'Eagle', 'Fox', 'Wolf', 'Bear', 'Lion', 'Hawk', 'Snake'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(Math.random() * 999);
        return `${adj}${noun}${num}`;
    }

    /**
     * Generate a random birth date
     */
    generateDate() {
        const start = new Date(1950, 0, 1);
        const end = new Date(2010, 0, 1);
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
    }

    /**
     * Copy output to clipboard
     */
    copyToClipboard() {
        if (!this.output.value) {
            SharedUtilities.showNotification('No data to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.output.value).then(() => {
            SharedUtilities.showNotification('Data copied to clipboard!', 'success');
        }).catch(() => {
            SharedUtilities.showNotification('Failed to copy data', 'error');
        });
    }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.fakeDataGenerator = new FakeDataGenerator();
});
