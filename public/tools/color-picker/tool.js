document.addEventListener('DOMContentLoaded', function() {
    const colorInput = document.getElementById('colorInput');
    const colorPreview = document.getElementById('colorPreview');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const hsvValue = document.getElementById('hsvValue');
    const harmonyGrid = document.getElementById('harmonyGrid');
    const shadesGrid = document.getElementById('shadesGrid');
    const contrastResult = document.getElementById('contrastResult');
    const bgColor = document.getElementById('bgColor');
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    const hslInput = document.getElementById('hslInput');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    // RGB Slider elements
    const redSlider = document.getElementById('redSlider');
    const greenSlider = document.getElementById('greenSlider');
    const blueSlider = document.getElementById('blueSlider');
    const redValue = document.getElementById('redValue');
    const greenValue = document.getElementById('greenValue');
    const blueValue = document.getElementById('blueValue');

    // Eyedropper elements
    const eyedropperBtn = document.getElementById('eyedropperBtn');

    let inputTimeout;
    let lastValidColor = '#3498db';

    // Event listeners with debouncing
    colorInput.addEventListener('input', () => {
        clearTimeout(inputTimeout);
        lastValidColor = colorInput.value;
        updateColorValues();
    });

    hexInput.addEventListener('input', () => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(updateFromHexInput, 300);
    });

    rgbInput.addEventListener('input', () => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(updateFromRgbInput, 300);
    });

    hslInput.addEventListener('input', () => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(updateFromHslInput, 300);
    });

    // RGB Slider event listeners
    redSlider.addEventListener('input', updateFromSliders);
    greenSlider.addEventListener('input', updateFromSliders);
    blueSlider.addEventListener('input', updateFromSliders);

    bgColor.addEventListener('input', updateContrast);
    clearBtn.addEventListener('click', clearAll);
    downloadBtn.addEventListener('click', downloadPalette);
    
    // Eyedropper event listener
    eyedropperBtn.addEventListener('click', activateEyedropper);
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const value = document.getElementById(targetId).value;
            if (value) {
                copyToClipboard(value, this);
            }
        });
    });

    // Initialize with default color
    updateColorValues();

    function updateColorValues() {
        const hex = colorInput.value;
        
        // Validate hex color
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            colorInput.value = lastValidColor;
            return;
        }

        lastValidColor = hex;
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

        // Update preview
        colorPreview.style.backgroundColor = hex;

        // Update output fields
        hexValue.value = hex.toUpperCase();
        rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        hsvValue.value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;

        // Update input fields (don't cause loops)
        if (document.activeElement !== hexInput) {
            hexInput.value = hex.substring(1);
        }
        if (document.activeElement !== rgbInput) {
            rgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        }
        if (document.activeElement !== hslInput) {
            hslInput.value = `${hsl.h}, ${hsl.s}, ${hsl.l}`;
        }

        // Update RGB sliders (don't cause loops)
        if (document.activeElement !== redSlider) {
            redSlider.value = rgb.r;
            redValue.textContent = rgb.r;
        }
        if (document.activeElement !== greenSlider) {
            greenSlider.value = rgb.g;
            greenValue.textContent = rgb.g;
        }
        if (document.activeElement !== blueSlider) {
            blueSlider.value = rgb.b;
            blueValue.textContent = rgb.b;
        }

        // Update shades and tints
        generateShadesTints(hex);
        
        // Update harmony
        generateHarmony(hex);
        
        // Update contrast
        updateContrast();
    }

    function updateFromSliders() {
        const r = parseInt(redSlider.value);
        const g = parseInt(greenSlider.value);
        const b = parseInt(blueSlider.value);

        // Update display values
        redValue.textContent = r;
        greenValue.textContent = g;
        blueValue.textContent = b;

        // Convert to hex and update color input
        const hex = rgbToHex(r, g, b);
        if (colorInput.value !== hex) {
            colorInput.value = hex;
            updateColorValues();
        }
    }

    async function activateEyedropper() {
        // Check if EyeDropper API is supported
        if (!window.EyeDropper) {
            if (window.MicroTools?.utils?.showNotification) {
                window.MicroTools.utils.showNotification('Eyedropper not supported in this browser', 'error');
            }
            return;
        }

        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            
            // Convert the CSS color to hex
            const hexColor = result.sRGBHex;
            colorInput.value = hexColor;
            updateColorValues();
            
            if (window.MicroTools?.utils?.showNotification) {
                window.MicroTools.utils.showNotification(`Color picked: ${hexColor}`, 'success');
            }
        } catch (e) {
            // User cancelled the eyedropper
            if (e.name !== 'NotAllowedError') {
                console.error('Eyedropper error:', e);
            }
        }
    }

    function updateFromHexInput() {
        let value = hexInput.value.trim().toUpperCase();
        
        // Remove # if user added it
        if (value.startsWith('#')) {
            value = value.substring(1);
        }
        
        // Allow both with and without #
        if (value.length === 6 && /^[0-9A-F]{6}$/.test(value)) {
            const fullHex = '#' + value;
            if (colorInput.value !== fullHex) {
                colorInput.value = fullHex;
                updateColorValues();
            }
        } else if (value.length < 6) {
            // Allow partial input for better UX
            return;
        } else {
            // Invalid format - provide visual feedback but don't crash
            hexInput.style.borderColor = '#e74c3c';
            setTimeout(() => {
                hexInput.style.borderColor = '';
            }, 1500);
        }
    }

    function updateFromRgbInput() {
        const parts = rgbInput.value.split(',').map(p => parseInt(p.trim()));
        
        if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
            const hex = rgbToHex(parts[0], parts[1], parts[2]);
            if (colorInput.value !== hex) {
                colorInput.value = hex;
                updateColorValues();
            }
        } else if (rgbInput.value.trim().length > 0) {
            // Show error only if user has entered something
            rgbInput.style.borderColor = '#e74c3c';
            setTimeout(() => {
                rgbInput.style.borderColor = '';
            }, 1500);
        }
    }

    function updateFromHslInput() {
        const parts = hslInput.value.split(',').map(p => {
            // Remove % symbols if present
            return parseInt(p.trim().replace('%', ''));
        });

        if (parts.length === 3 && !parts.some(isNaN)) {
            const h = parts[0];
            const s = parts[1];
            const l = parts[2];
            
            if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
                const rgb = hslToRgb(h, s, l);
                const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                if (colorInput.value !== hex) {
                    colorInput.value = hex;
                    updateColorValues();
                }
            } else {
                hslInput.style.borderColor = '#e74c3c';
                setTimeout(() => {
                    hslInput.style.borderColor = '';
                }, 1500);
            }
        } else if (hslInput.value.trim().length > 0) {
            hslInput.style.borderColor = '#e74c3c';
            setTimeout(() => {
                hslInput.style.borderColor = '';
            }, 1500);
        }
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function rgbToHsl(r, g, b) {
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

    function rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h = 0, s = max === 0 ? 0 : d / max;
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

    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
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

    function generateShadesTints(baseHex) {
        const shades = [
            { name: 'Lightest', offset: 40 },
            { name: 'Lighter', offset: 20 },
            { name: 'Light', offset: 10 },
            { name: 'Base', offset: 0 },
            { name: 'Dark', offset: -10 },
            { name: 'Darker', offset: -20 },
            { name: 'Darkest', offset: -40 }
        ];

        shadesGrid.innerHTML = '';
        const rgb = hexToRgb(baseHex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        shades.forEach(shade => {
            const newL = Math.max(0, Math.min(100, hsl.l + shade.offset));
            const newRgb = hslToRgb(hsl.h, hsl.s, newL);
            const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);

            const div = document.createElement('div');
            div.className = 'shade-color';
            div.innerHTML = `
                <div class="shade-swatch" style="background-color: ${newHex}"></div>
                <div class="shade-label">${shade.name}</div>
                <div class="shade-value">${newHex}</div>
            `;
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => {
                colorInput.value = newHex;
                updateColorValues();
            });
            shadesGrid.appendChild(div);
        });
    }

    function generateHarmony(baseHex) {
        const colors = {
            base: baseHex,
            complementary: rotateHue(baseHex, 180),
            triad1: rotateHue(baseHex, 120),
            triad2: rotateHue(baseHex, 240),
            analogous1: rotateHue(baseHex, 30),
            analogous2: rotateHue(baseHex, -30)
        };

        harmonyGrid.innerHTML = '';
        Object.entries(colors).forEach(([name, color]) => {
            const div = document.createElement('div');
            div.className = 'harmony-color';
            div.innerHTML = `
                <div class="harmony-color-swatch" style="background-color: ${color}"></div>
                <div class="harmony-color-label">${name.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div class="harmony-color-value">${color.toUpperCase()}</div>
            `;
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => {
                colorInput.value = color;
                updateColorValues();
            });
            harmonyGrid.appendChild(div);
        });
    }

    function rotateHue(hex, angle) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.h = (hsl.h + angle + 360) % 360;
        const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    function getRelativeLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(x => {
            x = x / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function getContrastRatio(rgb1, rgb2) {
        const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
        const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
    }

    function getWCAGLevel(ratio) {
        ratio = parseFloat(ratio);
        if (ratio >= 7) return 'AAA (Enhanced)';
        if (ratio >= 4.5) return 'AA (Standard)';
        if (ratio >= 3) return 'AA Large Text';
        return 'Fail';
    }

    function updateContrast() {
        try {
            const fgRgb = hexToRgb(colorInput.value);
            const bgRgb = hexToRgb(bgColor.value);
            const ratio = getContrastRatio(fgRgb, bgRgb);
            const level = getWCAGLevel(ratio);

            contrastResult.innerHTML = `
                <div class="contrast-ratio">
                    <span class="ratio-label">Contrast Ratio:</span>
                    <span class="ratio-value">${ratio}:1</span>
                </div>
                <div class="wcag-level">
                    <span class="level-label">WCAG Level:</span>
                    <span class="level-value ${level.includes('Fail') ? 'fail' : 'pass'}">${level}</span>
                </div>
                <div class="contrast-preview">
                    <div class="preview-text" style="background-color: ${bgColor.value}; color: ${colorInput.value};">
                        Sample Text
                    </div>
                </div>
            `;
        } catch (e) {
            // Silently fail on contrast if colors aren't valid yet
            contrastResult.innerHTML = '<p style="color: var(--secondary-color);">Pick colors to see contrast</p>';
        }
    }

    function clearAll() {
        colorInput.value = '#3498db';
        bgColor.value = '#ffffff';
        lastValidColor = '#3498db';
        updateColorValues();
    }

    function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';
                btn.style.background = '#4caf50';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 1500);
            }

            if (window.MicroTools?.utils?.showNotification) {
                window.MicroTools.utils.showNotification('Copied to clipboard!', 'success');
            }
        }).catch(err => {
            console.error('Copy failed:', err);
            if (btn) {
                btn.textContent = '✗ Failed';
                setTimeout(() => {
                    btn.textContent = 'Copy';
                }, 1500);
            }
        });
    }

    function downloadPalette() {
        const rgb = hexToRgb(colorInput.value);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const shades = [40, 20, 10, 0, -10, -20, -40];
        const harmony = [
            { name: 'Base', angle: 0 },
            { name: 'Complementary', angle: 180 },
            { name: 'Triad 1', angle: 120 },
            { name: 'Triad 2', angle: 240 },
            { name: 'Analogous 1', angle: 30 },
            { name: 'Analogous 2', angle: -30 }
        ];

        let csv = 'Type,Name,Color Code\n';
        
        csv += 'Base Color,Base,' + colorInput.value + '\n';
        csv += '\nShades & Tints,\n';
        
        shades.forEach(offset => {
            const newL = Math.max(0, Math.min(100, hsl.l + offset));
            const newRgb = hslToRgb(hsl.h, hsl.s, newL);
            const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
            const label = offset === 0 ? 'Base' : offset > 0 ? `Light +${offset}` : `Dark ${offset}`;
            csv += `,${label},${newHex}\n`;
        });

        csv += '\nHarmony Colors,\n';
        harmony.forEach(h => {
            const newHex = rotateHue(colorInput.value, h.angle);
            csv += `,${h.name},${newHex}\n`;
        });

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', 'color-palette.csv');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        if (window.MicroTools?.utils?.showNotification) {
            window.MicroTools.utils.showNotification('Palette downloaded!', 'success');
        }
    }
});
