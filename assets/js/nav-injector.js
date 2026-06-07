// Navigation Injector - Dynamically injects reusable navigation into all pages
// This eliminates the need to manually update navigation in 50+ tool pages

const navigationConfig = {
    items: [
        { label: 'Home', href: '/' },
        { label: 'Text & Content', href: '/#text-content' },
        { label: 'Math & Calculators', href: '/#math-calculators' },
        { label: 'Data Tools', href: '/#data-tools' },
        { label: 'Developer Tools', href: '/#developer-tools' },
        { label: 'Finance Tools', href: '/#finance-tools' },
        { label: 'Office & Time', href: '/#office-time' },
        { label: 'Utilities', href: '/#utilities' }
    ],
    categoriesItems: [
        { label: 'Text & Content', href: '/#text-content' },
        { label: 'Math & Calculators', href: '/#math-calculators' },
        { label: 'Data Tools', href: '/#data-tools' },
        { label: 'Developer Tools', href: '/#developer-tools' },
        { label: 'Finance Tools', href: '/#finance-tools' },
        { label: 'Office & Time', href: '/#office-time' },
        { label: 'Utilities', href: '/#utilities' }
    ]
};

/**
 * Injects the main navigation bar into the header
 */
function injectMainNavigation() {
    const navElement = document.querySelector('nav.main-nav');
    
    if (!navElement) return; // Navigation doesn't exist on this page
    
    const navList = navElement.querySelector('ul');
    if (!navList) return;
    
    // Clear existing navigation items (but keep the structure)
    navList.innerHTML = '';
    
    // Build navigation items
    navigationConfig.items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        navList.appendChild(li);
    });
}

/**
 * Injects the categories section into the footer
 */
function injectCategoriesFooter() {
    // Find the Categories section in the footer
    const footerSections = document.querySelectorAll('.footer-section');
    let categoriesSection = null;
    
    for (let section of footerSections) {
        const heading = section.querySelector('h4');
        if (heading && heading.textContent.trim() === 'Categories') {
            categoriesSection = section;
            break;
        }
    }
    
    if (!categoriesSection) return; // Categories section doesn't exist
    
    const categoriesList = categoriesSection.querySelector('ul');
    if (!categoriesList) return;
    
    // Clear existing items
    categoriesList.innerHTML = '';
    
    // Build categories items
    navigationConfig.categoriesItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        categoriesList.appendChild(li);
    });
}

/**
 * Setup mobile menu toggle functionality
 */
function setupMobileMenuToggle() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('nav.main-nav');
    
    if (!mobileMenuBtn || !mainNav) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', mainNav.classList.contains('active'));
    });
    
    // Close menu when a nav link is clicked
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * Initialize navigation injection when DOM is ready
 */
function initializeNavigation() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectMainNavigation();
            injectCategoriesFooter();
            setupMobileMenuToggle();
        });
    } else {
        injectMainNavigation();
        injectCategoriesFooter();
        setupMobileMenuToggle();
    }
}

// Start injection immediately
initializeNavigation();

/**
 * Export for testing/debugging
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigationConfig,
        injectMainNavigation,
        injectCategoriesFooter,
        initializeNavigation
    };
}
