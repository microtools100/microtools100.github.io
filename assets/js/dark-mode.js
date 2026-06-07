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
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.disableDarkMode();
                }
            }
        };

        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', handleChange);
        } else if (typeof mql.addListener === 'function') {
            mql.addListener(handleChange);
        }


    setupToggleButton() {
        this.button = document.getElementById('darkModeToggle');
        if (!this.button) return;

        // Initialize UI state based on current class
        const enabled = document.documentElement.classList.contains(this.darkModeClass);
        this.updateToggleUI(enabled);

        // Toggle on click
        this.button.addEventListener('click', (ev) => {
            ev.preventDefault();
            this.toggle();
        });
    }

    // Attach a document-level click handler so dynamically-inserted
    // toggle buttons still work (covers header/nav being injected later).
    attachDocumentClickHandler() {
        if (this._docHandlerAttached) return;
        this._docHandlerAttached = true;

        document.addEventListener('click', (ev) => {
            const btn = ev.target.closest && ev.target.closest('#darkModeToggle');
            if (btn) {
                ev.preventDefault();
                this.toggle();
            }
        });
    }

    // Watch for DOM mutations to (re)bind to a toggle button if it's added/replaced
    observeForToggleButton() {
        if (this._observer) return;
        this._observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes.length) {
                    const btn = document.getElementById('darkModeToggle');
                    if (btn && btn !== this.button) {
                        this.button = btn;
                        this.updateToggleUI(document.documentElement.classList.contains(this.darkModeClass));
                    }
                }
            }
        });

        this._observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    toggle() {
        const enabled = document.documentElement.classList.toggle(this.darkModeClass);
        try {

// Best-effort: also ensure global click handler and observer are attached
try {
    // If the constructor ran before, its instance attached handlers.
    // If not, create a short-lived instance to attach document handlers.
    // (This avoids relying on the instance variable in edge cases.)
    // No-op if already initialized.
    (function ensureHandlers() {
        const dm = new DarkModeToggle();
        dm.attachDocumentClickHandler();
        dm.observeForToggleButton();
    })();
} catch (e) {
    // Fail silently — this is a progressive enhancement
}
            localStorage.setItem(this.storageKey, enabled ? 'true' : 'false');
        } catch (e) {
            // Storage may be unavailable in some contexts; fail silently
        }
        this.updateToggleUI(enabled);
    }

    enableDarkMode() {
        document.documentElement.classList.add(this.darkModeClass);
        try { localStorage.setItem(this.storageKey, 'true'); } catch (e) {}
        this.updateToggleUI(true);
    }

    disableDarkMode() {
        document.documentElement.classList.remove(this.darkModeClass);
        try { localStorage.setItem(this.storageKey, 'false'); } catch (e) {}
        this.updateToggleUI(false);
    }

    updateToggleUI(isDark) {
        if (!this.button) return;
        // Swap simple emoji icon and aria-pressed for accessibility
        this.button.textContent = isDark ? '☀️' : '🌙';
        this.button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
        


// Instantiate the toggle so it runs on load
new DarkModeToggle();


