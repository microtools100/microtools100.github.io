/**
 * DEPRECATED: This file has been superseded by shared-utilities.js
 * 
 * All functionality from this file has been migrated to the SharedUtilities class
 * in shared-utilities.js. This file is maintained only for backward compatibility.
 * 
 * MIGRATION GUIDE:
 * - window.MicroTools.utils.copyToClipboard() -> SharedUtilities.copyToClipboard()
 * - window.MicroTools.utils.showNotification() -> SharedUtilities.showNotification()
 * - window.MicroTools.utils.debounce() -> SharedUtilities.debounce()
 * 
 * To maintain backward compatibility, this file now re-exports from SharedUtilities
 */

// Create backward compatibility wrapper
document.addEventListener('DOMContentLoaded', () => {
    if (typeof SharedUtilities !== 'undefined') {
        // Create legacy namespace for backward compatibility
        window.MicroTools = window.MicroTools || {};
        window.MicroTools.utils = {
            copyToClipboard: (text, button) => SharedUtilities.copyToClipboard(text),
            showNotification: (msg, type) => SharedUtilities.showNotification(msg, type),
            debounce: (func, wait) => SharedUtilities.debounce(func, wait),
            generateRandomString: (len) => SharedUtilities.generateRandom(len),
            formatNumber: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            setWithExpiry: (key, value, ttl) => {
                const item = { value, expiry: Date.now() + ttl };
                localStorage.setItem(key, JSON.stringify(item));
            },
            getWithExpiry: (key) => {
                const itemStr = localStorage.getItem(key);
                if (!itemStr) return null;
                const item = JSON.parse(itemStr);
                if (Date.now() > item.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
                return item.value;
            }
        };
    }
});

console.warn('utils.js is deprecated. Use SharedUtilities from shared-utilities.js instead.');
