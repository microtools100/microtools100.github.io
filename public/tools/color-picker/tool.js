class ColorPickerTool {
    constructor() {
        this.colorInput = document.getElementById('colorInput');
        this.colorPreview = document.getElementById('colorPreview');
        this.hexValue = document.getElementById('hexValue');
        this.rgbValue = document.getElementById('rgbValue');
        this.hslValue = document.getElementById('hslValue');
        this.hsvValue = document.getElementById('hsvValue');
        this.harmonyGrid = document.getElementById('harmonyGrid');
        this.shadesGrid = document.getElementById('shadesGrid');
        this.contrastResult = document.getElementById('contrastResult');
        this.contrastPreview = document.getElementById('contrastPreview');
        this.bgColor = document.getElementById('bgColor');
        this.hexInput = document.getElementById('hexInput');
        this.rgbInput = document.getElementById('rgbInput');
        this.hslInput = document.getElementById('hslInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyBtns = document.querySelectorAll('.copy-btn');
        this.errorMsg = document.getElementById('errorMsg');
        this.eyedropperBtn = document.getElementById('eyedropperBtn');
        this.eyedropperHint = document.getElementById('eyedropperHint');
        
        // RGB Slider elements
        this.redSlider = document.getElementById('redSlider');
        this.greenSlider = document.getElementById('greenSlider');
        this.blueSlider = document.getElementById('blueSlider');
        this.redValue = document.getElementById('redValue');
        this.greenValue = document.getElementById('greenValue');
        this.blueValue = document.getElementById('blueValue');

        this.inputTimeout = null;
        this.lastValidColor = '#3498db';

        this.init();
    }

    /**
     * Clear error message
     */
    clearError() {
        if (this.errorMsg) {
            this.errorMsg.classList.remove('show');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.classList.add('show');
        }
    }

    init() {
        this.setupEventListeners();
        this.updateColorValues();
    }

    setupEventListeners() {
        // Color input
        this.colorInput.addEventListener('input', () => {
            clearTimeout(this.inputTimeout);
            this.lastValidColor = this.colorInput.value;
            this.updateColorValues();
        });

        // Hex input
        this.hexInput.addEventListener('input', () => {
            clearTimeout(this.inputTimeout);
            this.inputTimeout = setTimeout(() => this.updateFromHexInput(), 300);
        });

        // RGB input
        this.rgbInput.addEventListener('input', () => {
            clearTimeout(this.inputTimeout);
            this.inputTimeout = setTimeout(() => this.updateFromRgbInput(), 300);
        });

        // HSL input
        this.hslInput.addEventListener('input', () => {
            clearTimeout(this.inputTimeout);
            this.inputTimeout = setTimeout(() => this.updateFromHslInput(), 300);
        });

        // RGB sliders
        if (this.redSlider) {
            this.redSlider.addEventListener('input', () => this.updateFromSliders());
            this.greenSlider.addEventListener('input', () => this.updateFromSliders());
            this.blueSlider.addEventListener('input', () => this.updateFromSliders());
        }

        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }

        // Download button
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.download());
        }

        // Eyedropper button
        if (this.eyedropperBtn) {
            this.eyedropperBtn.addEventListener('click', () => this.startEyedropper());
            // Show hint if EyeDropper API is available
            if (!('EyeDropper' in window)) {
                this.eyedropperBtn.disabled = true;
                if (this.eyedropperHint) {
                    this.eyedropperHint.textContent = 'Eyedropper not supported in your browser';
                    this.eyedropperHint.style.display = 'block';
                }
            }
        }

        // Copy buttons
        this.copyBtns.forEach(btn => {
            btn.addEventListener('click', () => this.copyToClipboardBtn(btn));
        });

        // Background color for contrast
        if (this.bgColor) {
            this.bgColor.addEventListener('input', () => this.updateContrast());
        }

        // Color swatch click handlers (Shades & Tints, Color Harmony)
        if (this.shadesGrid) {
            this.shadesGrid.addEventListener('click', (e) => {
                const swatch = e.target.closest('.color-swatch');
                if (swatch && swatch.dataset.hex) {
                    this.colorInput.value = swatch.dataset.hex;
                    this.lastValidColor = swatch.dataset.hex;
                    this.updateColorValues();
                    window.MicroTools.utils.showNotification('Color selected', 'success');
                }
            });
        }

        if (this.harmonyGrid) {
            this.harmonyGrid.addEventListener('click', (e) => {
                const swatch = e.target.closest('.color-swatch');
                if (swatch && swatch.dataset.hex) {
                    this.colorInput.value = swatch.dataset.hex;
                    this.lastValidColor = swatch.dataset.hex;
                    this.updateColorValues();
                    window.MicroTools.utils.showNotification('Color selected', 'success');
                }
            });
        }
    }

    updateColorValues() {
        const color = this.colorInput.value;
        this.lastValidColor = color;

        if (this.hexValue) this.hexValue.value = color.toUpperCase();
        if (this.colorPreview) this.colorPreview.style.backgroundColor = color;

        const rgb = this.hexToRgb(color);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);

        if (this.rgbValue) this.rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        if (this.hslValue) this.hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        if (this.hsvValue) this.hsvValue.value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;

        if (this.hexInput) this.hexInput.value = color.toUpperCase();
        if (this.rgbInput) this.rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        if (this.hslInput) this.hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        if (this.redSlider && this.greenSlider && this.blueSlider) {
            this.redSlider.value = rgb.r;
            this.greenSlider.value = rgb.g;
            this.blueSlider.value = rgb.b;
            if (this.redValue) this.redValue.textContent = rgb.r;
            if (this.greenValue) this.greenValue.textContent = rgb.g;
            if (this.blueValue) this.blueValue.textContent = rgb.b;
        }

        if (this.harmonyGrid) this.generateHarmony(color);
        if (this.shadesGrid) this.generateShades(color);
        this.updateContrast();
    }

    updateFromHexInput() {
        const hex = this.hexInput.value.trim();
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            this.clearError();
            this.colorInput.value = hex;
            this.updateColorValues();
        } else if (hex) {
            this.showError('Invalid HEX format. Use #RRGGBB format (e.g., #3498db)');
        }
    }

    updateFromRgbInput() {
        const rgb = this.parseRgb(this.rgbInput.value);
        if (rgb) {
            this.clearError();
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            this.colorInput.value = hex;
            this.updateColorValues();
        } else if (this.rgbInput.value.trim()) {
            this.showError('Invalid RGB format. Use format: 255, 128, 0');
        }
    }

    updateFromHslInput() {
        const hsl = this.parseHsl(this.hslInput.value);
        if (hsl) {
            this.clearError();
            const rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            this.colorInput.value = hex;
            this.updateColorValues();
        } else if (this.hslInput.value.trim()) {
            this.showError('Invalid HSL format. Use format: 204, 70%, 53%');
        }
    }

    updateFromSliders() {
        const r = parseInt(this.redSlider.value);
        const g = parseInt(this.greenSlider.value);
        const b = parseInt(this.blueSlider.value);
        this.clearError();
        const hex = this.rgbToHex(r, g, b);
        this.colorInput.value = hex;
        this.updateColorValues();
    }

    async copyToClipboardBtn(btn) {
        const targetId = btn.getAttribute('data-target');
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const text = targetElement.value || targetElement.textContent;
                if (!text) {
                    window.MicroTools.utils.showNotification('No text to copy', 'warning');
                    return;
                }
                
                await window.MicroTools.utils.copyToClipboard(text, btn);
            }
        }
    }

    clearAll() {
        this.colorInput.value = '#3498db';
        this.lastValidColor = '#3498db';
        this.updateColorValues();
        window.MicroTools.utils.showNotification('Cleared', 'success');
    }

    download() {
        const color = this.colorInput.value.toUpperCase();
        const data = `Color: ${color}\n`;
        SharedUtilities.downloadAsFile(data, 'color.txt', 'text/plain');
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hslToRgb(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h = 0;
        const s = max === 0 ? 0 : d / max;
        const v = max;

        if (max !== min) {
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    parseRgb(str) {
        const match = str.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        return match ? { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) } : null;
    }

    parseHsl(str) {
        const match = str.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        return match ? { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) } : null;
    }

    generateHarmony(color) {
        if (!this.harmonyGrid) return;
        const rgb = this.hexToRgb(color);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        const harmonies = {
            complementary: [(hsl.h + 180) % 360],
            triadic: [(hsl.h + 120) % 360, (hsl.h + 240) % 360],
            tetradic: [(hsl.h + 90) % 360, (hsl.h + 180) % 360, (hsl.h + 270) % 360]
        };

        let html = '';
        Object.entries(harmonies).forEach(([type, angles]) => {
            angles.forEach(h => {
                const rgb = this.hslToRgb(h, hsl.s, hsl.l);
                const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
                html += `<div class="color-swatch" data-hex="${hex}" style="background: ${hex}; padding: 1rem; border-radius: 8px; text-align: center; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.5); cursor: pointer; transition: transform 0.2s;">${hex}</div>`;
            });
        });
        this.harmonyGrid.innerHTML = html;
    }

    generateShades(color) {
        if (!this.shadesGrid) return;
        const rgb = this.hexToRgb(color);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        let html = '';
        for (let i = 10; i <= 90; i += 10) {
            const rgb = this.hslToRgb(hsl.h, hsl.s, i);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            html += `<div class="color-swatch" data-hex="${hex}" style="background: ${hex}; padding: 1rem; border-radius: 8px; text-align: center; color: ${i > 50 ? 'black' : 'white'}; text-shadow: 0 1px 3px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s;">${hex}</div>`;
        }
        this.shadesGrid.innerHTML = html;
    }

    updateContrast() {
        if (!this.contrastResult) return;
        const color1 = this.colorInput.value;
        const color2 = this.bgColor?.value || '#ffffff';
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);

        const lum1 = this.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = this.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        const ratio = (lighter + 0.05) / (darker + 0.05);

        this.contrastResult.textContent = `Contrast Ratio: ${ratio.toFixed(2)}:1`;

        if (this.contrastPreview) {
            this.contrastPreview.style.backgroundColor = color2;
            this.contrastPreview.style.color = color1;
        }
    }

    getRelativeLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(x => {
            x = x / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    /**
     * Start eyedropper to pick color from screen
     */
    async startEyedropper() {
        if (!('EyeDropper' in window)) {
            this.showError('Eyedropper is not supported in your browser. Please update to a modern browser.');
            return;
        }

        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            const hex = result.sRGBHex;
            
            this.colorInput.value = hex;
            this.lastValidColor = hex;
            this.updateColorValues();
            this.clearError();
            window.MicroTools.utils.showNotification('Color picked successfully', 'success');
        } catch (e) {
            // User canceled the eyedropper or it failed
            if (e.name !== 'NotAllowedError') {
                this.showError('Error picking color: ' + e.message);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ColorPickerTool();
});


