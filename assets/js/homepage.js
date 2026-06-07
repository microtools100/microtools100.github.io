// Homepage specific functionality
class HomepageManager {
    constructor() {
        // Get tools dynamically from TOOLS_REGISTRY if available, otherwise use fallback
        if (typeof TOOLS_REGISTRY !== 'undefined' && TOOLS_REGISTRY.phase1 && TOOLS_REGISTRY.phase2 && TOOLS_REGISTRY.phase3) {
            this.allTools = [...TOOLS_REGISTRY.phase1, ...TOOLS_REGISTRY.phase2, ...TOOLS_REGISTRY.phase3];
        } else {
            // Fallback to hardcoded list if registry not loaded
            this.allTools = this.getFallbackTools();
        }

        this.init();
    }

    getFallbackTools() {
        return [
            // Text Case Tools
            { id: 'text-uppercase', name: 'Text Uppercase Converter', category: 'text', url: '/tools/text-uppercase/' },
            { id: 'text-lowercase', name: 'Text Lowercase Converter', category: 'text', url: '/tools/text-lowercase/' },
            { id: 'title-case-converter', name: 'Title Case Converter', category: 'text', url: '/tools/title-case-converter/' },
            { id: 'sentence-case-converter', name: 'Sentence Case Converter', category: 'text', url: '/tools/sentence-case-converter/' },
            
            // Text Formatting Tools
            { id: 'remove-extra-spaces', name: 'Remove Extra Spaces', category: 'text', url: '/tools/remove-extra-spaces/' },
            { id: 'duplicate-line-remover', name: 'Duplicate Line Remover', category: 'text', url: '/tools/duplicate-line-remover/' },
            { id: 'string-case-converter', name: 'String Case Converter', category: 'text', url: '/tools/string-case-converter/' },
            
            // Text Analysis Tools
            { id: 'word-character-counter', name: 'Word & Character Counter', category: 'text', url: '/tools/word-character-counter/' },
            { id: 'reading-time-calculator', name: 'Reading Time Calculator', category: 'text', url: '/tools/reading-time-calculator/' },
            
            // Data Format Converters
            { id: 'json-to-csv', name: 'JSON to CSV Converter', category: 'data', url: '/tools/json-to-csv/' },
            { id: 'csv-to-json', name: 'CSV to JSON Converter', category: 'data', url: '/tools/csv-to-json/' },
            { id: 'json-to-yaml', name: 'JSON to YAML Converter', category: 'data', url: '/tools/json-to-yaml/' },
            { id: 'json-to-xml', name: 'JSON to XML Converter', category: 'data', url: '/tools/json-to-xml/' },
            { id: 'xml-to-json', name: 'XML to JSON Converter', category: 'data', url: '/tools/xml-to-json/' },
            
            // Data Tools
            { id: 'excel-column-to-comma-list', name: 'Excel Column to Comma List', category: 'data', url: '/tools/excel-column-to-comma-list/' },
            { id: 'quote-comma-formatter', name: 'Quote & Comma Formatter', category: 'data', url: '/tools/quote-comma-formatter/' },
            { id: 'json-formatter', name: 'JSON Formatter & Validator', category: 'data', url: '/tools/json-formatter/' },
            { id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', category: 'data', url: '/tools/url-encoder-decoder/' },
            { id: 'base64-encoder-decoder', name: 'Base64 Encoder/Decoder', category: 'data', url: '/tools/base64-encoder-decoder/' },
            { id: 'html-escape-unescape', name: 'HTML Escape/Unescape', category: 'data', url: '/tools/html-escape-unescape/' },
            { id: 'excel-column-to-sql-in', name: 'Excel Column to SQL IN List', category: 'data', url: '/tools/excel-column-to-sql-in/' },
            { id: 'comma-to-newline', name: 'Comma to Newline', category: 'data', url: '/tools/comma-to-newline/' },
            
            // Conversion & Generator Tools
            { id: 'unit-converter', name: 'Unit Converter', category: 'data', url: '/tools/unit-converter/' },
            { id: 'qr-code-generator', name: 'QR Code Generator', category: 'data', url: '/tools/qr-code-generator/' },
            { id: 'text-to-binary', name: 'Text to Binary Converter', category: 'data', url: '/tools/text-to-binary/' },
            { id: 'image-to-base64', name: 'Image to Base64 Converter', category: 'data', url: '/tools/image-to-base64/' },
            { id: 'color-picker', name: 'Color Picker', category: 'data', url: '/tools/color-picker/' },
            
            // Security & Password Tools
            { id: 'password-generator', name: 'Password Generator', category: 'security', url: '/tools/password-generator/' },
            { id: 'password-strength-checker', name: 'Password Strength Checker', category: 'security', url: '/tools/password-strength-checker/' },
            { id: 'md5-sha-generator', name: 'MD5 & SHA Hash Generator', category: 'security', url: '/tools/md5-sha-generator/' },
            { id: 'jwt-decoder', name: 'JWT Decoder', category: 'security', url: '/tools/jwt-decoder/' },
            { id: 'uuid-generator', name: 'UUID Generator', category: 'security', url: '/tools/uuid-generator/' },
            
            // Testing Tools
            { id: 'fake-data-generator', name: 'Fake Data Generator', category: 'security', url: '/tools/fake-data-generator/' },
            { id: 'regex-tester', name: 'Regex Tester', category: 'data', url: '/tools/regex-tester/' },
            { id: 'sql-formatter', name: 'SQL Formatter', category: 'data', url: '/tools/sql-formatter/' },
            { id: 'sql-query-builder', name: 'SQL Query Builder', category: 'data', url: '/tools/sql-query-builder/' },
            
            // Random & Games Tools
            { id: 'charades-random', name: 'Random Charades Generator', category: 'games', url: '/tools/charades-random/' },
            { id: 'random-team-generator', name: 'Random Team Generator', category: 'games', url: '/tools/random-team-generator/' },
            { id: 'decision-maker', name: 'Decision Maker', category: 'games', url: '/tools/decision-maker/' },
            { id: 'countdown-timer', name: 'Countdown Timer', category: 'games', url: '/tools/countdown-timer/' }
        ];
    }

    // Create searchable tools list from allTools
    get tools() {
        return this.allTools.map(tool => ({
            id: tool.id,
            name: tool.name,
            url: tool.url,
            keywords: tool.keywords || '',
            description: tool.description || ''
        }));
    }

    get categories() {
        return {
            'text': 'Text Tools',
            'data': 'Data Tools',
            'games': 'Game Tools',
            'security': 'Security Tools'
        };
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
        let hasResults = false;
        let firstVisibleSection = null;
        
        toolCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update sections visibility
        document.querySelectorAll('.tools-section').forEach(section => {
            const visibleCards = section.querySelectorAll('.tool-card:not([style*="display: none"])');
            if (visibleCards.length > 0) {
                section.style.display = 'block';
                if (!firstVisibleSection) {
                    firstVisibleSection = section;
                }
            } else {
                section.style.display = 'none';
            }
        });
        
        // Auto-scroll to results on mobile when search has results
        if (searchTerm !== '' && hasResults && firstVisibleSection) {
            // Check if on mobile or if search has query
            if (window.innerWidth <= 991) {
                setTimeout(() => {
                    firstVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
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
        const countElement = document.getElementById('toolCountStat');
        if (countElement) {
            // Count actual tool cards displayed on the page (excluding hub cards)
            const toolCards = document.querySelectorAll('.tool-card');
            // Filter out hub cards by checking if href contains '/tools/hub/'
            const actualTools = Array.from(toolCards).filter(card => {
                const href = card.getAttribute('href');
                return href && !href.includes('/tools/hub/');
            });
            countElement.textContent = actualTools.length;
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
    
    // Initialize performance monitoring
    if (window.PerformanceMonitor) {
        window.MicroTools.performanceMonitor = new PerformanceMonitor();
    }
});