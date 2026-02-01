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
        this.bgColor = document.getElementById('bgColor');
        this.hexInput = document.getElementById('hexInput');
        this.rgbInput = document.getElementById('rgbInput');
        this.hslInput = document.getElementById('hslInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyBtns = document.querySelectorAll('.copy-btn');
        
        // RGB Slider elements
        this.redSlider = document.getElementById('redSlider');
        this.greenSlider = document.getElementById('greenSlider');
        this.blueSlider = document.getElementById('blueSlider');
        this.redValue = document.getElementById('redValue');
        this.greenValue = document.getElementById('greenValue');
        this.blueValue = document.getElementById('blueValue');

        // Eyedropper elements
        this.eyedropperBtn = document.getElementById('eyedropperBtn');

        this.inputTimeout = null;
        this.lastValidColor = '#3498db';

        this.init();
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

        // Copy buttons
        this.copyBtns.forEach(btn => {
            btn.addEventListener('click', () => this.copyToClipboardBtn(btn));
        });

        // Eyedropper button
        if (this.eyedropperBtn) {
            this.eyedropperBtn.addEventListener('click', () => this.startEyedropper());
        }

        // Background color for contrast
        if (this.bgColor) {
            this.bgColor.addEventListener('input', () => this.updateContrast());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeypress(e));
    }

    updateColorValues() {
        const color = this.colorInput.value;
        this.lastValidColor = color;

        if (this.hexValue) this.hexValue.textContent = color.toUpperCase();
        if (this.colorPreview) this.colorPreview.style.backgroundColor = color;

        const rgb = this.hexToRgb(color);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        if (this.rgbValue) this.rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        if (this.hslValue) this.hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

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

        SharedUtilities.showNotification('Color updated', 'success');
    }

    updateFromHexInput() {
        const hex = this.hexInput.value.trim();
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            this.colorInput.value = hex;
            this.updateColorValues();
        }
    }

    updateFromRgbInput() {
        const rgb = this.parseRgb(this.rgbInput.value);
        if (rgb) {
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            this.colorInput.value = hex;
            this.updateColorValues();
        }
    }

    updateFromHslInput() {
        const hsl = this.parseHsl(this.hslInput.value);
        if (hsl) {
            const rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            this.colorInput.value = hex;
            this.updateColorValues();
        }
    }

    updateFromSliders() {
        const r = parseInt(this.redSlider.value);
        const g = parseInt(this.greenSlider.value);
        const b = parseInt(this.blueSlider.value);
        const hex = this.rgbToHex(r, g, b);
        this.colorInput.value = hex;
        this.updateColorValues();
    }

    copyToClipboardBtn(btn) {
        const text = btn.getAttribute('data-copy-text');
        if (text) {
            SharedUtilities.copyToClipboard(text);
        }
    }

    clearAll() {
        this.colorInput.value = '#3498db';
        this.lastValidColor = '#3498db';
        this.updateColorValues();
        SharedUtilities.showNotification('Cleared', 'success');
    }

    download() {
        const color = this.colorInput.value.toUpperCase();
        const data = `Color: ${color}\n`;
        SharedUtilities.downloadAsFile(data, 'color.txt', 'text/plain');
    }

    startEyedropper() {
        if (!window.EyeDropper) {
            SharedUtilities.showNotification('Eyedropper not supported', 'warning');
            return;
        }
        const eyeDropper = new window.EyeDropper();
        eyeDropper.open().then(result => {
            this.colorInput.value = result.sRGBHex;
            this.updateColorValues();
        }).catch(err => {
            SharedUtilities.showNotification('Eyedropper cancelled', 'info');
        });
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
                html += `<div style="background: ${hex}; padding: 1rem; border-radius: 8px; text-align: center; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${hex}</div>`;
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
            html += `<div style="background: ${hex}; padding: 1rem; border-radius: 8px; text-align: center; color: ${i > 50 ? 'black' : 'white'}; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${hex}</div>`;
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
    }

    getRelativeLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(x => {
            x = x / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    handleKeypress(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            SharedUtilities.copyToClipboard(this.colorInput.value);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ColorPickerTool();
});


