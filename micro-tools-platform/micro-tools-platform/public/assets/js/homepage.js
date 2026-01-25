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

        searchInput.addEventListener('input', debouncedSearch);
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
            const visibleCards = section.querySelectorAll('.tool-card[style="display: block"]');
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

    // Update stats with random numbers (for demo)
    updateStats() {
        const statElements = document.querySelectorAll('.stat-number');
        if (statElements.length >= 3) {
            // Simulate tool usage count (in thousands)
            const usageCount = Math.floor(Math.random() * 9000) + 1000;
            statElements[1].textContent = `${Math.floor(usageCount / 1000)}k+`;
            
            // Simulate uptime percentage
            statElements[2].textContent = '99.9%';
        }
    }
}

// Initialize homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.homepage = new HomepageManager();
    
    // Update stats every 30 seconds (simulated)
    setInterval(() => {
        if (window.MicroTools.homepage) {
            window.MicroTools.homepage.updateStats();
        }
    }, 30000);
});