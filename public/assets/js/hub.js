// Hub Page Helper Functions
class HubPage {
    constructor(categoryId) {
        this.categoryId = categoryId;
        this.tools = [];
        this.category = null;
        this.allCategories = [];
        this.allMainCategories = [];
        this.init();
    }

    init() {
        // Get all tools and categories from registry
        const allTools = [
            ...TOOLS_REGISTRY.phase1,
            ...TOOLS_REGISTRY.phase2,
            ...TOOLS_REGISTRY.phase3
        ];
        
        this.allCategories = TOOLS_REGISTRY.categories;
        this.allMainCategories = TOOLS_REGISTRY.mainCategories;
        
        // Support both main category IDs and sub-category IDs
        this.category = this.allCategories.find(cat => cat.id === this.categoryId);
        
        // If not found in sub-categories, look in main categories
        if (!this.category && this.allMainCategories) {
            const mainCat = this.allMainCategories.find(cat => cat.id === this.categoryId);
            if (mainCat) {
                // For main category pages, show all tools from that category's sub-categories
                const subCategoryIds = this.allCategories
                    .filter(cat => cat.parentId === this.categoryId)
                    .map(cat => cat.id);
                this.tools = allTools.filter(tool => subCategoryIds.includes(tool.category));
                this.category = mainCat;
            }
        } else {
            // For sub-category pages, show tools in that specific category
            this.tools = allTools.filter(tool => tool.category === this.categoryId);
        }
        
        // Filter tools for this category
        this.tools = allTools.filter(tool => tool.category === this.categoryId);
        
        // Sort by priority (highest first)
        this.tools.sort((a, b) => b.priority - a.priority);
    }

    renderHero() {
        if (!this.category) return '';
        
        return `
            <section class="hub-hero">
                <div class="container">
                    <div class="hub-category-icon">${this.category.icon}</div>
                    <h1>${this.category.name}</h1>
                    <p>${this.category.description}</p>
                </div>
            </section>
        `;
    }

    renderBreadcrumb() {
        return `
            <nav class="breadcrumb container">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li>${this.category?.name || 'Tools'}</li>
                </ul>
            </nav>
        `;
    }

    renderCategoryInfo() {
        if (!this.category) return '';
        
        return `
            <section class="container">
                <div class="hub-info">
                    <p><strong>${this.category.name}:</strong> ${this.category.description}. Explore our collection of ${this.tools.length} free online ${this.category.name.toLowerCase()} tools.</p>
                </div>
            </section>
        `;
    }

    renderToolsGrid() {
        if (this.tools.length === 0) {
            return `
                <section class="container">
                    <div class="hub-empty-state">
                        <div class="hub-empty-state-icon">🔨</div>
                        <h3>Tools Coming Soon</h3>
                        <p>We're working on tools for this category. Check back soon!</p>
                    </div>
                </section>
            `;
        }

        const toolsHtml = this.tools.map(tool => `
            <a href="${tool.url}" class="hub-tool-card">
                <div class="hub-tool-icon">${tool.icon}</div>
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
                <div class="hub-tool-footer">
                    <span class="hub-tool-keywords" title="${tool.keywords}">${tool.keywords.split(',')[0].trim()}</span>
                    <span class="hub-tool-free">FREE</span>
                </div>
            </a>
        `).join('');

        return `
            <section class="container">
                <div class="hub-tools-grid">
                    ${toolsHtml}
                </div>
            </section>
        `;
    }

    renderCategoryLinks() {
        if (this.allMainCategories.length === 0) return '';

        const categoriesHtml = this.allMainCategories.map(cat => {
            const isActive = cat.id === this.categoryId ? 'active' : '';
            const link = cat.id === 'home' ? '/' : `/tools/hub/${cat.id}/`;
            return `<a href="${link}" class="${isActive}" title="${cat.description}">${cat.icon} ${cat.name}</a>`;
        }).join('');

        return `
            <section class="container hub-sidebar">
                <h3>Browse All Categories</h3>
                <div class="hub-categories-list">
                    ${categoriesHtml}
                </div>
            </section>
        `;
    }

    renderRelatedTools() {
        // Get tools from related categories (other than current)
        const allTools = [
            ...TOOLS_REGISTRY.phase1,
            ...TOOLS_REGISTRY.phase2,
            ...TOOLS_REGISTRY.phase3
        ];

        const relatedCategories = this.allMainCategories
            .filter(cat => cat.id !== this.categoryId)
            .slice(0, 4);

        const relatedHtml = relatedCategories.map(cat => {
            // Count all tools in this main category
            const subCategoryIds = this.allCategories
                .filter(subCat => subCat.parentId === cat.id)
                .map(subCat => subCat.id);
            const toolsInCat = allTools.filter(t => subCategoryIds.includes(t.category));
            const link = cat.url || `/tools/hub/${cat.id}/`;
            return `
                <a href="${link}" class="hub-related-item">
                    <span class="hub-related-icon">${cat.icon}</span>
                    <div class="hub-related-info">
                        <h4>${cat.name}</h4>
                        <p>${toolsInCat.length} tools available</p>
                    </div>
                </a>
            `;
        }).join('');

        return `
            <section class="hub-related">
                <div class="container">
                    <h2>Explore Other Categories</h2>
                    <div class="hub-related-grid">
                        ${relatedHtml}
                    </div>
                </div>
            </section>
        `;
    }

    render() {
        return `
            ${this.renderBreadcrumb()}
            ${this.renderHero()}
            ${this.renderCategoryInfo()}
            ${this.renderToolsGrid()}
            ${this.renderCategoryLinks()}
            ${this.renderRelatedTools()}
        `;
    }

    setupSEO() {
        if (!this.category) return;

        const title = `${this.category.name} - Free Online ${this.category.name} Tools | Micro Tools`;
        const description = `${this.category.description}. Browse our collection of free online ${this.category.name.toLowerCase()} tools. No login required, instant results.`;
        const keywords = this.tools.slice(0, 5).map(t => t.keywords).join(', ');

        // Update meta tags
        document.title = title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.setAttribute('content', description);
        
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) metaKeywords.setAttribute('content', keywords);
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', description);
        
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', window.location.href);

        // Update Twitter tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', title);
        
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) twitterDescription.setAttribute('content', description);

        // Schema.org structured data
        const schema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": this.category.name,
            "description": description,
            "url": window.location.href,
            "mainEntity": {
                "@type": "ItemList",
                "itemListElement": this.tools.map((tool, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "SoftwareApplication",
                        "name": tool.name,
                        "description": tool.description,
                        "url": tool.url,
                        "applicationCategory": "Utility"
                    }
                }))
            }
        };

        // Update or create schema script
        let schemaScript = document.querySelector('script[type="application/ld+json"]');
        if (!schemaScript) {
            schemaScript = document.createElement('script');
            schemaScript.type = 'application/ld+json';
            document.head.appendChild(schemaScript);
        }
        schemaScript.innerHTML = JSON.stringify(schema);
    }
}

// Initialize hub page on load
document.addEventListener('DOMContentLoaded', function() {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    
    if (pathParts[0] === 'tools' && pathParts[1] === 'hub' && pathParts[2]) {
        const categoryId = pathParts[2];
        const hub = new HubPage(categoryId);
        
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.innerHTML = hub.render();
            hub.setupSEO();
        }
    }
});
