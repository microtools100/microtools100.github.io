// Footer Injector - Dynamically injects reusable footer into all pages
// This eliminates the need to manually update footer in 50+ tool pages

const footerConfig = {
    sections: [
        {
            title: 'Micro Tools',
            type: 'description',
            content: 'Free online utilities for developers, writers, and content creators.'
        },
        {
            title: 'Categories',
            type: 'links',
            links: [
                { label: 'Text & Content', href: '/#text-content' },
                { label: 'Math & Calculators', href: '/#math-calculators' },
                { label: 'Data Tools', href: '/#data-tools' },
                { label: 'Developer Tools', href: '/#developer-tools' },
                { label: 'Finance Tools', href: '/#finance-tools' },
                { label: 'Office & Time', href: '/#office-time' },
                { label: 'Utilities', href: '/#utilities' }
            ]
        },
        {
            title: 'Quick Links',
            type: 'links',
            links: [
                { label: 'Uppercase Converter', href: '/tools/text-uppercase/' },
                { label: 'JSON Formatter', href: '/tools/json-formatter/' },
                { label: 'Password Generator', href: '/tools/password-generator/' },
                { label: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder/' }
            ]
        },
        {
            title: 'Legal',
            type: 'links',
            links: [
                { label: 'Privacy Policy', href: '/privacy.html' },
                { label: 'Terms of Service', href: '/terms.html' },
                { label: 'Contact', href: '/contact.html' }
            ]
        }
    ]
};

/**
 * Injects the footer into the page
 */
function injectFooter() {
    const footerElement = document.querySelector('.site-footer');
    
    if (!footerElement) return;
    
    // Find or create the footer-content div
    let footerContent = footerElement.querySelector('.footer-content');
    if (!footerContent) {
        footerContent = document.createElement('div');
        footerContent.className = 'footer-content';
        footerElement.insertBefore(footerContent, footerElement.querySelector('.footer-bottom'));
    }
    
    // Clear existing content
    footerContent.innerHTML = '';
    
    // Build footer sections
    footerConfig.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'footer-section';
        
        const titleH4 = document.createElement('h4');
        titleH4.className = 'nowrap';
        titleH4.textContent = section.title;
        sectionDiv.appendChild(titleH4);
        
        if (section.type === 'description') {
            const p = document.createElement('p');
            p.textContent = section.content;
            sectionDiv.appendChild(p);
        } else if (section.type === 'links') {
            const ul = document.createElement('ul');
            section.links.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.href;
                a.className = 'nowrap';
                a.textContent = link.label;
                li.appendChild(a);
                ul.appendChild(li);
            });
            sectionDiv.appendChild(ul);
        }
        
        footerContent.appendChild(sectionDiv);
    });
}

/**
 * Injects the footer bottom section
 */
function injectFooterBottom() {
    const footerBottom = document.querySelector('.footer-bottom');
    
    if (!footerBottom) return;
    
    // Check if footer-bottom already has content
    if (footerBottom.querySelector('p')) return;
    
    const p1 = document.createElement('p');
    p1.className = 'nowrap';
    p1.innerHTML = '&copy; <span id="currentYear"></span> Micro Tools. All tools are free to use.';
    footerBottom.appendChild(p1);
    
    const p2 = document.createElement('p');
    p2.className = 'footer-note nowrap';
    p2.textContent = 'This site uses only frontend JavaScript. No data is sent to any server.';
    footerBottom.appendChild(p2);
    
    // Update year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

/**
 * Main function to inject footer components
 */
function injectFooterComponents() {
    injectFooter();
    injectFooterBottom();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooterComponents);
} else {
    injectFooterComponents();
}
