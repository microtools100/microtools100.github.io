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
    }

    toggle() {
        const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
        
        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        // Update localStorage
        localStorage.setItem(this.storageKey, 'true');
        
        // Add class to document element
        document.documentElement.classList.add(this.darkModeClass);
        
        // Update button
        this.updateToggleButton(true);
    }

    disableDarkMode() {
        // Update localStorage
        localStorage.setItem(this.storageKey, 'false');
        
        // Remove class from document element
        document.documentElement.classList.remove(this.darkModeClass);
        
        // Update button
        this.updateToggleButton(false);
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
        }
    }
}

// Initialize immediately - don't wait for DOMContentLoaded
const darkModeToggle = new DarkModeToggle();
