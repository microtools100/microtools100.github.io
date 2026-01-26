// Homepage specific functionality
class HomepageManager {
    constructor() {
        this.tools = [
            {
                id: 'text-uppercase',
                name: 'Text Uppercase Converter',
                description: 'Convert any text to uppercase instantly. Perfect for headings and emphasis.',
                category: 'text',
                icon: 'T↑',
                url: '/tools/text-uppercase/'
            },
            {
                id: 'text-lowercase',
                name: 'Text Lowercase Converter',
                description: 'Convert text to lowercase. Useful for formatting and standardization.',
                category: 'text',
                icon: 'T↓',
                url: '/tools/text-lowercase/'
            },
            {
                id: 'remove-extra-spaces',
                name: 'Remove Extra Spaces',
                description: 'Clean up text by removing extra spaces, tabs, and line breaks.',
                category: 'text',
                icon: '␣',
                url: '/tools/remove-extra-spaces/'
            },
            {
                id: 'excel-column-to-comma-list',
                name: 'Excel Column to Comma List',
                description: 'Convert Excel column data to comma-separated values with custom formatting options.',
                category: 'data',
                icon: '📊',
                url: '/tools/excel-column-to-comma-list/'
            },
            {
                id: 'quote-comma-formatter',
                name: 'Quote & Comma Formatter',
                description: 'Add quotes and delimiters to column values. Perfect for SQL queries and data formatting.',
                category: 'data',
                icon: '"\'',
                url: '/tools/quote-comma-formatter/'
            },
            {
                id: 'json-formatter',
                name: 'JSON Formatter & Validator',
                description: 'Format, validate, minify and beautify JSON with syntax highlighting.',
                category: 'data',
                icon: '{}',
                url: '/tools/json-formatter/'
            },
            {
                id: 'url-encoder-decoder',
                name: 'URL Encoder/Decoder',
                description: 'Encode and decode URLs, query parameters, and special characters.',
                category: 'data',
                icon: '🔗',
                url: '/tools/url-encoder-decoder/'
            },
            {
                id: 'excel-column-to-sql-in',
                name: 'Excel Column to SQL IN List',
                description: 'Convert Excel column data to SQL IN statement format.',
                category: 'data',
                icon: '⬚',
                url: '/tools/excel-column-to-sql-in/'
            },
            {
                id: 'comma-to-newline',
                name: 'Comma to Newline',
                description: 'Convert comma-separated values to newline-separated format.',
                category: 'data',
                icon: '⮎',
                url: '/tools/comma-to-newline/'
            },
            {
                id: 'newline-to-comma',
                name: 'Newline to Comma',
                description: 'Convert newline-separated values to comma-separated format.',
                category: 'data',
                icon: '⮏',
                url: '/tools/newline-to-comma/'
            },
            {
                id: 'charades-random',
                name: 'Random Charades Generator',
                description: 'Generate random charades words for parties and game nights.',
                category: 'games',
                icon: '🎭',
                url: '/tools/charades-random/'
            },
            {
                id: 'password-generator',
                name: 'Password Generator',
                description: 'Create strong, secure passwords with customizable length and character types.',
                category: 'security',
                icon: '🔒',
                url: '/tools/password-generator/'
            }
        ];

        this.categories = {
            'text': 'Text Tools',
            'data': 'Data Tools',
            'games': 'Game Tools',
            'security': 'Security Tools'
        };

        this.init();
    }

    init() {
        this.initSearch();
        this.initCategoryFilter();
        this.updateToolCount();
        this.initSmoothScroll();
    }

    initSearch() {
        const searchInput = document.getElementById('toolSearch');
        const searchBtn = document.getElementById('searchBtn');
        
        if (!searchInput || !searchBtn) return;

        const debouncedSearch = window.MicroTools?.utils?.debounce?.(this.performSearch.bind(this), 300) || 
                               this.debounce(this.performSearch.bind(this), 300);

        searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
        searchBtn.addEventListener('click', () => this.performSearch(searchInput.value));
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });
    }

    performSearch(query = '') {
        const searchTerm = query.toLowerCase().trim();
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update sections visibility
        document.querySelectorAll('.tools-section').forEach(section => {
            const visibleCards = section.querySelectorAll('.tool-card:not([style*="display: none"])');
            section.style.display = visibleCards.length > 0 ? 'block' : 'none';
        });
    }

    initCategoryFilter() {
        const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Highlight active nav item
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Scroll to section
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update URL without page reload
                    history.pushState(null, '', `#${targetId}`);
                }
            });
        });
    }

    updateToolCount() {
        const countElement = document.querySelector('.stat-number');
        if (countElement) {
            countElement.textContent = this.tools.length;
        }
    }

    initSmoothScroll() {
        // Handle hash links on page load
        if (window.location.hash) {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }

    // Simple debounce implementation if utils not available
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

    // Don't override stats - they are set statically in HTML
}

// Initialize homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.homepage = new HomepageManager();
});