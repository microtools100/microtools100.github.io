/**
 * Accessibility Fixes Module
 * Automatic fixes for common accessibility issues
 * WCAG 2.1 AA Compliant
 */

class AccessibilityFixes {
    constructor() {
        this.init();
    }

    /**
     * Initialize fixes on page load
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyAllFixes());
        } else {
            this.applyAllFixes();
        }
    }

    /**
     * Apply all accessibility fixes
     */
    applyAllFixes() {
        this.fixFocusIndicators();
        this.fixLanguageAttribute();
        this.fixSkipLinks();
        this.fixFormAccessibility();
        this.fixButtonAccessibility();
        this.fixLinkAccessibility();
        this.fixImageAccessibility();
        this.fixHeadingStructure();
        this.fixAriaAttributes();
        this.addKeyboardShortcutSupport();
        this.fixColorContrast();
        this.addAccessibleMenus();
        this.addScreenReaderSupport();
    }

    /**
     * Fix focus indicators (WCAG 2.4.7)
     */
    fixFocusIndicators() {
        // Inject focus styles if not present
        const focusStyle = document.createElement('style');
        focusStyle.textContent = `
            *:focus {
                outline: 2px solid #4A90E2;
                outline-offset: 2px;
            }
            
            a:focus, button:focus, input:focus, select:focus, textarea:focus {
                outline: 2px solid #4A90E2;
                outline-offset: 2px;
            }
            
            .skip-link:focus {
                position: static;
                clip: auto;
                width: auto;
                height: auto;
                overflow: visible;
            }
        `;
        document.head.appendChild(focusStyle);
    }

    /**
     * Fix language attribute (WCAG 3.1.1)
     */
    fixLanguageAttribute() {
        if (!document.documentElement.lang) {
            document.documentElement.lang = 'en';
        }
    }

    /**
     * Add skip to main content link
     */
    fixSkipLinks() {
        // Check if skip link already exists
        if (document.querySelector('.skip-link')) {
            return;
        }

        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('role', 'link');

        const skipStyle = document.createElement('style');
        skipStyle.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: #4A90E2;
                color: white;
                padding: 8px;
                text-decoration: none;
                z-index: 100;
                clip: rect(0,0,0,0);
                width: 1px;
                height: 1px;
                overflow: hidden;
            }
            
            .skip-link:focus {
                position: fixed;
                top: 0;
                left: 0;
                clip: auto;
                width: auto;
                height: auto;
                overflow: visible;
            }
        `;
        document.head.appendChild(skipStyle);
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add id to main content if missing
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }

    /**
     * Fix form accessibility (WCAG 1.3.1, 3.3.2)
     */
    fixFormAccessibility() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Ensure every input has aria-label
            if (!input.getAttribute('aria-label') && !input.getAttribute('id')) {
                input.setAttribute('id', `input-${Math.random().toString(36).substr(2, 9)}`);
            }

            if (!input.getAttribute('aria-label')) {
                const placeholder = input.getAttribute('placeholder');
                const name = input.getAttribute('name');
                const label = document.querySelector(`label[for="${input.id}"]`);
                
                if (label) {
                    input.setAttribute('aria-label', label.textContent);
                } else if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                } else if (name) {
                    input.setAttribute('aria-label', name);
                }
            }

            // Add aria-required if required
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }
        });
    }

    /**
     * Fix button accessibility (WCAG 4.1.2)
     */
    fixButtonAccessibility() {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            // Ensure button has text or aria-label
            if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', 'Action button');
            }

            // Add role="button" to styled buttons
            if (!button.getAttribute('role')) {
                button.setAttribute('role', 'button');
            }

            // Ensure button is keyboard accessible
            if (!button.hasAttribute('tabindex') || button.getAttribute('tabindex') < 0) {
                button.setAttribute('tabindex', '0');
            }
        });
    }

    /**
     * Fix link accessibility (WCAG 2.4.4)
     */
    fixLinkAccessibility() {
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            // Ensure link has text or aria-label
            if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
                const href = link.getAttribute('href');
                link.setAttribute('aria-label', `Link to ${href}`);
            }

            // Add role if needed
            if (!link.getAttribute('role')) {
                link.setAttribute('role', 'link');
            }

            // External links
            if (link.hostname && link.hostname !== window.location.hostname) {
                if (!link.getAttribute('rel')) {
                    link.setAttribute('rel', 'external noopener noreferrer');
                }
                if (!link.textContent.includes('↗')) {
                    link.setAttribute('aria-label', (link.getAttribute('aria-label') || link.textContent) + ' (opens in new tab)');
                }
            }
        });
    }

    /**
     * Fix image accessibility (WCAG 1.1.1)
     */
    fixImageAccessibility() {
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Ensure image has alt text
            if (!img.getAttribute('alt')) {
                // Decorative images
                if (img.getAttribute('role') === 'presentation' || img.classList.contains('icon') || img.classList.contains('logo')) {
                    img.setAttribute('alt', '');
                    img.setAttribute('aria-hidden', 'true');
                } else {
                    // Descriptive images should have meaningful alt
                    const src = img.getAttribute('src') || 'image';
                    img.setAttribute('alt', src.split('/').pop().replace(/\.\w+$/, ''));
                }
            }

            // Add role for presentation images
            if (img.getAttribute('alt') === '' && !img.getAttribute('role')) {
                img.setAttribute('role', 'presentation');
                img.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /**
     * Fix heading structure (WCAG 1.3.1, 2.4.1)
     */
    fixHeadingStructure() {
        // Ensure h1 exists
        if (!document.querySelector('h1')) {
            const mainTitle = document.querySelector('h2, h3');
            if (mainTitle) {
                const h1 = document.createElement('h1');
                h1.textContent = mainTitle.textContent;
                h1.className = mainTitle.className;
                mainTitle.parentNode.insertBefore(h1, mainTitle);
            }
        }

        // Check heading hierarchy (excluding use-case-item headings and section headers which have their own styling)
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let prevLevel = 0;

        headings.forEach(heading => {
            // Skip use-case-item headings and section headers as they have their own standardized styling
            if (heading.closest('.use-case-item') || 
                heading.closest('.instructions') || 
                heading.closest('.use-cases') || 
                heading.closest('.how-to-use') ||
                heading.closest('.how-it-works') ||
                heading.closest('.formatting-guide')) {
                return;
            }
            
            const level = parseInt(heading.tagName[1]);
            
            // Fix skipped levels
            if (prevLevel > 0 && level > prevLevel + 1) {
                const correctedLevel = Math.min(level, prevLevel + 1);
                const newTag = `h${correctedLevel}`;
                const newHeading = document.createElement(newTag);
                newHeading.textContent = heading.textContent;
                newHeading.className = heading.className;
                newHeading.id = heading.id;
                heading.parentNode.replaceChild(newHeading, heading);
                prevLevel = correctedLevel;
            } else {
                prevLevel = level;
            }
        });
    }

    /**
     * Fix ARIA attributes (WCAG 1.3.1)
     */
    fixAriaAttributes() {
        // Add aria-current to current page link in nav
        const currentLink = document.querySelector('nav a[href="' + window.location.pathname + '"]');
        if (currentLink) {
            currentLink.setAttribute('aria-current', 'page');
        }

        // Add landmark roles
        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }

        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }

        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }

        // Add aria-label to navigation
        const navs = document.querySelectorAll('nav');
        navs.forEach((nav, index) => {
            if (!nav.getAttribute('aria-label')) {
                nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : `Navigation ${index}`);
            }
        });
    }

    /**
     * Add keyboard shortcut support
     */
    addKeyboardShortcutSupport() {
        document.addEventListener('keydown', (e) => {
            // Skip for input fields
            if (e.target.matches('input, textarea, select')) {
                return;
            }

            // Alt + H = Go to home
            if (e.altKey && e.key === 'h') {
                const homeLink = document.querySelector('a[href="/"]');
                if (homeLink) {
                    homeLink.focus();
                    homeLink.click();
                }
            }

            // Alt + M = Focus main content
            if (e.altKey && e.key === 'm') {
                const main = document.querySelector('main');
                if (main) {
                    main.focus();
                }
            }

            // Alt + S = Focus search
            if (e.altKey && e.key === 's') {
                const search = document.querySelector('input[type="search"], #toolSearch');
                if (search) {
                    search.focus();
                    e.preventDefault();
                }
            }
        });
    }

    /**
     * Fix color contrast issues (WCAG 1.4.3)
     * Add background colors if needed for low contrast
     */
    fixColorContrast() {
        const style = document.createElement('style');
        style.textContent = `
            /* Ensure sufficient contrast for important elements */
            /* Using CSS variables to support dark mode */
            .site-header {
                background-color: var(--background-color);
                color: var(--text-color);
            }
            
            html.dark-mode .site-header {
                background-color: var(--background-color);
                color: var(--text-color);
            }
            
            .hero {
                background-color: var(--surface-color);
                color: var(--text-color);
            }
            
            html.dark-mode .hero {
                background-color: var(--surface-color);
                color: var(--text-color);
            }
            
            button, .btn {
                background-color: var(--primary-color);
                color: #ffffff;
                border: 1px solid var(--primary-color);
            }
            
            html.dark-mode button, html.dark-mode .btn {
                background-color: var(--primary-color);
                color: #ffffff;
                border: 1px solid var(--primary-color);
            }
            
            button:hover, .btn:hover {
                background-color: var(--primary-dark);
                color: #ffffff;
            }
            
            html.dark-mode button:hover, html.dark-mode .btn:hover {
                background-color: var(--primary-dark);
                color: #ffffff;
            }
            
            a {
                color: var(--primary-color);
            }
            
            html.dark-mode a {
                color: var(--primary-color);
            }
            
            a:visited {
                color: var(--primary-dark);
            }
            
            html.dark-mode a:visited {
                color: var(--primary-dark);
            }
            
            a:active {
                color: var(--error-color);
            }
            
            html.dark-mode a:active {
                color: var(--error-color);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add accessible menu support
     */
    addAccessibleMenus() {
        const navs = document.querySelectorAll('nav');
        
        navs.forEach(nav => {
            const lists = nav.querySelectorAll('ul');
            lists.forEach(list => {
                if (!list.getAttribute('role')) {
                    list.setAttribute('role', 'menubar');
                }

                const items = list.querySelectorAll('li');
                items.forEach(item => {
                    item.setAttribute('role', 'none');
                    const link = item.querySelector('a');
                    if (link) {
                        link.setAttribute('role', 'menuitem');
                    }
                });
            });
        });
    }

    /**
     * Add screen reader announcements
     */
    addScreenReaderSupport() {
        // Create aria-live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'sr-announcements';
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);

        // Add helper method to announce messages
        window.announceToScreenReader = function(message) {
            const region = document.getElementById('sr-announcements');
            if (region) {
                region.textContent = message;
            }
        };
    }

    /**
     * Get accessibility status
     */
    getStatus() {
        return {
            focusIndicators: !!document.querySelector('style:contains("focus")'),
            languageAttribute: !!document.documentElement.lang,
            skipLinks: !!document.querySelector('.skip-link'),
            landmarks: this.getLandmarkStatus(),
            forms: this.getFormStatus(),
            images: this.getImageStatus(),
            headings: this.getHeadingStatus()
        };
    }

    getLandmarkStatus() {
        return {
            main: !!document.querySelector('main'),
            nav: !!document.querySelector('nav'),
            header: !!document.querySelector('header'),
            footer: !!document.querySelector('footer')
        };
    }

    getFormStatus() {
        const inputs = document.querySelectorAll('input, textarea, select');
        const withLabels = Array.from(inputs).filter(i => 
            i.getAttribute('aria-label') || 
            document.querySelector(`label[for="${i.id}"]`)
        ).length;
        return {
            total: inputs.length,
            withLabels: withLabels,
            coverage: inputs.length > 0 ? (withLabels / inputs.length * 100).toFixed(0) + '%' : '0%'
        };
    }

    getImageStatus() {
        const images = document.querySelectorAll('img');
        const withAlt = Array.from(images).filter(i => i.getAttribute('alt')).length;
        return {
            total: images.length,
            withAlt: withAlt,
            coverage: images.length > 0 ? (withAlt / images.length * 100).toFixed(0) + '%' : '0%'
        };
    }

    getHeadingStatus() {
        const h1 = document.querySelectorAll('h1').length;
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
        return {
            h1Count: h1,
            totalHeadings: headings,
            properStructure: h1 === 1 && headings > 0
        };
    }
}

// Initialize accessibility fixes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.accessibilityFixes = new AccessibilityFixes();
    });
} else {
    window.accessibilityFixes = new AccessibilityFixes();
}
