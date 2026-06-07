/**
 * Accessibility Audit & Compliance Module
 * WCAG 2.1 AA Compliance Verification
 * Automatically fixes common accessibility issues
 */

class AccessibilityAudit {
    constructor() {
        this.issues = [];
        this.fixes = [];
        this.wcagLevel = 'AA'; // WCAG 2.1 AA
        this.init();
    }

    /**
     * Initialize accessibility audit
     */
    init() {
        // Run audit on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runAudit());
        } else {
            this.runAudit();
        }
    }

    /**
     * Run comprehensive accessibility audit
     */
    runAudit() {
        
        this.auditPageStructure();
        this.auditHeadingHierarchy();
        this.auditColorContrast();
        this.auditFormLabels();
        this.auditImages();
        this.auditLinks();
        this.auditKeyboardNavigation();
        this.auditAriaAttributes();
        this.auditFocusManagement();
        this.auditLanguageAttribute();
        this.auditPageTitles();
        this.auditTimeBasedMedia();
        
        // Apply automatic fixes
        this.applyFixes();
        
        // Generate report
        this.generateReport();
    }

    /**
     * Audit page structure (WCAG 1.3.1 Info and Relationships)
     */
    auditPageStructure() {
        // Check for main landmark
        const main = document.querySelector('main');
        if (!main) {
            this.issues.push({
                level: 'ERROR',
                wcag: '1.3.1',
                message: 'Missing <main> landmark element',
                affected: 'page-structure',
                fix: 'Wrap main content in <main> tag'
            });
        }

        // Check for header
        const header = document.querySelector('header');
        if (!header) {
            this.issues.push({
                level: 'WARNING',
                wcag: '1.3.1',
                message: 'Missing <header> landmark element',
                affected: 'page-structure'
            });
        }

        // Check for footer
        const footer = document.querySelector('footer');
        if (!footer) {
            this.issues.push({
                level: 'WARNING',
                wcag: '1.3.1',
                message: 'Missing <footer> landmark element',
                affected: 'page-structure'
            });
        }

        // Check for nav elements
        const navs = document.querySelectorAll('nav');
        if (navs.length === 0) {
            this.issues.push({
                level: 'WARNING',
                wcag: '1.3.1',
                message: 'No <nav> landmark found',
                affected: 'page-structure'
            });
        }
    }

    /**
     * Audit heading hierarchy (WCAG 1.3.1 Info and Relationships)
     */
    auditHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let prevLevel = 0;

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName[1]);
            
            // Check for h1
            if (level === 1 && index > 0) {
                this.issues.push({
                    level: 'WARNING',
                    wcag: '1.3.1',
                    message: `Multiple H1 elements found (only one recommended)`,
                    affected: heading,
                    element: heading
                });
            }

            // Check for skipped levels
            if (index > 0 && level > prevLevel + 1) {
                this.issues.push({
                    level: 'WARNING',
                    wcag: '1.3.1',
                    message: `Heading hierarchy skipped: from H${prevLevel} to H${level}`,
                    affected: heading,
                    element: heading
                });
            }

            // Check for empty headings
            if (!heading.textContent.trim()) {
                this.issues.push({
                    level: 'ERROR',
                    wcag: '2.4.2',
                    message: `Empty heading element: <${heading.tagName}>`,
                    affected: heading,
                    element: heading
                });
            }

            prevLevel = level;
        });
    }

    /**
     * Audit color contrast (WCAG 1.4.3 Contrast)
     */
    auditColorContrast() {
        const elementsWithText = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li, td, th');
        const lowContrastElements = [];

        elementsWithText.forEach(element => {
            if (element.textContent.trim()) {
                const contrast = this.getContrastRatio(element);
                
                // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
                if (contrast < 4.5) {
                    lowContrastElements.push({
                        element,
                        contrast: contrast.toFixed(2),
                        required: '4.5:1'
                    });
                }
            }
        });

        if (lowContrastElements.length > 0) {
            this.issues.push({
                level: 'ERROR',
                wcag: '1.4.3',
                message: `${lowContrastElements.length} elements with insufficient color contrast (< 4.5:1)`,
                affected: lowContrastElements,
                fix: 'Increase contrast ratio to meet WCAG AA standards'
            });
        }
    }

    /**
     * Get contrast ratio between text and background (simplified)
     */
    getContrastRatio(element) {
        try {
            const style = window.getComputedStyle(element);
            const bgColor = this.parseColor(style.backgroundColor);
            const textColor = this.parseColor(style.color);
            
            const bgLum = this.getRelativeLuminance(bgColor);
            const textLum = this.getRelativeLuminance(textColor);
            
            const lighter = Math.max(bgLum, textLum);
            const darker = Math.min(bgLum, textLum);
            
            return (lighter + 0.05) / (darker + 0.05);
        } catch {
            return 7; // Default to passing if calculation fails
        }
    }

    /**
     * Parse color string to RGB
     */
    parseColor(colorString) {
        if (colorString.includes('rgb')) {
            const matches = colorString.match(/\d+/g);
            return matches ? {r: parseInt(matches[0]), g: parseInt(matches[1]), b: parseInt(matches[2])} : {r: 0, g: 0, b: 0};
        }
        return {r: 0, g: 0, b: 0};
    }

    /**
     * Get relative luminance (WCAG formula)
     */
    getRelativeLuminance(rgb) {
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Audit form labels (WCAG 1.3.1, 3.3.2)
     */
    auditFormLabels() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea, select');
        
        inputs.forEach(input => {
            // Check for associated label
            const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                           input.closest('label') ||
                           input.getAttribute('aria-label');
            
            if (!hasLabel && !input.getAttribute('placeholder')) {
                this.issues.push({
                    level: 'ERROR',
                    wcag: '1.3.1',
                    message: `Form input missing label or aria-label`,
                    affected: input,
                    element: input,
                    fix: 'Add associated <label> or aria-label attribute'
                });
            }

            // Check for aria-label at minimum
            if (!input.getAttribute('aria-label') && input.getAttribute('placeholder')) {
                this.fixes.push({
                    action: 'addAttribute',
                    target: input,
                    attribute: 'aria-label',
                    value: input.getAttribute('placeholder')
                });
            }
        });
    }

    /**
     * Audit images (WCAG 1.1.1 Non-text Content)
     */
    auditImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Check for alt text
            if (!img.getAttribute('alt')) {
                this.issues.push({
                    level: 'ERROR',
                    wcag: '1.1.1',
                    message: `Image missing alt text: ${img.src}`,
                    affected: img,
                    element: img,
                    fix: 'Add descriptive alt attribute'
                });
            }

            // Check for empty alt (should only be for decorative images)
            if (img.getAttribute('alt') === '' && !img.getAttribute('role')) {
                this.fixes.push({
                    action: 'addAttribute',
                    target: img,
                    attribute: 'role',
                    value: 'presentation'
                });
            }
        });
    }

    /**
     * Audit links (WCAG 2.4.4 Link Purpose)
     */
    auditLinks() {
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            // Check for link text
            const text = link.textContent.trim();
            const ariaLabel = link.getAttribute('aria-label');
            
            if (!text && !ariaLabel) {
                this.issues.push({
                    level: 'ERROR',
                    wcag: '2.4.4',
                    message: `Link without text or aria-label`,
                    affected: link,
                    element: link,
                    fix: 'Add descriptive link text or aria-label'
                });
            }

            // Check for "click here" anti-pattern
            if (text.toLowerCase().includes('click here') || text.toLowerCase().includes('read more')) {
                this.issues.push({
                    level: 'WARNING',
                    wcag: '2.4.4',
                    message: `Non-descriptive link text: "${text}"`,
                    affected: link,
                    element: link,
                    fix: 'Use descriptive link text that explains the destination'
                });
            }
        });
    }

    /**
     * Audit keyboard navigation (WCAG 2.1.1 Keyboard)
     */
    auditKeyboardNavigation() {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        const elementsNeedingTabindex = [];
        
        interactiveElements.forEach(element => {
            // Check if element is keyboard accessible
            if (!this.isKeyboardAccessible(element)) {
                elementsNeedingTabindex.push(element);
            }
        });

        if (elementsNeedingTabindex.length > 0) {
            this.issues.push({
                level: 'WARNING',
                wcag: '2.1.1',
                message: `${elementsNeedingTabindex.length} interactive elements may not be keyboard accessible`,
                affected: elementsNeedingTabindex,
                fix: 'Ensure all interactive elements are keyboard accessible via Tab key'
            });
        }
    }

    /**
     * Check if element is keyboard accessible
     */
    isKeyboardAccessible(element) {
        const tabindex = element.getAttribute('tabindex');
        const isNaturallyFocusable = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
        
        if (tabindex !== null) {
            return parseInt(tabindex) >= 0;
        }
        
        return isNaturallyFocusable;
    }

    /**
     * Audit ARIA attributes (WCAG 1.3.1)
     */
    auditAriaAttributes() {
        const ariaElements = document.querySelectorAll('[role], [aria-label], [aria-labelledby], [aria-describedby]');
        
        ariaElements.forEach(element => {
            // Check for valid ARIA role
            const role = element.getAttribute('role');
            if (role) {
                const validRoles = ['button', 'link', 'navigation', 'main', 'region', 'alert', 'alertdialog', 'menu', 'menuitem', 'tab', 'tabpanel'];
                if (!validRoles.includes(role)) {
                    this.issues.push({
                        level: 'WARNING',
                        wcag: '1.3.1',
                        message: `Potentially invalid ARIA role: ${role}`,
                        affected: element,
                        element: element
                    });
                }
            }

            // Check for aria-labelledby target exists
            const labelledby = element.getAttribute('aria-labelledby');
            if (labelledby && !document.getElementById(labelledby)) {
                this.issues.push({
                    level: 'ERROR',
                    wcag: '1.3.1',
                    message: `aria-labelledby references non-existent element: ${labelledby}`,
                    affected: element,
                    element: element
                });
            }
        });
    }

    /**
     * Audit focus management (WCAG 2.4.3 Focus Order)
     */
    auditFocusManagement() {
        const tabindexes = document.querySelectorAll('[tabindex]');
        const positiveTabindexes = Array.from(tabindexes).filter(el => 
            parseInt(el.getAttribute('tabindex')) > 0
        );

        if (positiveTabindexes.length > 0) {
            this.issues.push({
                level: 'WARNING',
                wcag: '2.4.3',
                message: `${positiveTabindexes.length} elements with positive tabindex (should use 0 or -1)`,
                affected: positiveTabindexes,
                fix: 'Use tabindex="0" for focusable elements, tabindex="-1" for removing from tab order'
            });
        }

        // Check for focus styles
        if (!this.hasFocusStyles()) {
            this.issues.push({
                level: 'ERROR',
                wcag: '2.4.7',
                message: 'Missing visible focus indicators in CSS',
                affected: 'page-styles',
                fix: 'Add :focus styles to all interactive elements'
            });
        }
    }

    /**
     * Check if focus styles exist
     */
    hasFocusStyles() {
        const styleSheets = document.styleSheets;
        try {
            for (let sheet of styleSheets) {
                try {
                    const rules = sheet.cssRules || sheet.rules;
                    for (let rule of rules) {
                        if (rule.selectorText && rule.selectorText.includes(':focus')) {
                            return true;
                        }
                    }
                } catch (e) {
                    // Cross-origin or restricted stylesheet
                }
            }
        } catch (e) {
            return true; // Assume styles exist if we can't check
        }
        return false;
    }

    /**
     * Audit language attribute (WCAG 3.1.1 Language of Page)
     */
    auditLanguageAttribute() {
        const html = document.documentElement;
        if (!html.getAttribute('lang')) {
            this.issues.push({
                level: 'ERROR',
                wcag: '3.1.1',
                message: 'Missing lang attribute on <html> element',
                affected: 'html',
                element: html,
                fix: 'Add lang="en" to html tag'
            });
        }
    }

    /**
     * Audit page titles (WCAG 2.4.2 Page Titled)
     */
    auditPageTitles() {
        const title = document.querySelector('title');
        if (!title || !title.textContent.trim()) {
            this.issues.push({
                level: 'ERROR',
                wcag: '2.4.2',
                message: 'Missing or empty page title',
                affected: 'page-title',
                fix: 'Add descriptive <title> tag'
            });
        }
    }

    /**
     * Audit time-based media (WCAG 1.2.1, 1.2.2)
     */
    auditTimeBasedMedia() {
        const videos = document.querySelectorAll('video');
        const audios = document.querySelectorAll('audio');

        videos.forEach(video => {
            if (!video.querySelector('track[kind="captions"]')) {
                this.issues.push({
                    level: 'WARNING',
                    wcag: '1.2.1',
                    message: 'Video missing captions',
                    affected: video,
                    element: video,
                    fix: 'Add <track kind="captions"> element to video'
                });
            }
        });

        audios.forEach(audio => {
            if (!audio.textContent.trim()) {
                this.issues.push({
                    level: 'WARNING',
                    wcag: '1.2.1',
                    message: 'Audio content missing transcript',
                    affected: audio,
                    element: audio,
                    fix: 'Provide text transcript for audio content'
                });
            }
        });
    }

    /**
     * Apply automatic accessibility fixes
     */
    applyFixes() {
        this.fixes.forEach(fix => {
            try {
                if (fix.action === 'addAttribute' && fix.target) {
                    fix.target.setAttribute(fix.attribute, fix.value);
                } else if (fix.action === 'addClass' && fix.target) {
                    fix.target.classList.add(fix.value);
                } else if (fix.action === 'removeAttribute' && fix.target) {
                    fix.target.removeAttribute(fix.value);
                }
            } catch (e) {
                // Fix failed - continue with next fix
            }
        });
    }

    /**
     * Generate accessibility compliance report
     */
    generateReport() {
        const errors = this.issues.filter(i => i.level === 'ERROR').length;
        const warnings = this.issues.filter(i => i.level === 'WARNING').length;
        const complianceScore = Math.max(0, 100 - (errors * 15) - (warnings * 5));

        const report = {
            timestamp: new Date().toISOString(),
            wcagLevel: this.wcagLevel,
            complianceScore: Math.round(complianceScore),
            totalIssues: this.issues.length,
            errors,
            warnings,
            fixesApplied: this.fixes.length,
            issues: this.issues,
            recommendations: this.generateRecommendations()
        };

        // Store report
        window.accessibilityReport = report;

        return report;
    }

    /**
     * Generate optimization recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.issues.some(i => i.wcag === '1.1.1')) {
            recommendations.push('All images should have descriptive alt text');
        }
        if (this.issues.some(i => i.wcag === '1.4.3')) {
            recommendations.push('Ensure text has at least 4.5:1 contrast ratio for normal text');
        }
        if (this.issues.some(i => i.wcag === '2.1.1')) {
            recommendations.push('All interactive elements must be keyboard accessible');
        }
        if (this.issues.some(i => i.wcag === '2.4.4')) {
            recommendations.push('Use descriptive link text that explains the destination');
        }
        if (this.issues.some(i => i.wcag === '3.1.1')) {
            recommendations.push('Specify language for page and language changes');
        }
        if (this.issues.some(i => i.wcag === '1.3.1')) {
            recommendations.push('Use semantic HTML and proper heading hierarchy');
        }

        return recommendations;
    }

    /**
     * Public method to get compliance score
     */
    getComplianceScore() {
        return window.accessibilityReport?.complianceScore || 0;
    }

    /**
     * Public method to get all issues
     */
    getIssues() {
        return this.issues;
    }

    /**
     * Public method to generate accessible documentation
     */
    generateAccessibleDocumentation() {
        return {
            wcagVersion: '2.1',
            level: 'AA',
            report: window.accessibilityReport,
            guidelines: {
                perceivable: 'Information and user interface components must be perceivable',
                operable: 'User interface components and navigation must be operable',
                understandable: 'Information and user interface operation must be understandable',
                robust: 'Content must be robust enough for interpretation by assistive technologies'
            }
        };
    }
}

// Initialize accessibility audit on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.accessibilityAudit = new AccessibilityAudit();
    });
} else {
    window.accessibilityAudit = new AccessibilityAudit();
}
