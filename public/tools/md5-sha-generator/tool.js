/**
 * MD5 & SHA Hash Generator
 * Generates MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes
 */

class MD5SHAGenerator {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.hashElements = {
            md5: document.getElementById('md5Hash'),
            sha1: document.getElementById('sha1Hash'),
            sha256: document.getElementById('sha256Hash'),
            sha384: document.getElementById('sha384Hash'),
            sha512: document.getElementById('sha512Hash')
        };

        this.currentHashes = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        // Generate on load
        this.generateHashes();
    }

    setupEventListeners() {
        this.textInput.addEventListener('input', () => this.generateHashes());
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        if (this.copyAllBtn) {
            this.copyAllBtn.addEventListener('click', () => this.copyAllHashes());
        }
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadHashes());
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+A in input to select all
            if ((e.ctrlKey || e.metaKey) && e.key === 'a' && document.activeElement === this.textInput) {
                e.preventDefault();
                this.textInput.select();
            }
            // Ctrl+Shift+C to copy all hashes
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
                e.preventDefault();
                this.copyAllHashes();
            }
        });
    }

    async generateHashes() {
        const text = this.textInput.value;
        
        if (!text) {
            this.clearHashDisplay();
            return;
        }

        try {
            const md5Result = md5(text);
            this.hashElements.md5.textContent = md5Result;
            this.currentHashes.md5 = md5Result;

            const sha1Result = await sha1(text);
            this.hashElements.sha1.textContent = sha1Result;
            this.currentHashes.sha1 = sha1Result;

            const sha256Result = await sha256(text);
            this.hashElements.sha256.textContent = sha256Result;
            this.currentHashes.sha256 = sha256Result;

            const sha384Result = await sha384(text);
            this.hashElements.sha384.textContent = sha384Result;
            this.currentHashes.sha384 = sha384Result;

            const sha512Result = await sha512(text);
            this.hashElements.sha512.textContent = sha512Result;
            this.currentHashes.sha512 = sha512Result;

        } catch (error) {
            console.error('Hash generation error:', error);
            SharedUtilities.showNotification('Error generating hashes', 'error');
            this.clearHashDisplay();
        }
    }

    clearHashDisplay() {
        Object.values(this.hashElements).forEach(el => {
            el.textContent = '-';
        });
        this.currentHashes = {};
    }

    copyToClipboard(hashType) {
        const text = this.currentHashes[hashType];
        if (!text) {
            SharedUtilities.showNotification('No hash to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            SharedUtilities.showNotification(`${hashType.toUpperCase()} hash copied to clipboard!`, 'success');
        }).catch(() => {
            SharedUtilities.showNotification('Failed to copy hash', 'error');
        });
    }

    copyAllHashes() {
        if (Object.keys(this.currentHashes).length === 0) {
            SharedUtilities.showNotification('No hashes to copy', 'warning');
            return;
        }

        const text = `MD5: ${this.currentHashes.md5 || '-'}
SHA-1: ${this.currentHashes.sha1 || '-'}
SHA-256: ${this.currentHashes.sha256 || '-'}
SHA-384: ${this.currentHashes.sha384 || '-'}
SHA-512: ${this.currentHashes.sha512 || '-'}`;

        navigator.clipboard.writeText(text).then(() => {
            SharedUtilities.showNotification('All hashes copied to clipboard!', 'success');
        }).catch(() => {
            SharedUtilities.showNotification('Failed to copy hashes', 'error');
        });
    }

    clearAll() {
        this.textInput.value = '';
        this.clearHashDisplay();
        this.textInput.focus();
        SharedUtilities.showNotification('Input cleared', 'info');
    }

    loadExample() {
        this.textInput.value = 'Hello World';
        this.generateHashes();
        SharedUtilities.showNotification('Example loaded', 'info');
    }

    downloadHashes() {
        if (Object.keys(this.currentHashes).length === 0) {
            SharedUtilities.showNotification('No hashes to download', 'warning');
            return;
        }

        const text = `MD5 & SHA Hash Generator Output
Generated: ${new Date().toLocaleString()}

MD5: ${this.currentHashes.md5 || '-'}
SHA-1: ${this.currentHashes.sha1 || '-'}
SHA-256: ${this.currentHashes.sha256 || '-'}
SHA-384: ${this.currentHashes.sha384 || '-'}
SHA-512: ${this.currentHashes.sha512 || '-'}`;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'hashes.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        SharedUtilities.showNotification('Hashes downloaded', 'success');
    }
}

/**
 * MD5 Hash Implementation
 */
function md5(str) {
    function rotateLeft(n, b) {
        return (n << b) | (n >>> (32 - b));
    }

    function addUnsigned(x, y) {
        const x8 = x & 0x80000000;
        const y8 = y & 0x80000000;
        const x4 = x & 0x40000000;
        const y4 = y & 0x40000000;
        const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
        
        if (x4 & y4) {
            return result ^ 0x80000000 ^ x8 ^ y8;
        }
        if (x4 | y4) {
            if (result & 0x40000000) {
                return result ^ 0x40000000 ^ x8 ^ y8;
            }
            return result ^ 0x80000000 ^ x8 ^ y8;
        }
        return result ^ x8 ^ y8;
    }

    function md5cmn(q, a, b, x, s, t) {
        a = addUnsigned(a, addUnsigned(addUnsigned(q, x), t));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function binl2hex(binarray) {
        const hex_chars = "0123456789abcdef";
        let result = "";
        for (let i = 0; i < binarray.length * 4; i++) {
            result += hex_chars.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                      hex_chars.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return result;
    }

    function str2binl(str) {
        const nblk = ((str.length + 8) >> 6) + 1;
        const blks = new Array(nblk * 16);
        for (let i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (let i = 0; i < str.length; i++)
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[str.length >> 2] |= 0x80 << ((str.length % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }

    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    const x = str2binl(str);

    for (let i = 0; i < x.length; i += 16) {
        const oldA = a, oldB = b, oldC = c, oldD = d;

        a = md5ff(a, b, c, d, x[i], S11, 0xd76aa478);
        d = md5ff(d, a, b, c, x[i + 1], S12, 0xe8c7b756);
        c = md5ff(c, d, a, b, x[i + 2], S13, 0x242070db);
        b = md5ff(b, c, d, a, x[i + 3], S14, 0xc1bdceee);
        a = md5ff(a, b, c, d, x[i + 4], S11, 0xf57c0faf);
        d = md5ff(d, a, b, c, x[i + 5], S12, 0x4787c62a);
        c = md5ff(c, d, a, b, x[i + 6], S13, 0xa8304613);
        b = md5ff(b, c, d, a, x[i + 7], S14, 0xfd469501);
        a = md5ff(a, b, c, d, x[i + 8], S11, 0x698098d8);
        d = md5ff(d, a, b, c, x[i + 9], S12, 0x8b44f7af);
        c = md5ff(c, d, a, b, x[i + 10], S13, 0xffff5bb1);
        b = md5ff(b, c, d, a, x[i + 11], S14, 0x895cd7be);
        a = md5ff(a, b, c, d, x[i + 12], S11, 0x6b901122);
        d = md5ff(d, a, b, c, x[i + 13], S12, 0xfd987193);
        c = md5ff(c, d, a, b, x[i + 14], S13, 0xa679438e);
        b = md5ff(b, c, d, a, x[i + 15], S14, 0x49b40821);

        a = md5gg(a, b, c, d, x[i + 1], S21, 0xf61e2562);
        d = md5gg(d, a, b, c, x[i + 6], S22, 0xc040b340);
        c = md5gg(c, d, a, b, x[i + 11], S23, 0x265e5a51);
        b = md5gg(b, c, d, a, x[i], S24, 0xe9b6c7aa);
        a = md5gg(a, b, c, d, x[i + 5], S21, 0xd62f105d);
        d = md5gg(d, a, b, c, x[i + 10], S22, 0x02441453);
        c = md5gg(c, d, a, b, x[i + 15], S23, 0xd8a1e681);
        b = md5gg(b, c, d, a, x[i + 4], S24, 0xe7d3fbc8);
        a = md5gg(a, b, c, d, x[i + 9], S21, 0x21e1cde6);
        d = md5gg(d, a, b, c, x[i + 14], S22, 0xc33707d6);
        c = md5gg(c, d, a, b, x[i + 3], S23, 0xf4d50d87);
        b = md5gg(b, c, d, a, x[i + 8], S24, 0x455a14ed);
        a = md5gg(a, b, c, d, x[i + 13], S21, 0xa9e3e905);
        d = md5gg(d, a, b, c, x[i + 2], S22, 0xfcefa3f8);
        c = md5gg(c, d, a, b, x[i + 7], S23, 0x676f02d9);
        b = md5gg(b, c, d, a, x[i + 12], S24, 0x8d2a4c8a);

        a = md5hh(a, b, c, d, x[i + 5], S31, 0xfffa3942);
        d = md5hh(d, a, b, c, x[i + 8], S32, 0x8771f681);
        c = md5hh(c, d, a, b, x[i + 11], S33, 0x6d9d6122);
        b = md5hh(b, c, d, a, x[i + 14], S34, 0xfde5380c);
        a = md5hh(a, b, c, d, x[i + 1], S31, 0xa4beea44);
        d = md5hh(d, a, b, c, x[i + 4], S32, 0x4bdecfa9);
        c = md5hh(c, d, a, b, x[i + 7], S33, 0xf6bb4b60);
        b = md5hh(b, c, d, a, x[i + 10], S34, 0xbebfbc70);
        a = md5hh(a, b, c, d, x[i + 13], S31, 0x289b7ec6);
        d = md5hh(d, a, b, c, x[i], S32, 0xeaa127fa);
        c = md5hh(c, d, a, b, x[i + 3], S33, 0xd4ef3085);
        b = md5hh(b, c, d, a, x[i + 6], S34, 0x04881d05);
        a = md5hh(a, b, c, d, x[i + 9], S31, 0xd9d4d039);
        d = md5hh(d, a, b, c, x[i + 12], S32, 0xe6db99e5);
        c = md5hh(c, d, a, b, x[i + 15], S33, 0x1fa27cf8);
        b = md5hh(b, c, d, a, x[i + 2], S34, 0xc4ac5665);

        a = md5ii(a, b, c, d, x[i], S41, 0xf4292244);
        d = md5ii(d, a, b, c, x[i + 7], S42, 0x432aff97);
        c = md5ii(c, d, a, b, x[i + 14], S43, 0xab9423a7);
        b = md5ii(b, c, d, a, x[i + 5], S44, 0xfc93a039);
        a = md5ii(a, b, c, d, x[i + 12], S41, 0x655b59c3);
        d = md5ii(d, a, b, c, x[i + 3], S42, 0x8f0ccc92);
        c = md5ii(c, d, a, b, x[i + 10], S43, 0xffeff47d);
        b = md5ii(b, c, d, a, x[i + 1], S44, 0x85845dd1);
        a = md5ii(a, b, c, d, x[i + 8], S41, 0x6fa87e4f);
        d = md5ii(d, a, b, c, x[i + 15], S42, 0xfe2ce6e0);
        c = md5ii(c, d, a, b, x[i + 6], S43, 0xa3014314);
        b = md5ii(b, c, d, a, x[i + 13], S44, 0x4e0811a1);
        a = md5ii(a, b, c, d, x[i + 4], S41, 0xf7537e82);
        d = md5ii(d, a, b, c, x[i + 11], S42, 0xbd3af235);
        c = md5ii(c, d, a, b, x[i + 2], S43, 0x2ad7d2bb);
        b = md5ii(b, c, d, a, x[i + 9], S44, 0xeb86d391);

        a = addUnsigned(a, oldA);
        b = addUnsigned(b, oldB);
        c = addUnsigned(c, oldC);
        d = addUnsigned(d, oldD);
    }

    return binl2hex([a, b, c, d]);
}

/**
 * SHA-1 Hash using WebCrypto API
 */
async function sha1(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-1', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-256 Hash using WebCrypto API
 */
async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-384 Hash using WebCrypto API
 */
async function sha384(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-384', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-512 Hash using WebCrypto API
 */
async function sha512(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-512', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Global copy function for individual hashes
 */
function copyHash(hashId) {
    const element = document.getElementById(hashId);
    const text = element.textContent;
    
    if (text === '-') {
        SharedUtilities.showNotification('Nothing to copy', 'warning');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        SharedUtilities.showNotification('Hash copied to clipboard!', 'success');
    }).catch(() => {
        SharedUtilities.showNotification('Failed to copy', 'error');
    });
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.md5SHAGenerator = new MD5SHAGenerator();
});
