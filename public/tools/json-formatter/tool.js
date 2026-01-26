document.addEventListener('DOMContentLoaded', function() {
    const inputJSON = document.getElementById('inputJSON');
    const outputJSON = document.getElementById('outputJSON');
    const indentSize = document.getElementById('indentSize');
    const sortKeys = document.getElementById('sortKeys');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const validationStatus = document.getElementById('validationStatus');

    formatBtn.addEventListener('click', formatJSON);
    minifyBtn.addEventListener('click', minifyJSON);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyOutput);
    downloadBtn.addEventListener('click', downloadJSON);
    
    // Auto-format on input change and option changes
    inputJSON.addEventListener('input', formatJSON);
    indentSize.addEventListener('change', formatJSON);
    sortKeys.addEventListener('change', formatJSON);

    function formatJSON() {
        try {
            const input = inputJSON.value.trim();
            if (!input) {
                showError('Please paste some JSON');
                return;
            }

            let parsed = JSON.parse(input);

            // Sort keys if enabled
            if (sortKeys.checked) {
                parsed = sortObjectKeys(parsed);
            }

            // Get indentation
            let indent = getIndent();

            // Format with indentation
            const formatted = JSON.stringify(parsed, null, indent);
            outputJSON.textContent = formatted;

            showValid('JSON is valid ✓');
            
            // Auto-copy to clipboard with notification
            if (formatted) {
                navigator.clipboard.writeText(formatted).then(() => {
                    if (window.MicroTools?.utils?.showNotification) {
                        window.MicroTools.utils.showNotification('Copied to clipboard!', 'success');
                    }
                }).catch(err => {
                    console.log('Clipboard write failed:', err);
                });
            }
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
            outputJSON.textContent = '';
        }
    }

    function minifyJSON() {
        try {
            const input = inputJSON.value.trim();
            if (!input) {
                showError('Please paste some JSON');
                return;
            }

            let parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            outputJSON.textContent = minified;

            showValid('JSON minified ✓');
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
            outputJSON.textContent = '';
        }
    }

    function sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => sortObjectKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }

    function getIndent() {
        const size = indentSize.value;
        if (size === 'tab') {
            return '\t';
        }
        return parseInt(size);
    }

    function clearAll() {
        inputJSON.value = '';
        outputJSON.textContent = '';
        validationStatus.classList.add('hidden');
        inputJSON.focus();
    }

    function copyOutput() {
        const text = outputJSON.textContent;
        if (!text) {
            alert('No JSON to copy. Please format some JSON first.');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        });
    }

    function downloadJSON() {
        const text = outputJSON.textContent;
        if (!text) {
            alert('No JSON to download. Please format some JSON first.');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'formatted.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function showValid(message) {
        validationStatus.textContent = message;
        validationStatus.classList.remove('hidden', 'invalid');
        validationStatus.classList.add('valid');
    }

    function showError(message) {
        validationStatus.textContent = message;
        validationStatus.classList.remove('hidden', 'valid');
        validationStatus.classList.add('invalid');
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease-in-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
});
