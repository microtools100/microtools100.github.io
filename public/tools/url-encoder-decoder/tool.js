document.addEventListener('DOMContentLoaded', function() {
    const inputURL = document.getElementById('inputURL');
    const outputURL = document.getElementById('outputURL');
    const encodeMode = document.getElementById('encodeMode');
    const decodeMode = document.getElementById('decodeMode');
    const processBtn = document.getElementById('processBtn');
    const processBtnText = document.getElementById('processBtnText');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const inputLabel = document.getElementById('inputLabel');
    const outputLabel = document.getElementById('outputLabel');

    // Update button text and labels when mode changes
    encodeMode.addEventListener('change', updateMode);
    decodeMode.addEventListener('change', updateMode);

    // Process button
    processBtn.addEventListener('click', process);

    // Clear button
    clearBtn.addEventListener('click', function() {
        inputURL.value = '';
        outputURL.value = '';
        inputURL.focus();
    });

    // Copy button
    copyBtn.addEventListener('click', copyOutput);

    // Download button
    downloadBtn.addEventListener('click', downloadText);

    // Real-time encoding/decoding on input
    inputURL.addEventListener('input', process);
    encodeMode.addEventListener('change', process);
    decodeMode.addEventListener('change', process);

    function updateMode() {
        const isEncode = encodeMode.checked;
        inputLabel.textContent = isEncode ? 'Enter URL to Encode:' : 'Enter URL to Decode:';
        outputLabel.textContent = isEncode ? 'Encoded Result:' : 'Decoded Result:';
        processBtnText.textContent = isEncode ? 'Encode URL' : 'Decode URL';
    }

    function process() {
        const input = inputURL.value;
        if (!input) {
            outputURL.value = '';
            return;
        }

        try {
            let result;
            if (encodeMode.checked) {
                result = encodeURIComponent(input);
            } else {
                result = decodeURIComponent(input);
            }
            outputURL.value = result;
            
            // Auto-copy to clipboard with notification
            if (result) {
                navigator.clipboard.writeText(result).then(() => {
                    if (window.MicroTools?.utils?.showNotification) {
                        window.MicroTools.utils.showNotification('Copied to clipboard!', 'success');
                    }
                }).catch(err => {
                    console.log('Clipboard write failed:', err);
                });
            }
        } catch (error) {
            outputURL.value = 'Error: ' + error.message;
        }
    }

    function copyOutput() {
        const text = outputURL.value;
        if (!text) {
            alert('No output to copy.');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        });
    }

    function downloadText() {
        const text = outputURL.value;
        if (!text) {
            alert('No output to download.');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', encodeMode.checked ? 'encoded.txt' : 'decoded.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
