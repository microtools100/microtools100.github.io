/**
 * Unit Tests for SharedUtilities
 * Tests all 20+ utility functions with comprehensive coverage
 * Run with: jest shared-utilities.test.js
 */

describe('SharedUtilities', () => {
    
    // Mock DOM elements and methods
    beforeEach(() => {
        // Clear DOM
        document.body.innerHTML = '';
        
        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(() => Promise.resolve())
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ============ CLIPBOARD TESTS ============
    describe('copyToClipboard', () => {
        test('should copy text to clipboard successfully', async () => {
            const result = await SharedUtils.copyToClipboard('test text');
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
            expect(result).toBe(true);
        });

        test('should handle clipboard error gracefully', async () => {
            navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
            const result = await SharedUtils.copyToClipboard('test');
            expect(result).toBe(false);
        });

        test('should accept custom message and type', async () => {
            await SharedUtils.copyToClipboard('text', 'Custom message', 'warning');
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });
    });

    // ============ NOTIFICATION TESTS ============
    describe('showNotification', () => {
        test('should create notification element', () => {
            SharedUtils.showNotification('Test message', 'success');
            const notification = document.querySelector('.notification');
            expect(notification).toBeTruthy();
            expect(notification.textContent).toBe('Test message');
        });

        test('should apply correct notification type class', () => {
            SharedUtils.showNotification('Error!', 'error');
            const notification = document.querySelector('.notification-error');
            expect(notification).toBeTruthy();
        });

        test('should remove notification after duration', (done) => {
            SharedUtils.showNotification('Test', 'info', 100);
            setTimeout(() => {
                const notification = document.querySelector('.notification');
                expect(notification).toBeFalsy();
                done();
            }, 150);
        });

        test('should support all notification types', () => {
            const types = ['success', 'error', 'warning', 'info'];
            types.forEach(type => {
                document.body.innerHTML = '';
                SharedUtils.showNotification(`${type} message`, type);
                const notification = document.querySelector(`.notification-${type}`);
                expect(notification).toBeTruthy();
            });
        });
    });

    // ============ DEBOUNCE TESTS ============
    describe('debounce', () => {
        test('should debounce function calls', (done) => {
            const mockFn = jest.fn();
            const debouncedFn = SharedUtils.debounce(mockFn, 100);

            debouncedFn();
            debouncedFn();
            debouncedFn();

            expect(mockFn).not.toHaveBeenCalled();

            setTimeout(() => {
                expect(mockFn).toHaveBeenCalledTimes(1);
                done();
            }, 150);
        });

        test('should pass arguments to debounced function', (done) => {
            const mockFn = jest.fn();
            const debouncedFn = SharedUtils.debounce(mockFn, 50);

            debouncedFn('arg1', 'arg2');

            setTimeout(() => {
                expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
                done();
            }, 100);
        });

        test('should reset debounce on new calls', (done) => {
            const mockFn = jest.fn();
            const debouncedFn = SharedUtils.debounce(mockFn, 100);

            debouncedFn();
            setTimeout(() => debouncedFn(), 50);

            setTimeout(() => {
                expect(mockFn).toHaveBeenCalledTimes(1);
                done();
            }, 200);
        });
    });

    // ============ THROTTLE TESTS ============
    describe('throttle', () => {
        test('should throttle function calls', (done) => {
            const mockFn = jest.fn();
            const throttledFn = SharedUtils.throttle(mockFn, 100);

            throttledFn();
            throttledFn();
            throttledFn();

            expect(mockFn).toHaveBeenCalledTimes(1);

            setTimeout(() => {
                throttledFn();
                expect(mockFn).toHaveBeenCalledTimes(2);
                done();
            }, 150);
        });
    });

    // ============ FILE TESTS ============
    describe('downloadFile', () => {
        test('should create download link and click it', () => {
            const createElementSpy = jest.spyOn(document, 'createElement');
            const appendChildSpy = jest.spyOn(document.body, 'appendChild');
            
            SharedUtils.downloadFile('test content', 'test.txt', 'text/plain');
            
            expect(createElementSpy).toHaveBeenCalledWith('a');
            expect(appendChildSpy).toHaveBeenCalled();
        });

        test('should handle different MIME types', () => {
            const types = ['text/plain', 'application/json', 'text/csv'];
            types.forEach(type => {
                expect(() => SharedUtils.downloadFile('content', 'file', type)).not.toThrow();
            });
        });
    });

    describe('formatFileSize', () => {
        test('should format bytes correctly', () => {
            expect(SharedUtils.formatFileSize(0)).toBe('0 Bytes');
            expect(SharedUtils.formatFileSize(1024)).toContain('KB');
            expect(SharedUtils.formatFileSize(1024 * 1024)).toContain('MB');
            expect(SharedUtils.formatFileSize(1024 * 1024 * 1024)).toContain('GB');
        });

        test('should handle large file sizes', () => {
            const size = SharedUtils.formatFileSize(5000000000);
            expect(size).toContain('GB');
        });
    });

    // ============ TEXT ANALYSIS TESTS ============
    describe('countWords', () => {
        test('should count words correctly', () => {
            expect(SharedUtils.countWords('hello world')).toBe(2);
            expect(SharedUtils.countWords('one')).toBe(1);
            expect(SharedUtils.countWords('hello   world')).toBe(2);
        });

        test('should handle empty strings', () => {
            expect(SharedUtils.countWords('')).toBe(0);
            expect(SharedUtils.countWords('   ')).toBe(0);
        });

        test('should handle special characters', () => {
            expect(SharedUtils.countWords('hello, world!')).toBe(2);
            expect(SharedUtils.countWords('test@example.com')).toBe(1);
        });
    });

    describe('countCharacters', () => {
        test('should count characters including spaces', () => {
            expect(SharedUtils.countCharacters('hello world', true)).toBe(11);
        });

        test('should count characters excluding spaces', () => {
            expect(SharedUtils.countCharacters('hello world', false)).toBe(10);
        });

        test('should handle empty strings', () => {
            expect(SharedUtils.countCharacters('')).toBe(0);
        });
    });

    // ============ HTML TESTS ============
    describe('escapeHTML', () => {
        test('should escape HTML entities', () => {
            expect(SharedUtils.escapeHTML('<div>test</div>')).toBe('&lt;div&gt;test&lt;/div&gt;');
            expect(SharedUtils.escapeHTML('"quoted"')).toBe('&quot;quoted&quot;');
            expect(SharedUtils.escapeHTML("'single'")).toBe('&#039;single&#039;');
            expect(SharedUtils.escapeHTML('a & b')).toBe('a &amp; b');
        });

        test('should handle mixed content', () => {
            const result = SharedUtils.escapeHTML('<script>alert("XSS")</script>');
            expect(result).not.toContain('<script>');
            expect(result).toContain('&lt;');
        });
    });

    describe('unescapeHTML', () => {
        test('should unescape HTML entities', () => {
            expect(SharedUtils.unescapeHTML('&lt;div&gt;')).toBe('<div>');
            expect(SharedUtils.unescapeHTML('&quot;test&quot;')).toBe('"test"');
            expect(SharedUtils.unescapeHTML('a &amp; b')).toBe('a & b');
        });
    });

    // ============ JSON TESTS ============
    describe('validateJSON', () => {
        test('should validate correct JSON', () => {
            const result = SharedUtils.validateJSON('{"key": "value"}');
            expect(result.valid).toBe(true);
            expect(result.data).toEqual({ key: 'value' });
            expect(result.error).toBeNull();
        });

        test('should catch invalid JSON', () => {
            const result = SharedUtils.validateJSON('{invalid json}');
            expect(result.valid).toBe(false);
            expect(result.error).toBeTruthy();
            expect(result.data).toBeNull();
        });

        test('should handle arrays', () => {
            const result = SharedUtils.validateJSON('[1, 2, 3]');
            expect(result.valid).toBe(true);
            expect(Array.isArray(result.data)).toBe(true);
        });
    });

    describe('formatJSON', () => {
        test('should format JSON with spaces', () => {
            const formatted = SharedUtils.formatJSON('{"key":"value"}', 2);
            expect(formatted).toContain('\n');
            expect(formatted).toContain('  ');
        });

        test('should handle tab indentation', () => {
            const formatted = SharedUtils.formatJSON('{"key":"value"}', 'tab');
            expect(formatted).toContain('\t');
        });

        test('should throw on invalid JSON', () => {
            expect(() => SharedUtils.formatJSON('{invalid}')).toThrow();
        });
    });

    describe('minifyJSON', () => {
        test('should minify JSON', () => {
            const minified = SharedUtils.minifyJSON('{ "key" : "value" }');
            expect(minified).not.toContain('\n');
            expect(minified).not.toContain(' ');
        });

        test('should preserve data integrity', () => {
            const original = { key: 'value', nested: { deep: true } };
            const minified = SharedUtils.minifyJSON(JSON.stringify(original));
            expect(JSON.parse(minified)).toEqual(original);
        });
    });

    // ============ DOM TESTS ============
    describe('getElement', () => {
        test('should get element by ID', () => {
            const div = document.createElement('div');
            div.id = 'test-id';
            document.body.appendChild(div);

            const element = SharedUtils.getElement('test-id');
            expect(element).toBe(div);
        });

        test('should return null for missing element', () => {
            const element = SharedUtils.getElement('nonexistent');
            expect(element).toBeNull();
        });
    });

    describe('getElements', () => {
        test('should get multiple elements', () => {
            const div1 = document.createElement('div');
            div1.id = 'id1';
            const div2 = document.createElement('div');
            div2.id = 'id2';
            document.body.appendChild(div1);
            document.body.appendChild(div2);

            const elements = SharedUtils.getElements(['id1', 'id2']);
            expect(elements.id1).toBe(div1);
            expect(elements.id2).toBe(div2);
        });
    });

    // ============ INPUT VALIDATION TESTS ============
    describe('validateLength', () => {
        test('should validate length constraints', () => {
            let result = SharedUtils.validateLength('hello', 10, 1);
            expect(result.valid).toBe(true);

            result = SharedUtils.validateLength('', 10, 1);
            expect(result.valid).toBe(false);

            result = SharedUtils.validateLength('toolong', 5, 1);
            expect(result.valid).toBe(false);
        });

        test('should provide meaningful error messages', () => {
            const result = SharedUtils.validateLength('x', 10, 5);
            expect(result.message).toBeTruthy();
        });
    });

    // ============ UTILITY TESTS ============
    describe('formatTime', () => {
        test('should format seconds correctly', () => {
            expect(SharedUtils.formatTime(0)).toBe('0s');
            expect(SharedUtils.formatTime(60)).toContain('1m');
            expect(SharedUtils.formatTime(3600)).toContain('1h');
        });

        test('should handle complex times', () => {
            const result = SharedUtils.formatTime(3665);
            expect(result).toContain('1h');
            expect(result).toContain('1m');
            expect(result).toContain('5s');
        });
    });

    describe('generateRandom', () => {
        test('should generate random strings of correct length', () => {
            for (let i = 5; i <= 20; i += 5) {
                const random = SharedUtils.generateRandom(i);
                expect(random.length).toBe(i);
            }
        });

        test('should use provided charset', () => {
            const charset = 'ABC';
            const random = SharedUtils.generateRandom(100, charset);
            for (let char of random) {
                expect(charset).toContain(char);
            }
        });

        test('should generate different strings', () => {
            const set = new Set();
            for (let i = 0; i < 10; i++) {
                set.add(SharedUtils.generateRandom(10));
            }
            expect(set.size).toBeGreaterThan(1);
        });
    });

    describe('isInViewport', () => {
        test('should detect elements in viewport', () => {
            const div = document.createElement('div');
            document.body.appendChild(div);
            expect(SharedUtils.isInViewport(div)).toBe(true);
        });

        test('should detect elements outside viewport', () => {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = '-1000px';
            document.body.appendChild(div);
            expect(SharedUtils.isInViewport(div)).toBe(false);
        });
    });

    // ============ LOADING STATE TESTS ============
    describe('Loading States', () => {
        test('showLoading should disable element and add class', () => {
            const btn = document.createElement('button');
            btn.textContent = 'Original';
            document.body.appendChild(btn);

            SharedUtils.showLoading(btn, 'Loading...');
            expect(btn.disabled).toBe(true);
            expect(btn.textContent).toBe('Loading...');
            expect(btn.classList.contains('loading')).toBe(true);
        });

        test('hideLoading should restore element', () => {
            const btn = document.createElement('button');
            btn.disabled = true;
            btn.classList.add('loading');
            document.body.appendChild(btn);

            SharedUtils.hideLoading(btn, 'Click me');
            expect(btn.disabled).toBe(false);
            expect(btn.textContent).toBe('Click me');
            expect(btn.classList.contains('loading')).toBe(false);
        });
    });

    describe('clearInputs', () => {
        test('should clear input fields', () => {
            const input = document.createElement('input');
            input.value = 'test value';
            const textarea = document.createElement('textarea');
            textarea.value = 'test content';
            
            document.body.appendChild(input);
            document.body.appendChild(textarea);

            SharedUtils.clearInputs([input, textarea]);
            expect(input.value).toBe('');
            expect(textarea.value).toBe('');
        });

        test('should clear div text content', () => {
            const div = document.createElement('div');
            div.textContent = 'some text';
            document.body.appendChild(div);

            SharedUtils.clearInputs([div]);
            expect(div.textContent).toBe('');
        });
    });
});

// ============ KEYBOARD SHORTCUTS TEST ============
describe('setupShortcut', () => {
    test('should trigger callback on shortcut', (done) => {
        const mockFn = jest.fn();
        SharedUtils.setupShortcut('s', mockFn, true);

        const event = new KeyboardEvent('keydown', {
            key: 's',
            ctrlKey: true
        });
        document.dispatchEvent(event);

        setTimeout(() => {
            expect(mockFn).toHaveBeenCalled();
            done();
        }, 50);
    });
});

// ============ INTEGRATION TESTS ============
describe('SharedUtilities Integration', () => {
    test('all functions should be accessible from global SharedUtils', () => {
        expect(typeof SharedUtils).toBe('object');
        expect(typeof SharedUtils.copyToClipboard).toBe('function');
        expect(typeof SharedUtils.showNotification).toBe('function');
        expect(typeof SharedUtils.debounce).toBe('function');
        expect(typeof SharedUtils.validateJSON).toBe('function');
    });

    test('should handle chained operations', async () => {
        const text = 'hello world';
        const wordCount = SharedUtils.countWords(text);
        const charCount = SharedUtils.countCharacters(text, true);
        
        expect(wordCount).toBe(2);
        expect(charCount).toBe(11);
    });

    test('should gracefully handle edge cases', () => {
        expect(SharedUtils.countWords(null)).toBe(0);
        expect(SharedUtils.formatFileSize(-1)).toBeDefined();
        expect(SharedUtils.isInViewport(null)).toBe(false);
    });
});
