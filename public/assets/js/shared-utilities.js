/**
 * Shared Utility Functions for MicroTools
 * Used across all tools to avoid code duplication
 */

class SharedUtilities {
    /**
     * Copy text to clipboard with notification
     * @param {string} text - Text to copy
     * @param {string} message - Optional notification message
     * @param {string} type - Notification type ('success', 'error', 'info')
     */
    static async copyToClipboard(text, message = 'Copied to clipboard!', type = 'success') {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification(message, type);
            return true;
        } catch (err) {
            console.error('Copy to clipboard failed:', err);
            this.showNotification('Failed to copy', 'error');
            return false;
        }
    }

    /**
     * Copy text to clipboard silently (no notification)
     * Uses modern clipboard API with fallback to execCommand
     * @param {string} text - Text to copy
     * @param {Function} onSuccess - Optional callback on success
     * @param {Function} onError - Optional callback on error
     */
    static copyToClipboardSilently(text, onSuccess = null, onError = null) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        onSuccess?.(text);
                    })
                    .catch(() => {
                        this.fallbackCopy(text);
                        onError?.();
                    });
            } else {
                this.fallbackCopy(text);
                onError?.();
            }
        } catch (err) {
            this.fallbackCopy(text);
            onError?.();
        }
    }

    /**
     * Fallback copy method using execCommand
     * Used when modern clipboard API is not available
     * @param {string} text - Text to copy
     */
    static fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = `
            position: fixed;
            left: -9999px;
            top: -9999px;
            opacity: 0;
            width: 2em;
            height: 2em;
            padding: 0;
            border: none;
        `;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.setSelectionRange(0, textarea.value.length);
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textarea);
    }

    /**
     * Show notification to user
     * @param {string} message - Notification message
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms (default: 3000)
     */
    static showNotification(message, type = 'info', duration = 3000) {
        // Try to use existing notification system if available
        if (window.MicroTools?.utils?.showNotification) {
            window.MicroTools.utils.showNotification(message, type);
            return;
        }

        // Fallback: Create simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            background-color: ${this.getNotificationColor(type)};
            color: white;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    /**
     * Get notification color based on type
     * @param {string} type - Notification type
     * @returns {string} Color code
     */
    static getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    static debounce(func, wait = 300) {
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

    /**
     * Throttle function to limit function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {Function} Throttled function
     */
    static throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Download content as file
     * @param {string} content - Content to download
     * @param {string} filename - Filename for download
     * @param {string} type - MIME type (default: 'text/plain')
     */
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    /**
     * Format file size for display
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Count words in text
     * @param {string} text - Text to count
     * @returns {number} Word count
     */
    static countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Count characters in text (excluding whitespace)
     * @param {string} text - Text to count
     * @param {boolean} includeSpaces - Include spaces in count
     * @returns {number} Character count
     */
    static countCharacters(text, includeSpaces = false) {
        if (includeSpaces) {
            return text.length;
        }
        return text.replace(/\s/g, '').length;
    }

    /**
     * Escape HTML entities
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Unescape HTML entities
     * @param {string} text - Text to unescape
     * @returns {string} Unescaped text
     */
    static unescapeHTML(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    /**
     * Validate JSON string
     * @param {string} jsonString - JSON string to validate
     * @returns {Object} { valid: boolean, error: string|null, data: any }
     */
    static validateJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            return { valid: true, error: null, data };
        } catch (error) {
            return { valid: false, error: error.message, data: null };
        }
    }

    /**
     * Format JSON with indentation
     * @param {string} jsonString - JSON string
     * @param {number|string} indent - Indentation (number of spaces or 'tab')
     * @returns {string} Formatted JSON
     */
    static formatJSON(jsonString, indent = 2) {
        try {
            const data = JSON.parse(jsonString);
            const indentStr = indent === 'tab' ? '\t' : ' '.repeat(indent);
            return JSON.stringify(data, null, indentStr);
        } catch (error) {
            throw new Error('Invalid JSON: ' + error.message);
        }
    }

    /**
     * Minify JSON string
     * @param {string} jsonString - JSON string
     * @returns {string} Minified JSON
     */
    static minifyJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            return JSON.stringify(data);
        } catch (error) {
            throw new Error('Invalid JSON: ' + error.message);
        }
    }

    /**
     * Get element safely with fallback
     * @param {string} id - Element ID
     * @param {HTMLElement} parent - Optional parent element
     * @returns {HTMLElement|null} Element or null
     */
    static getElement(id, parent = document) {
        return parent.getElementById ? parent.getElementById(id) : parent.querySelector(`#${id}`);
    }

    /**
     * Get multiple elements safely
     * @param {Array<string>} ids - Array of element IDs
     * @param {HTMLElement} parent - Optional parent element
     * @returns {Object} Object with IDs as keys and elements as values
     */
    static getElements(ids, parent = document) {
        const elements = {};
        ids.forEach(id => {
            elements[id] = this.getElement(id, parent);
        });
        return elements;
    }

    /**
     * Setup keyboard shortcut
     * @param {string} key - Key to listen for
     * @param {Function} callback - Callback function
     * @param {boolean} ctrlKey - Require Ctrl key
     * @param {boolean} shiftKey - Require Shift key
     */
    static setupShortcut(key, callback, ctrlKey = false, shiftKey = false) {
        document.addEventListener('keydown', (e) => {
            if (e.key === key && 
                e.ctrlKey === ctrlKey && 
                e.shiftKey === shiftKey) {
                e.preventDefault();
                callback(e);
            }
        });
    }

    /**
     * Show loading state on element
     * @param {HTMLElement} element - Element to show loading on
     * @param {string} loadingText - Loading text (default: 'Loading...')
     */
    static showLoading(element, loadingText = 'Loading...') {
        if (!element) return;
        element.disabled = true;
        element.textContent = loadingText;
        element.classList.add('loading');
    }

    /**
     * Hide loading state on element
     * @param {HTMLElement} element - Element to hide loading from
     * @param {string} originalText - Original text to restore
     */
    static hideLoading(element, originalText = '') {
        if (!element) return;
        element.disabled = false;
        element.textContent = originalText;
        element.classList.remove('loading');
    }

    /**
     * Clear input fields
     * @param {Array<HTMLElement>} elements - Input elements to clear
     */
    static clearInputs(elements = []) {
        elements.forEach(elem => {
            if (elem) {
                if (elem.tagName === 'TEXTAREA' || elem.tagName === 'INPUT') {
                    elem.value = '';
                } else {
                    elem.textContent = '';
                }
            }
        });
    }

    /**
     * Validate input length
     * @param {string} text - Text to validate
     * @param {number} maxLength - Maximum allowed length
     * @param {number} minLength - Minimum required length
     * @returns {Object} { valid: boolean, message: string }
     */
    static validateLength(text, maxLength = 10000, minLength = 1) {
        if (text.length < minLength) {
            return { 
                valid: false, 
                message: `Minimum ${minLength} character${minLength > 1 ? 's' : ''} required` 
            };
        }
        if (text.length > maxLength) {
            return { 
                valid: false, 
                message: `Maximum ${maxLength} characters allowed` 
            };
        }
        return { valid: true, message: '' };
    }

    /**
     * Format time duration
     * @param {number} seconds - Total seconds
     * @returns {string} Formatted time (e.g., "1h 30m 45s")
     */
    static formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

        return parts.join(' ');
    }

    /**
     * Generate random string
     * @param {number} length - Length of string
     * @param {string} charset - Character set to use
     * @returns {string} Random string
     */
    static generateRandom(length = 10, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    }

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if in viewport
     */
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Create a keystroke delay handler for debounced auto-copy
     * Clears existing timeout and schedules new copy after delay
     * @param {Function} callback - Function to execute after delay
     * @param {number} delayMs - Delay in milliseconds (default 500ms)
     * @returns {Object} Object with schedule method and timeout reference
     */
    static createKeystrokeDelay(callback, delayMs = 500) {
        let timeout = null;

        return {
            schedule: function() {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(callback, delayMs);
            },
            cancel: function() {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            },
            reset: function() {
                this.cancel();
            }
        };
    }

    /**
     * Schedule auto-copy to clipboard with keystroke delay
     * @param {HTMLElement} outputElement - Element containing text to copy
     * @param {number} delayMs - Delay in milliseconds (default 500ms)
     * @returns {Function} Function to call on keystroke to schedule copy
     */
    static createAutoCopyScheduler(outputElement, delayMs = 500) {
        let timeout = null;

        return function scheduleAutoCopy() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                const text = outputElement.value || outputElement.textContent;
                if (text) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            SharedUtilities.showNotification('Copied to clipboard', 'success');
                        })
                        .catch(() => {
                            SharedUtilities.showNotification('Failed to copy', 'error');
                        });
                }
            }, delayMs);
        };
    }

    /**
     * Clear multiple input/output elements and show notification
     * @param {Object} elements - Object with input/output element references
     * @param {Object} options - Configuration options
     * @param {string} options.message - Notification message (default: 'Cleared')
     * @param {Function} options.onClear - Optional callback after clearing
     */
    static clearElements(elements = {}, options = {}) {
        const {
            message = 'Cleared',
            onClear = null
        } = options;

        // Clear all provided elements
        Object.values(elements).forEach(elem => {
            if (elem && (elem.tagName === 'TEXTAREA' || elem.tagName === 'INPUT')) {
                elem.value = '';
            }
        });

        // Show notification
        this.showNotification(message, 'info');

        // Call optional callback
        onClear?.();
    }

    /**
     * Download content as a file
     * @param {string} content - Content to download
     * @param {string} filename - Filename for the download
     * @param {string} mimeType - MIME type (default: 'text/plain')
     * @param {Object} options - Additional options
     * @param {boolean} options.showNotification - Show notification after download (default: true)
     * @param {string} options.successMessage - Custom success message
     */
    static downloadAsFile(content, filename, mimeType = 'text/plain', options = {}) {
        const {
            showNotification: shouldNotify = true,
            successMessage = 'File downloaded successfully'
        } = options;

        if (!content) {
            this.showNotification('Nothing to download', 'warning');
            return false;
        }

        try {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (shouldNotify) {
                this.showNotification(successMessage, 'success');
            }
            return true;
        } catch (err) {
            console.error('Download failed:', err);
            this.showNotification('Download failed', 'error');
            return false;
        }
    }

    /**
     * Update character count display elements
     * @param {HTMLElement} inputElement - Input element to count from
     * @param {Object} displayElements - Object with display element references
     * @param {Object} options - Additional options
     * @param {boolean} options.countWords - Also count words (default: false)
     */
    static updateCharacterCount(inputElement, displayElements = {}, options = {}) {
        const {
            countWords = false
        } = options;

        if (!inputElement) return;

        const text = inputElement.value || '';
        const charCount = text.length;
        const wordCount = this.countWords(text);

        // Update character count display
        if (displayElements.charCount) {
            displayElements.charCount.textContent = charCount;
        }

        // Update word count display if requested
        if (countWords && displayElements.wordCount) {
            displayElements.wordCount.textContent = wordCount;
        }
    }

    /**
     * Setup keyboard shortcuts for a tool
     * @param {Object} shortcuts - Keyboard shortcuts configuration
     * @example
     * SharedUtilities.setupKeyboardShortcuts({
     *   'Ctrl+Enter': () => this.convert(),
     *   'Escape': () => this.clear(),
     *   'Ctrl+E': () => this.loadExample()
     * });
     */
    static setupKeyboardShortcuts(shortcuts = {}) {
        document.addEventListener('keydown', (e) => {
            // Determine key combination
            const parts = [];
            if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
            if (e.shiftKey) parts.push('Shift');
            if (e.altKey) parts.push('Alt');
            
            // Handle single keys
            let key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === 'Enter') parts.push('Enter');
            else if (key === 'Escape') parts.push('Escape');
            else if (key === 'e' || key === 'E') parts.push('E');
            
            const combination = parts.join('+');

            // Check for matching shortcut
            if (shortcuts[combination]) {
                e.preventDefault();
                shortcuts[combination](e);
            }
        });
    }
}

// Make available globally
window.SharedUtils = SharedUtilities;
