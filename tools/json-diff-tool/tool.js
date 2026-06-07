class JSONDiffTool {
    constructor() {
        this.json1 = document.getElementById('json1');
        this.json2 = document.getElementById('json2');
        this.compareBtn = document.getElementById('compareBtn');
        this.diffResults = document.getElementById('diffResults');
        this.diffOutput = document.getElementById('diffOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.compareBtn.addEventListener('click', () => this.compare());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
    }

    compare() {
        try {
            const obj1 = JSON.parse(this.json1.value);
            const obj2 = JSON.parse(this.json2.value);

            const diff = this.getDiff(obj1, obj2);
            this.diffOutput.value = diff;
            this.diffResults.style.display = 'block';
            showNotification('Comparison complete!', 'success');
        } catch (e) {
            showNotification('Invalid JSON format', 'error');
        }
    }

    getDiff(obj1, obj2, path = '') {
        let result = '';
        const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

        allKeys.forEach(key => {
            const currentPath = path ? `${path}.${key}` : key;
            const val1 = obj1 ? obj1[key] : undefined;
            const val2 = obj2 ? obj2[key] : undefined;

            if (!(key in (obj1 || {}))) {
                result += `[ADDED] ${currentPath}: ${JSON.stringify(val2)}\n`;
            } else if (!(key in (obj2 || {}))) {
                result += `[REMOVED] ${currentPath}: ${JSON.stringify(val1)}\n`;
            } else if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
                result += this.getDiff(val1, val2, currentPath);
            } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                result += `[MODIFIED] ${currentPath}: ${JSON.stringify(val1)} → ${JSON.stringify(val2)}\n`;
            }
        });

        return result || 'No differences found.';
    }

    copy() {
        navigator.clipboard.writeText(this.diffOutput.value).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.json1.value = '';
        this.json2.value = '';
        this.diffResults.style.display = 'none';
        this.diffOutput.value = '';
        this.json1.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JSONDiffTool();
});