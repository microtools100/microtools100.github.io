class MD5SHAGenerator {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        
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
    }

    setupEventListeners() {
        this.textInput.addEventListener('input', () => this.generateHashes());
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        if (this.copyAllBtn) {
            this.copyAllBtn.addEventListener('click', () => this.copyAllHashes());
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
}

// Simple MD5 implementation
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
                return result ^ 0xC0000000 ^ x8 ^ y8;
            } else {
                return result ^ 0x40000000 ^ x8 ^ y8;
            }
        } else {
            return result ^ x8 ^ y8;
        }
    }

    function F(x, y, z) { return (x & y) | (~x & z); }
    function G(x, y, z) { return (x & z) | (y & ~z); }
    function H(x, y, z) { return x ^ y ^ z; }
    function I(x, y, z) { return y ^ (x | ~z); }

    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    let A = 0x67452301;
    let B = 0xefcdab89;
    let C = 0x98badcfe;
    let D = 0x10325476;

    const X = str.split('').map(c => c.charCodeAt(0));
    const ml = X.length * 8;
    const pad = 64 - ((X.length + 8) % 64);
    
    X.push(0x80);
    for (let i = 0; i < pad - 1; i++) X.push(0);
    X.push(ml & 0xff);
    X.push((ml >>> 8) & 0xff);
    X.push((ml >>> 16) & 0xff);
    X.push((ml >>> 24) & 0xff);

    for (let i = 0; i < X.length; i += 16) {
        const AA = A, BB = B, CC = C, DD = D;
        
        A = FF(A, B, C, D, X[i], S11, 0xd76aa478);
        D = FF(D, A, B, C, X[i + 1], S12, 0xe8c7b756);
        C = FF(C, D, A, B, X[i + 2], S13, 0x242070db);
        B = FF(B, C, D, A, X[i + 3], S14, 0xc1bdceee);
        A = FF(A, B, C, D, X[i + 4], S11, 0xf57c0faf);
        D = FF(D, A, B, C, X[i + 5], S12, 0x4787c62a);
        C = FF(C, D, A, B, X[i + 6], S13, 0xa8304613);
        B = FF(B, C, D, A, X[i + 7], S14, 0xfd469501);
        A = FF(A, B, C, D, X[i + 8], S11, 0x698098d8);
        D = FF(D, A, B, C, X[i + 9], S12, 0x8b44f7af);
        C = FF(C, D, A, B, X[i + 10], S13, 0xffff5bb1);
        B = FF(B, C, D, A, X[i + 11], S14, 0x895cd7be);
        A = FF(A, B, C, D, X[i + 12], S11, 0x6b901122);
        D = FF(D, A, B, C, X[i + 13], S12, 0xfd987193);
        C = FF(C, D, A, B, X[i + 14], S13, 0xa679438e);
        B = FF(B, C, D, A, X[i + 15], S14, 0x49b40821);

        A = GG(A, B, C, D, X[i + 1], S21, 0xf61e2562);
        D = GG(D, A, B, C, X[i + 6], S22, 0xc040b340);
        C = GG(C, D, A, B, X[i + 11], S23, 0x265e5a51);
        B = GG(B, C, D, A, X[i], S24, 0xe9b6c7aa);
        A = GG(A, B, C, D, X[i + 5], S21, 0xd62f105d);
        D = GG(D, A, B, C, X[i + 10], S22, 0x2441453);
        C = GG(C, D, A, B, X[i + 15], S23, 0xd8a1e681);
        B = GG(B, C, D, A, X[i + 4], S24, 0xe7d3fbc8);

        A = addUnsigned(A, AA);
        B = addUnsigned(B, BB);
        C = addUnsigned(C, CC);
        D = addUnsigned(D, DD);
    }

    function toHexString(num) {
        let hex = '';
        for (let i = 0; i < 4; i++) {
            const byte = (num >>> (i * 8)) & 0xff;
            hex += ('0' + byte.toString(16)).slice(-2);
        }
        return hex;
    }

    return toHexString(A) + toHexString(B) + toHexString(C) + toHexString(D);
}

// SHA implementations using SubtleCrypto API
async function sha1(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-1', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha384(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-384', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha512(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-512', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

class MD5SHAGenerator {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.init();
    }

    init() {
        this.textInput.addEventListener('input', () => this.generateHashes());
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
}

function copyHash(elementId) {
    const text = document.getElementById(elementId).textContent;
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

document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.md5SHAGenerator = new MD5SHAGenerator();
});
