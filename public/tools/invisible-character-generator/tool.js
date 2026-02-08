class InvisibleCharacterGenerator {
    constructor() {
        this.characters = [
            { name: 'Zero-Width Space', char: '\u200B', code: 'U+200B' },
            { name: 'Zero-Width Joiner', char: '\u200D', code: 'U+200D' },
            { name: 'Zero-Width Non-Joiner', char: '\u200C', code: 'U+200C' },
            { name: 'Word Joiner', char: '\u2060', code: 'U+2060' },
            { name: 'Soft Hyphen', char: '\u00AD', code: 'U+00AD' },
            { name: 'Non-Breaking Space', char: '\u00A0', code: 'U+00A0' }
        ];

        this.container = document.getElementById('charactersContainer');
        this.render();
    }

    render() {
        this.characters.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 12px; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 4px;';
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <p style="margin: 4px 0; color: var(--text-secondary); font-size: 0.9em;">${item.code}</p>
                    <div style="width: 100%; padding: 8px; margin: 8px 0; font-family: monospace; border: 1px solid var(--border-color); border-radius: 4px; background: var(--background-color); color: var(--text-secondary); text-align: center; min-height: 50px; display: flex; align-items: center; justify-content: center;">
                        (invisible character - click Copy to use it)
                    </div>
                    <button class="copy-btn" data-char="${item.char}" style="width: 100%; padding: 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; transition: all 0.2s;">Copy Character</button>
                </div>
            `;

            const btn = div.querySelector('.copy-btn');
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(item.char).then(() => {
                    SharedUtilities.showNotification(`Copied: ${item.name}`, 'success');
                }).catch(() => {
                    SharedUtilities.showNotification(`Failed to copy ${item.name}`, 'error');
                });
            });
            
            // Add hover effect
            btn.addEventListener('mouseover', () => {
                btn.style.opacity = '0.9';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.opacity = '1';
            });

            this.container.appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InvisibleCharacterGenerator();
});