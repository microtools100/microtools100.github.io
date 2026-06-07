// Password Generator Tool
class PasswordGenerator {
    constructor() {
        this.characters = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        this.similarChars = 'il1Lo0O';
        this.ambiguousChars = '{}[]()/\'"`~,;:.<>';

        this.presets = {
            wifi: { length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false },
            email: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
            bank: { length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true },
            memorable: { length: 14, uppercase: true, lowercase: true, numbers: true, symbols: false }
        };

        this.elements = {
            // Settings
            length: document.getElementById('length'),
            lengthValue: document.getElementById('lengthValue'),
            count: document.getElementById('count'),
            
            // Character types
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            numbers: document.getElementById('numbers'),
            symbols: document.getElementById('symbols'),
            
            // Advanced options
            excludeSimilar: document.getElementById('excludeSimilar'),
            excludeAmbiguous: document.getElementById('excludeAmbiguous'),
            requireEach: document.getElementById('requireEach'),
            avoidDuplicates: document.getElementById('avoidDuplicates'),
            toggleAdvanced: document.getElementById('toggleAdvanced'),
            advancedOptions: document.getElementById('advancedOptions'),
            
            // Buttons
            generateBtn: document.getElementById('generateBtn'),
            clearBtn: document.getElementById('clearBtn'),
            presetBtn: document.getElementById('presetBtn'),
            copyAllBtn: document.getElementById('copyAllBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            
            // Output
            passwordsOutput: document.getElementById('passwordsOutput'),
            strengthScore: document.getElementById('strengthScore'),
            entropyBits: document.getElementById('entropyBits'),
            crackTime: document.getElementById('crackTime'),
            errorMsg: document.querySelector('.error-msg')
        };

        this.generatedPasswords = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupQuickPresets();
        this.updateLengthValue();
        this.setupKeyboardShortcuts();
        
        // Generate initial passwords
        this.generatePasswords();
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.elements.errorMsg) {
            this.elements.errorMsg.textContent = message;
            this.elements.errorMsg.classList.add('show');
            setTimeout(() => {
                this.elements.errorMsg.classList.remove('show');
            }, 4000);
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter or Cmd+Enter to generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.generatePasswords();
            }
            // Ctrl+C is handled by copyPassword
        });
    }

    setupEventListeners() {
        // Generate button
        this.elements.generateBtn.addEventListener('click', () => this.generatePasswords());
        
        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        
        // Preset button
        this.elements.presetBtn.addEventListener('click', () => this.showPresetMenu());
        
        // Copy all button
        this.elements.copyAllBtn.addEventListener('click', () => this.copyAllPasswords());
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.downloadPasswords());
        
        // Refresh button
        this.elements.refreshBtn.addEventListener('click', () => this.refreshAllPasswords());
        
        // Advanced options toggle
        this.elements.toggleAdvanced.addEventListener('click', () => {
            this.elements.advancedOptions.classList.toggle('hidden');
        });
        
        // Length slider
        this.elements.length.addEventListener('input', () => {
            this.updateLengthValue();
            this.generatePasswords();
        });
        
        // Character type changes

        const charTypes = [this.elements.uppercase, this.elements.lowercase, 
                          this.elements.numbers, this.elements.symbols];
        charTypes.forEach(type => {
            type.addEventListener('change', () => {
                this.validateCharacterTypes();
                this.generatePasswords();
            });
        });
    }

    setupQuickPresets() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
                this.generatePasswords();
            });
        });
    }

    updateLengthValue() {

        this.elements.lengthValue.textContent = this.elements.length.value;
    }

    validateCharacterTypes() {
        const types = [
            this.elements.uppercase.checked,
            this.elements.lowercase.checked,
            this.elements.numbers.checked,
            this.elements.symbols.checked
        ];
        
        if (!types.some(type => type)) {
            // If no types selected, enable lowercase as default
            this.elements.lowercase.checked = true;
            SharedUtilities.showNotification('At least one character type must be selected', 'warning');
        }
    }

    applyPreset(preset) {

        const settings = this.presets[preset];
        if (!settings) return;
        
        this.elements.length.value = settings.length;
        this.elements.uppercase.checked = settings.uppercase;
        this.elements.lowercase.checked = settings.lowercase;
        this.elements.numbers.checked = settings.numbers;
        this.elements.symbols.checked = settings.symbols;
        
        this.updateLengthValue();
        SharedUtilities.showNotification(`${preset.charAt(0).toUpperCase() + preset.slice(1)} preset applied`, 'success');
    }

    showPresetMenu() {
        const menu = document.createElement('div');
        menu.className = 'preset-menu';
        menu.innerHTML = `
            <div class="preset-menu-content">
                <h4>Common Presets</h4>
                <ul>
                    <li><button data-preset="wifi">📶 WiFi Password (12 chars, no symbols)</button></li>
                    <li><button data-preset="email">📧 Email Password (16 chars, all types)</button></li>
                    <li><button data-preset="bank">🏦 Banking Password (20 chars, maximum security)</button></li>
                    <li><button data-preset="memorable">🧠 Memorable Password (14 chars, letters & numbers)</button></li>
                </ul>
            </div>
        `;
        
        // Style the menu
        const style = document.createElement('style');
        style.textContent = `
            .preset-menu {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .preset-menu-content {
                background: white;
                border-radius: var(--radius-lg);
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                box-shadow: var(--shadow-lg);
            }
            .preset-menu-content h4 {
                margin-bottom: 1rem;
                color: var(--primary-color);
            }
            .preset-menu-content ul {
                list-style: none;
            }
            .preset-menu-content li {
                margin-bottom: 0.5rem;
            }
            .preset-menu-content button {
                width: 100%;
                padding: 1rem;
                text-align: left;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: var(--transition);
            }
            .preset-menu-content button:hover {
                background: #e2e8f0;
                border-color: var(--primary-color);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(menu);
        
        // Add event listeners to preset buttons
        menu.querySelectorAll('button[data-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
                this.generatePasswords();
                document.body.removeChild(menu);
                document.head.removeChild(style);
            });
        });
        
        // Close menu when clicking outside
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                document.body.removeChild(menu);
                document.head.removeChild(style);
            }
        });
        
        // Close on escape key
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(menu);
                document.head.removeChild(style);
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);
    }

    generatePasswords() {
        this.validateCharacterTypes();
        
        const count = parseInt(this.elements.count.value);
        const length = parseInt(this.elements.length.value);
        
        const passwords = [];
        for (let i = 0; i < count; i++) {
            const password = this.generateSinglePassword(length);
            passwords.push({
                value: password,
                strength: this.calculatePasswordStrength(password),
                entropy: this.calculateEntropy(password)
            });
        }
        
        this.generatedPasswords = passwords;
        this.displayPasswords(passwords);
        this.updateStats(passwords);
        
        SharedUtilities.showNotification(`Generated ${count} passwords`, 'success');
    }

    generateSinglePassword(length) {
        let charset = '';
        
        // Build charset based on selected character types
        if (this.elements.uppercase.checked) {
            charset += this.characters.uppercase;
        }
        if (this.elements.lowercase.checked) {
            charset += this.characters.lowercase;
        }
        if (this.elements.numbers.checked) {
            charset += this.characters.numbers;
        }
        if (this.elements.symbols.checked) {
            charset += this.characters.symbols;
        }
        
        // Remove similar characters if enabled
        if (this.elements.excludeSimilar.checked) {
            charset = charset.split('').filter(char => !this.similarChars.includes(char)).join('');
        }
        
        // Remove ambiguous characters if enabled
        if (this.elements.excludeAmbiguous.checked) {
            charset = charset.split('').filter(char => !this.ambiguousChars.includes(char)).join('');
        }
        
        if (charset.length === 0) {
            SharedUtilities.showNotification('No valid characters available. Please select character types.', 'error');
            return 'ERROR: No charset';
        }
        
        let password = '';
        const usedChars = new Set();
        
        // Generate password with requirements
        for (let i = 0; i < length; i++) {
            let char;
            let attempts = 0;
            const maxAttempts = 100;
            
            do {
                char = charset[Math.floor(Math.random() * charset.length)];
                attempts++;
                
                // Break if we can't find a non-duplicate character
                if (attempts >= maxAttempts) {
                    break;
                }
            } while (this.elements.avoidDuplicates.checked && usedChars.has(char));
            
            password += char;
            usedChars.add(char);
        }
        
        // Ensure at least one of each required type
        if (this.elements.requireEach.checked) {
            password = this.ensureCharacterTypes(password, charset);
        }
        
        return password;
    }

    ensureCharacterTypes(password, charset) {
        const hasUppercase = this.elements.uppercase.checked && 
                           /[A-Z]/.test(password);
        const hasLowercase = this.elements.lowercase.checked && 
                           /[a-z]/.test(password);
        const hasNumbers = this.elements.numbers.checked && 
                         /[0-9]/.test(password);
        const hasSymbols = this.elements.symbols.checked && 
                         /[^A-Za-z0-9]/.test(password);
        
        const missingTypes = [];
        if (this.elements.uppercase.checked && !hasUppercase) missingTypes.push('uppercase');
        if (this.elements.lowercase.checked && !hasLowercase) missingTypes.push('lowercase');
        if (this.elements.numbers.checked && !hasNumbers) missingTypes.push('numbers');
        if (this.elements.symbols.checked && !hasSymbols) missingTypes.push('symbols');
        
        if (missingTypes.length === 0) return password;
        
        // Replace random positions with required characters
        const passwordArray = password.split('');
        
        missingTypes.forEach(type => {
            let replacementChar;
            switch(type) {
                case 'uppercase':
                    replacementChar = this.characters.uppercase[Math.floor(Math.random() * this.characters.uppercase.length)];
                    break;
                case 'lowercase':
                    replacementChar = this.characters.lowercase[Math.floor(Math.random() * this.characters.lowercase.length)];
                    break;
                case 'numbers':
                    replacementChar = this.characters.numbers[Math.floor(Math.random() * this.characters.numbers.length)];
                    break;
                case 'symbols':
                    replacementChar = this.characters.symbols[Math.floor(Math.random() * this.characters.symbols.length)];
                    break;
            }
            
            // Replace a random position (not already containing the required type)
            let position;
            do {
                position = Math.floor(Math.random() * password.length);
            } while (
                (type === 'uppercase' && /[A-Z]/.test(passwordArray[position])) ||
                (type === 'lowercase' && /[a-z]/.test(passwordArray[position])) ||
                (type === 'numbers' && /[0-9]/.test(passwordArray[position])) ||
                (type === 'symbols' && /[^A-Za-z0-9]/.test(passwordArray[position]))
            );
            
            passwordArray[position] = replacementChar;
        });
        
        return passwordArray.join('');
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length score
        if (password.length >= 8) score += 10;
        if (password.length >= 12) score += 15;
        if (password.length >= 16) score += 20;
        if (password.length >= 20) score += 25;
        
        // Character variety score
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;
        
        // Deductions for patterns
        if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
        if (/^[a-z]+$/.test(password)) score -= 15; // All lowercase
        if (/^[A-Z]+$/.test(password)) score -= 15; // All uppercase
        if (/^[0-9]+$/.test(password)) score -= 20; // All numbers
        
        // Common patterns deduction
        const commonPatterns = ['123', 'abc', 'qwerty', 'password', 'admin'];
        if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
            score -= 30;
        }
        
        // Ensure score is between 0 and 100
        return Math.max(0, Math.min(100, score));
    }

    calculateEntropy(password) {
        let charsetSize = 0;
        
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        
        // Count unique symbols in password
        const symbols = password.match(/[^A-Za-z0-9]/g);
        if (symbols) {
            const uniqueSymbols = new Set(symbols);
            charsetSize += uniqueSymbols.size;
        }
        
        // If we couldn't determine charset size, use a conservative estimate
        if (charsetSize === 0) charsetSize = 26;
        
        // Entropy = log2(charsetSize^length)
        return Math.round(password.length * Math.log2(charsetSize));
    }

    estimateCrackTime(entropy) {
        // Assuming 10 billion guesses per second (modern GPU)
        const guessesPerSecond = 1e10;
        const seconds = Math.pow(2, entropy) / guessesPerSecond;
        
        if (seconds < 1) return 'Instant';
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
        return `${Math.round(seconds / 3153600000)} centuries`;
    }

    displayPasswords(passwords) {
        this.elements.passwordsOutput.innerHTML = '';
        
        if (passwords.length === 0) {
            this.elements.passwordsOutput.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔒</div>
                    <h4>No passwords generated yet</h4>
                    <p>Click "Generate Passwords" to create your first secure password!</p>
                </div>
            `;
            return;
        }
        
        const grid = document.createElement('div');
        grid.className = 'password-grid';
        
        passwords.forEach((password, index) => {
            const card = document.createElement('div');
            card.className = 'password-card';
            card.dataset.index = index;
            
            // Determine strength class
            let strengthClass = 'weak';
            if (password.strength >= 80) strengthClass = 'very-strong';
            else if (password.strength >= 60) strengthClass = 'strong';
            else if (password.strength >= 40) strengthClass = 'good';
            else if (password.strength >= 20) strengthClass = 'fair';
            
            card.innerHTML = `
                <div class="password-header">
                    <span class="password-number">Password ${index + 1}</span>
                    <div class="password-actions">
                        <button class="copy-password" title="Copy password">
                            <span>Copy</span>
                        </button>
                        <button class="toggle-mask" title="Show/hide password">
                            <span>Show</span>
                        </button>
                        <button class="refresh-password" title="Regenerate this password">
                            <span>New</span>
                        </button>
                    </div>
                </div>
                <div class="password-value masked">${this.escapeHtml(password.value)}</div>
                <div class="password-stats">
                    <span>Strength: ${password.strength}%</span>
                    <span>Entropy: ${password.entropy} bits</span>
                </div>
                <div class="password-strength-indicator ${strengthClass}"></div>
            `;
            
            // Add event listeners for card buttons
            const copyBtn = card.querySelector('.copy-password');
            const toggleBtn = card.querySelector('.toggle-mask');
            const refreshBtn = card.querySelector('.refresh-password');
            const passwordValue = card.querySelector('.password-value');
            
            copyBtn.addEventListener('click', () => this.copyPassword(password.value, copyBtn));
            toggleBtn.addEventListener('click', () => {
                passwordValue.classList.toggle('masked');
                toggleBtn.innerHTML = passwordValue.classList.contains('masked') ? 
                    '<span>Show</span>' : '<span>Hide</span>';
            });
            refreshBtn.addEventListener('click', () => this.refreshSinglePassword(index));
            
            grid.appendChild(card);
        });
        
        this.elements.passwordsOutput.appendChild(grid);
    }

    updateStats(passwords) {
        if (passwords.length === 0) {
            this.elements.strengthScore.textContent = '0%';
            this.elements.entropyBits.textContent = '0';
            this.elements.crackTime.textContent = 'Instant';
            return;
        }
        
        // Calculate average strength
        const avgStrength = passwords.reduce((sum, p) => sum + p.strength, 0) / passwords.length;
        const avgEntropy = passwords.reduce((sum, p) => sum + p.entropy, 0) / passwords.length;
        
        this.elements.strengthScore.textContent = `${Math.round(avgStrength)}%`;
        this.elements.entropyBits.textContent = Math.round(avgEntropy);
        this.elements.crackTime.textContent = this.estimateCrackTime(avgEntropy);
    }

    async copyPassword(password, button) {
        if (!password) return;
        
        SharedUtilities.copyToClipboard(password, 'Password copied to clipboard', 'success');
    }

    async copyAllPasswords() {
        if (this.generatedPasswords.length === 0) {
            SharedUtilities.showNotification('No passwords to copy', 'warning');
            return;
        }
        
        const text = this.generatedPasswords
            .map((p, i) => `Password ${i + 1}: ${p.value}`)
            .join('\n');
        
        SharedUtilities.copyToClipboard(text, 'All passwords copied to clipboard', 'success');
    }

    downloadPasswords() {
        if (this.generatedPasswords.length === 0) {
            SharedUtilities.showNotification('No passwords to download', 'warning');
            return;
        }
        
        const text = this.generatedPasswords
            .map((p, i) => `Password ${i + 1}: ${p.value}\nStrength: ${p.strength}%\nEntropy: ${p.entropy} bits\n`)
            .join('\n---\n\n');
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'passwords.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        SharedUtilities.showNotification('Passwords downloaded', 'success');
    }

    refreshSinglePassword(index) {
        const length = parseInt(this.elements.length.value);
        const newPassword = this.generateSinglePassword(length);
        
        this.generatedPasswords[index] = {
            value: newPassword,
            strength: this.calculatePasswordStrength(newPassword),
            entropy: this.calculateEntropy(newPassword)
        };
        
        this.displayPasswords(this.generatedPasswords);
        this.updateStats(this.generatedPasswords);
        
        SharedUtilities.showNotification(`Password ${index + 1} refreshed`, 'info');
    }

    refreshAllPasswords() {
        this.generatePasswords();
        SharedUtilities.showNotification('All passwords refreshed', 'info');
    }

    clear() {
        this.generatedPasswords = [];
        this.displayPasswords([]);
        this.updateStats([]);
        SharedUtilities.showNotification('All passwords cleared', 'info');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.passwordGenerator = new PasswordGenerator();
});