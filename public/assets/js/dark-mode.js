/**
 * Dark Mode Toggle
 * Manages dark mode state and persistence
 * This script must run BEFORE page render to prevent white flash
 */

class DarkModeToggle {
    constructor() {
        this.storageKey = 'micro-tools-dark-mode';
        this.darkModeClass = 'dark-mode';
        this.init();
    }

    init() {
        // Check for saved preference or system preference
        const savedMode = localStorage.getItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedMode ? savedMode === 'true' : prefersDark;

        // Apply dark mode immediately before page renders
        if (shouldBeDark) {
            document.documentElement.classList.add(this.darkModeClass);
            console.log('[Dark Mode] Applied dark mode class on init');
        }
        
        // Setup toggle button after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToggleButton());
        } else {
            this.setupToggleButton();
        }

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.disableDarkMode();
                }
            }
        });
    }

    setupToggleButton() {
        const toggle = document.getElementById('darkModeToggle');
        if (!toggle) {
            console.warn('[Dark Mode] Toggle button not found');
            return;
        }

        // Set initial button text and label
        const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
        this.updateToggleButton(isDarkMode);

        // Add click handler with arrow function to preserve 'this' context
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        console.log('[Dark Mode] Toggle button initialized. Current mode:', isDarkMode ? 'dark' : 'light');
    }

    toggle() {
        const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
        console.log('[Dark Mode] Toggle called. Current mode:', isDarkMode ? 'dark' : 'light');
        
        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        console.log('[Dark Mode] Enabling dark mode...');
        
        // Update localStorage
        localStorage.setItem(this.storageKey, 'true');
        
        // Add class to document element
        document.documentElement.classList.add(this.darkModeClass);
        
        // Update button
        this.updateToggleButton(true);
        
        console.log('[Dark Mode] Dark mode enabled');
        console.log('[Dark Mode] classList:', document.documentElement.className);
        console.log('[Dark Mode] localStorage:', localStorage.getItem(this.storageKey));
    }

    disableDarkMode() {
        console.log('[Dark Mode] Disabling dark mode...');
        
        // Update localStorage
        localStorage.setItem(this.storageKey, 'false');
        
        // Remove class from document element
        document.documentElement.classList.remove(this.darkModeClass);
        
        // Update button
        this.updateToggleButton(false);
        
        console.log('[Dark Mode] Dark mode disabled');
        console.log('[Dark Mode] classList:', document.documentElement.className);
        console.log('[Dark Mode] localStorage:', localStorage.getItem(this.storageKey));
    }

    updateToggleButton(isDarkMode) {
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            // Update emoji
            toggle.textContent = isDarkMode ? '☀️' : '🌙';
            
            // Update label text - show what mode it will switch to
            const label = isDarkMode ? 'Light' : 'Dark';
            toggle.setAttribute('aria-label', `Switch to ${label} mode`);
            toggle.setAttribute('title', `Switch to ${label} mode`);
            toggle.setAttribute('data-mode', label.toLowerCase());
            
            console.log('[Dark Mode] Button updated to:', isDarkMode ? '☀️' : '🌙', `(${label} mode)`);
        }
    }
}

// Initialize immediately - don't wait for DOMContentLoaded
const darkModeToggle = new DarkModeToggle();
window.darkModeToggle = darkModeToggle; // Make it globally accessible for debugging
