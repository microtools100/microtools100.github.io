// Navigation Injector - Dynamically injects reusable navigation into all pages
// This eliminates the need to manually update navigation in 50+ tool pages

const navigationConfig = {
    items: [
        { label: 'Home', href: '/' },
        { label: 'Text Tools', href: '/#text-tools' },
        { label: 'Data Tools', href: '/#data-tools' },
        { label: 'Developer Tools', href: '/#developer-tools' },
        { label: 'Finance Tools', href: '/#finance-tools' },
        { label: 'Security Tools', href: '/#security-tools' },
        { label: 'Utilities', href: '/#utilities' },
        { label: 'Games & Generators', href: '/#games' }
    ],
    categoriesItems: [
        { label: 'Text Tools', href: '/#text-tools' },
        { label: 'Data Tools', href: '/#data-tools' },
        { label: 'Developer Tools', href: '/#developer-tools' },
        { label: 'Finance Tools', href: '/#finance-tools' },
        { label: 'Security Tools', href: '/#security-tools' },
        { label: 'Utilities', href: '/#utilities' },
        { label: 'Games & Generators', href: '/#games' }
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
 * Initialize navigation injection when DOM is ready
 */
function initializeNavigation() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectMainNavigation();
            injectCategoriesFooter();
        });
    } else {
        injectMainNavigation();
        injectCategoriesFooter();
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
