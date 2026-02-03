// Add hub links to tool pages
// This script runs on each tool page and adds a link back to the category hub

document.addEventListener('DOMContentLoaded', function() {
    // Find the related-tools section
    const relatedToolsSection = document.querySelector('.related-tools');
    
    if (!relatedToolsSection || !TOOLS_REGISTRY) {
        return;
    }

    // Get current tool from URL
    const pathParts = window.location.pathname.split('/').filter(p => p);
    if (pathParts[0] !== 'tools' || !pathParts[1]) {
        return;
    }

    const currentToolId = pathParts[1];
    
    // Find the current tool in registry
    const allTools = [
        ...TOOLS_REGISTRY.phase1,
        ...TOOLS_REGISTRY.phase2
    ];
    
    const currentTool = allTools.find(tool => tool.id === currentToolId);
    
    if (!currentTool) {
        return;
    }

    // Find the category
    const category = TOOLS_REGISTRY.categories.find(cat => cat.id === currentTool.category);
    
    if (!category) {
        return;
    }

    // Create hub link section
    const hubLinkSection = document.createElement('div');
    hubLinkSection.className = 'category-hub-link';
    hubLinkSection.innerHTML = `
        <a href="/tools/hub/${category.id}/" class="hub-link-btn" title="View all ${category.name}">
            <span class="hub-link-icon">${category.icon}</span>
            <span class="hub-link-text">View all ${category.name}</span>
            <span class="hub-link-arrow">→</span>
        </a>
    `;

    // Insert before the related tools section
    relatedToolsSection.parentNode.insertBefore(hubLinkSection, relatedToolsSection);
});
