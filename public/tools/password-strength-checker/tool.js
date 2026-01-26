// Password Strength Checker Tool - Production Ready

class PasswordStrengthChecker {
    constructor() {
        this.passwordInput = document.getElementById('passwordInput');
        this.toggleBtn = document.getElementById('toggleVisibility');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthLabel = document.getElementById('strengthLabel');
        this.lengthStat = document.getElementById('lengthStat');
        this.scoreStat = document.getElementById('scoreStat');
        this.timeStat = document.getElementById('timeStat');
        this.entropyStat = document.getElementById('entropyStat');
        this.recommendationsContainer = document.getElementById('recommendationsContainer');
        this.recommendationsList = document.getElementById('recommendationsList');
        
        this.commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123', '12345678', 
                                'letmein', 'welcome', 'monkey', 'dragon', 'master', 'admin', 'iloveyou'];
        
        this.init();
    }

    init() {
        this.passwordInput.addEventListener('input', () => this.analyzePassword());
        this.toggleBtn.addEventListener('click', () => this.togglePasswordVisibility());
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.toggleBtn.textContent = isPassword ? '👁️‍🗨️' : '👁️';
    }

    analyzePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.resetDisplay();
            return;
        }

        const analysis = this.getPasswordAnalysis(password);
        this.updateDisplay(analysis);
    }

    getPasswordAnalysis(password) {
        const analysis = {
            length: password.length,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            isCommon: this.isCommonPassword(password),
            entropy: this.calculateEntropy(password),
        };

        analysis.score = this.calculateStrengthScore(analysis);
        analysis.strength = this.getStrengthLevel(analysis.score);
        analysis.crackTime = this.estimateCrackTime(analysis);
        analysis.recommendations = this.generateRecommendations(analysis);

        return analysis;
    }

    isCommonPassword(password) {
        return this.commonPasswords.includes(password.toLowerCase());
    }

    calculateEntropy(password) {
        let charSpace = 0;
        if (/[a-z]/.test(password)) charSpace += 26;
        if (/[A-Z]/.test(password)) charSpace += 26;
        if (/\d/.test(password)) charSpace += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charSpace += 32;

        const entropy = password.length * Math.log2(charSpace);
        return Math.round(entropy);
    }

    calculateStrengthScore(analysis) {
        let score = 0;
        
        // Length scoring
        if (analysis.length >= 8) score += 10;
        if (analysis.length >= 12) score += 10;
        if (analysis.length >= 16) score += 10;
        if (analysis.length >= 20) score += 10;

        // Character type scoring
        if (analysis.hasLowercase) score += 10;
        if (analysis.hasUppercase) score += 10;
        if (analysis.hasNumbers) score += 10;
        if (analysis.hasSpecial) score += 15;

        // Deductions
        if (analysis.isCommon) score -= 30;
        if (/(.)\1{2,}/.test(this.passwordInput.value)) score -= 10;

        return Math.max(0, Math.min(100, score));
    }

    getStrengthLevel(score) {
        if (score < 20) return { level: 'Very Weak', class: 'very-weak', color: '#ef4444' };
        if (score < 40) return { level: 'Weak', class: 'weak', color: '#f97316' };
        if (score < 60) return { level: 'Fair', class: 'fair', color: '#f59e0b' };
        if (score < 75) return { level: 'Good', class: 'good', color: '#3b82f6' };
        if (score < 90) return { level: 'Strong', class: 'strong', color: '#10b981' };
        return { level: 'Very Strong', class: 'very-strong', color: '#059669' };
    }

    estimateCrackTime(analysis) {
        const entropy = analysis.entropy;
        // Guesses per second = 10^9 (1 billion - modern cracking speed)
        const guessesPerSecond = 1e9;
        const totalGuesses = Math.pow(2, entropy);
        const seconds = totalGuesses / (guessesPerSecond * 2); // Average is half the total

        if (seconds < 1) return 'Less than a second';
        if (seconds < 60) return 'Less than a minute';
        if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
        if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
        if (seconds < 2592000) return Math.round(seconds / 86400) + ' days';
        if (seconds < 31536000) return Math.round(seconds / 2592000) + ' months';
        return Math.round(seconds / 31536000) + ' years';
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.length < 12) {
            recommendations.push('Add more characters (aim for 12+)');
        }
        if (!analysis.hasUppercase) {
            recommendations.push('Add uppercase letters (A-Z)');
        }
        if (!analysis.hasNumbers) {
            recommendations.push('Add numbers (0-9)');
        }
        if (!analysis.hasSpecial) {
            recommendations.push('Add special characters (!@#$%^&*)');
        }
        if (analysis.isCommon) {
            recommendations.push('Avoid common passwords');
        }
        if (/(.)\1{2,}/.test(this.passwordInput.value)) {
            recommendations.push('Avoid repeating characters (aaa, 111)');
        }

        return recommendations;
    }

    updateDisplay(analysis) {
        // Update meter
        this.strengthBar.className = 'strength-bar ' + analysis.strength.class;
        
        // Update label
        this.strengthLabel.className = 'strength-label ' + analysis.strength.class;
        this.strengthLabel.textContent = `${analysis.strength.level} (${analysis.score}/100)`;

        // Update stats
        this.lengthStat.textContent = analysis.length;
        this.scoreStat.textContent = `${analysis.score}/100`;
        this.timeStat.textContent = analysis.crackTime;
        this.entropyStat.textContent = `${analysis.entropy} bits`;

        // Update criteria
        this.updateCriteria(analysis);

        // Update recommendations
        if (analysis.recommendations.length > 0) {
            this.recommendationsList.innerHTML = analysis.recommendations
                .map(rec => `<li>${rec}</li>`)
                .join('');
            this.recommendationsContainer.style.display = 'block';
        } else {
            this.recommendationsContainer.style.display = 'none';
        }
    }

    updateCriteria(analysis) {
        const criteria = [
            { id: 'crit-length', met: analysis.length >= 8 },
            { id: 'crit-lowercase', met: analysis.hasLowercase },
            { id: 'crit-uppercase', met: analysis.hasUppercase },
            { id: 'crit-numbers', met: analysis.hasNumbers },
            { id: 'crit-special', met: analysis.hasSpecial },
            { id: 'crit-nocommon', met: !analysis.isCommon },
        ];

        criteria.forEach(criterion => {
            const element = document.getElementById(criterion.id);
            if (element) {
                if (criterion.met) {
                    element.classList.add('met');
                } else {
                    element.classList.remove('met');
                }
            }
        });
    }

    resetDisplay() {
        this.strengthBar.className = 'strength-bar';
        this.strengthLabel.textContent = 'Enter a password to check strength';
        this.strengthLabel.className = 'strength-label';
        this.lengthStat.textContent = '0';
        this.scoreStat.textContent = '0/100';
        this.timeStat.textContent = 'Instant';
        this.entropyStat.textContent = '0 bits';
        this.recommendationsContainer.style.display = 'none';
        
        // Reset criteria
        document.querySelectorAll('.criterion-icon').forEach(el => {
            el.classList.remove('met');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.passwordStrengthChecker = new PasswordStrengthChecker();
});
