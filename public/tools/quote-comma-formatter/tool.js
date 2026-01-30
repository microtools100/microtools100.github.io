document.addEventListener('DOMContentLoaded', function() {
    const inputData = document.getElementById('inputData');
    const outputData = document.getElementById('outputData');
    const quoteType = document.getElementById('quoteType');
    const delimiter = document.getElementById('delimiter');
    const trimWhitespace = document.getElementById('trimWhitespace');
    const removeEmpty = document.getElementById('removeEmpty');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const inputCount = document.getElementById('inputCount');
    const outputCount = document.getElementById('outputCount');
    const keystrokeDelay = SharedUtilities.createKeystrokeDelay(() => autoCopy());

    // Update character count for input
    inputData.addEventListener('input', function() {
        inputCount.textContent = this.value.length;
    });

    // Update character count for output
    outputData.addEventListener('input', function() {
        outputCount.textContent = this.value.length;
    });

    // Format button
    formatBtn.addEventListener('click', formatData);

    // Clear button
    clearBtn.addEventListener('click', function() {
        inputData.value = '';
        outputData.value = '';
        inputCount.textContent = '0';
        outputCount.textContent = '0';
        inputData.focus();
    });

    // Download button
    downloadBtn.addEventListener('click', downloadText);

    // Real-time formatting as user types with debounce
    inputData.addEventListener('input', debouncedFormatData);
    quoteType.addEventListener('change', formatData);
    delimiter.addEventListener('change', formatData);
    trimWhitespace.addEventListener('change', formatData);
    removeEmpty.addEventListener('change', formatData);

    function debouncedFormatData() {
        formatData();
        keystrokeDelay.schedule();
    }

    function autoCopy() {
        const result = outputData.value;
        if (result) {
            navigator.clipboard.writeText(result).then(() => {
                SharedUtilities.showNotification('Copied to clipboard!', 'success');
            });
        }
    }

    function formatData() {
        let lines = inputData.value.split('\n');

        // Remove empty lines if option is checked
        if (removeEmpty.checked) {
            lines = lines.filter(line => line.trim() !== '');
        }

        // Trim whitespace if option is checked
        if (trimWhitespace.checked) {
            lines = lines.map(line => line.trim());
        }

        // Apply quotes
        const quote = getQuote();
        lines = lines.map(line => {
            if (line === '') return '';
            return quote + line + quote;
        });

        // Join with delimiter
        const delim = delimiter.value;
        const result = lines.join(delim);

        outputData.value = result;
        outputCount.textContent = result.length;
    }

    function getQuote() {
        const type = quoteType.value;
        switch(type) {
            case 'single': return "'";
            case 'double': return '"';
            case 'backtick': return '`';
            case 'none': return '';
            default: return "'";
        }
    }

    function downloadText() {
        const text = outputData.value;
        if (!text) {
            alert('No output to download. Please format some data first.');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'formatted-data.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // Copy to clipboard functionality
    setupCopyButtons();
    
    function setupCopyButtons() {
        const copyInputBtn = document.createElement('button');
        const copyOutputBtn = document.createElement('button');

        copyInputBtn.className = 'copy-btn';
        copyOutputBtn.className = 'copy-btn';
        copyInputBtn.textContent = '📋 Copy Input';
        copyOutputBtn.textContent = '📋 Copy Output';

        // Add copy buttons if needed
        if (inputData.parentElement) {
            inputData.parentElement.appendChild(copyInputBtn);
        }
        if (outputData.parentElement) {
            outputData.parentElement.appendChild(copyOutputBtn);
        }

        copyOutputBtn.addEventListener('click', function() {
            if (outputData.value) {
                navigator.clipboard.writeText(outputData.value).then(() => {
                    showNotification('Copied to clipboard!');
                });
            }
        });
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

    // Initialize input character count
    inputCount.textContent = inputData.value.length;
});
