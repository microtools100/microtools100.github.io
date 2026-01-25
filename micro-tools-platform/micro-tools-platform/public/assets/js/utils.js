// Utility functions shared across all pages

class MicroToolsUtils {
    constructor() {
        this.init();
    }

    init() {
        this.setCurrentYear();
        this.initMobileMenu();
        this.initCopyButtons();
        this.initTooltips();
    }

    // Set current year in footer
    setCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Mobile menu toggle
    initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        if (menuBtn && mainNav) {
            menuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', 
                    mainNav.classList.contains('active'));
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
                    mainNav.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    mainNav.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Copy text to clipboard
    async copyToClipboard(text, button = null) {
        try {
            await navigator.clipboard.writeText(text);
            
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '✓ Copied!';
                button.classList.add('success');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('success');
                }, 2000);
            }
            
            this.showNotification('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy', 'error');
            return false;
        }
    }

    // Initialize copy buttons
    initCopyButtons() {
        document.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('[data-copy]');
            if (copyBtn) {
                const targetId = copyBtn.getAttribute('data-copy');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const text = targetElement.value || targetElement.textContent;
                    this.copyToClipboard(text, copyBtn);
                }
            }
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 1rem;
                right: 1rem;
                background: white;
                border-left: 4px solid var(--primary-color);
                padding: 1rem;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .notification-success { border-color: var(--success-color); }
            .notification-error { border-color: var(--error-color); }
            .notification-warning { border-color: var(--warning-color); }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-light);
                padding: 0 0.5rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;

        // Add to document
        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Initialize tooltips
    initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = e.target.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                
                // Position tooltip
                const rect = e.target.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 10}px`;
                tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
                
                document.body.appendChild(tooltip);
                
                // Add styles
                if (!document.querySelector('#tooltip-styles')) {
                    const style = document.createElement('style');
                    style.id = 'tooltip-styles';
                    style.textContent = `
                        .tooltip {
                            background: var(--text-color);
                            color: white;
                            padding: 0.5rem 0.75rem;
                            border-radius: var(--radius-sm);
                            font-size: 0.75rem;
                            white-space: nowrap;
                            z-index: 1000;
                            pointer-events: none;
                        }
                        .tooltip::after {
                            content: '';
                            position: absolute;
                            top: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                            border: 4px solid transparent;
                            border-top-color: var(--text-color);
                        }
                    `;
                    document.head.appendChild(style);
                }
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) tooltip.remove();
            });
        });
    }

    // Debounce function for search/resize
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Save to localStorage with expiry
    setWithExpiry(key, value, ttl) {
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    // Get from localStorage with expiry
    getWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Generate random string
    generateRandomString(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    }
}

// Initialize utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.utils = new MicroToolsUtils();
});