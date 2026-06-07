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

        
