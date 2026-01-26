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
}

// Make available globally
window.SharedUtils = SharedUtilities;
