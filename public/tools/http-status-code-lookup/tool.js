class HTTPStatusCodeLookup {
    constructor() {
        this.searchCode = document.getElementById('searchCode');
        this.filterCategory = document.getElementById('filterCategory');
        this.container = document.getElementById('statusCodesContainer');

        this.codes = {
            '100': { name: 'Continue', description: 'Server received the initial request, client should proceed' },
            '101': { name: 'Switching Protocols', description: 'Server agreed to switch protocols' },
            '200': { name: 'OK', description: 'Request succeeded, response follows' },
            '201': { name: 'Created', description: 'Resource created successfully' },
            '204': { name: 'No Content', description: 'Request succeeded but no content to return' },
            '206': { name: 'Partial Content', description: 'Server delivering part of the resource' },
            '300': { name: 'Multiple Choices', description: 'Multiple response options available' },
            '301': { name: 'Moved Permanently', description: 'Resource permanently moved to new URL' },
            '302': { name: 'Found', description: 'Resource temporarily moved to different URL' },
            '304': { name: 'Not Modified', description: 'Cached version is still valid' },
            '307': { name: 'Temporary Redirect', description: 'Temporary redirect, maintain HTTP method' },
            '308': { name: 'Permanent Redirect', description: 'Permanent redirect, maintain HTTP method' },
            '400': { name: 'Bad Request', description: 'Server cannot process malformed request' },
            '401': { name: 'Unauthorized', description: 'Authentication required' },
            '403': { name: 'Forbidden', description: 'Server refuses to process the request' },
            '404': { name: 'Not Found', description: 'Requested resource not found' },
            '405': { name: 'Method Not Allowed', description: 'HTTP method not allowed for resource' },
            '408': { name: 'Request Timeout', description: 'Server timeout waiting for request' },
            '429': { name: 'Too Many Requests', description: 'Rate limit exceeded' },
            '500': { name: 'Internal Server Error', description: 'Server encountered unexpected error' },
            '501': { name: 'Not Implemented', description: 'Server does not support this functionality' },
            '502': { name: 'Bad Gateway', description: 'Invalid response from upstream server' },
            '503': { name: 'Service Unavailable', description: 'Server temporarily unavailable' },
            '504': { name: 'Gateway Timeout', description: 'Upstream server timeout' }
        };

        this.attachEventListeners();
        this.renderCodes();
    }

    attachEventListeners() {
        this.searchCode.addEventListener('input', () => this.filter());
        this.filterCategory.addEventListener('change', () => this.filter());
    }

    filter() {
        const searchTerm = this.searchCode.value.toLowerCase();
        const category = this.filterCategory.value;

        this.container.innerHTML = '';

        Object.entries(this.codes).forEach(([code, data]) => {
            const codeCategory = code.charAt(0);
            const matchesCategory = !category || codeCategory === category;
            const matchesSearch = !searchTerm || 
                code.includes(searchTerm) || 
                data.name.toLowerCase().includes(searchTerm) ||
                data.description.toLowerCase().includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                this.addCodeElement(code, data);
            }
        });
    }

    addCodeElement(code, data) {
        const div = document.createElement('div');
        div.className = 'status-code-item';
        div.style.cssText = 'padding: 12px; border-left: 4px solid var(--primary-color); background: var(--surface-color); margin: 8px 0; border-radius: 4px;';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 1.1em;">${code} - ${data.name}</strong>
                    <p style="margin: 4px 0; color: var(--text-secondary);">${data.description}</p>
                </div>
                <button class="copy-code-btn" data-code="${code}" style="padding: 6px 12px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Copy</button>
            </div>
        `;

        const copyBtn = div.querySelector('.copy-code-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
                showNotification('Copied!', 'success');
            });
        });

        this.container.appendChild(div);
    }

    renderCodes() {
        this.filter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HTTPStatusCodeLookup();
});