/**
 * Unit Converter Tool
 * Converts between different measurement units (length, weight, temperature, volume, time)
 */

class UnitConverter {
    constructor() {
        this.categorySelect = document.getElementById('categorySelect');
        this.inputValue = document.getElementById('inputValue');
        this.fromUnit = document.getElementById('fromUnit');
        this.toUnit = document.getElementById('toUnit');
        this.outputValue = document.getElementById('outputValue');
        this.swapButton = document.querySelector('.swap-button');
        this.errorMsg = document.getElementById('errorMsg');
        
        this.conversions = {
            length: {
                label: 'Length',
                units: {
                    'mm': 0.001,
                    'cm': 0.01,
                    'm': 1,
                    'km': 1000,
                    'in': 0.0254,
                    'ft': 0.3048,
                    'yd': 0.9144,
                    'mi': 1609.34
                },
                display: { 'mm': 'Millimeters', 'cm': 'Centimeters', 'm': 'Meters', 'km': 'Kilometers', 'in': 'Inches', 'ft': 'Feet', 'yd': 'Yards', 'mi': 'Miles' }
            },
            weight: {
                label: 'Weight',
                units: {
                    'mg': 0.001,
                    'g': 1,
                    'kg': 1000,
                    'oz': 28.3495,
                    'lb': 453.592,
                    'ton': 1000000
                },
                display: { 'mg': 'Milligrams', 'g': 'Grams', 'kg': 'Kilograms', 'oz': 'Ounces', 'lb': 'Pounds', 'ton': 'Metric Tons' }
            },
            temperature: {
                label: 'Temperature',
                units: {
                    'C': 'celsius',
                    'F': 'fahrenheit',
                    'K': 'kelvin'
                },
                display: { 'C': 'Celsius', 'F': 'Fahrenheit', 'K': 'Kelvin' }
            },
            volume: {
                label: 'Volume',
                units: {
                    'ml': 1,
                    'l': 1000,
                    'fl_oz': 29.5735,
                    'cup': 236.588,
                    'pint': 473.176,
                    'gallon': 3785.41
                },
                display: { 'ml': 'Milliliters', 'l': 'Liters', 'fl_oz': 'Fluid Ounces', 'cup': 'Cups', 'pint': 'Pints', 'gallon': 'Gallons' }
            },
            time: {
                label: 'Time',
                units: {
                    'ms': 0.001,
                    's': 1,
                    'min': 60,
                    'h': 3600,
                    'day': 86400,
                    'week': 604800
                },
                display: { 'ms': 'Milliseconds', 's': 'Seconds', 'min': 'Minutes', 'h': 'Hours', 'day': 'Days', 'week': 'Weeks' }
            }
        };
        
        this.init();
    }

    /**
     * Initialize event listeners and keyboard shortcuts
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.updateUnits();
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        this.categorySelect.addEventListener('change', () => this.updateUnits());
        this.inputValue.addEventListener('input', () => this.main());
        this.fromUnit.addEventListener('change', () => this.main());
        this.toUnit.addEventListener('change', () => this.main());
        if (this.swapButton) {
            this.swapButton.addEventListener('click', () => this.swapUnits());
        }
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Convert
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.main();
            }
            // Ctrl/Cmd + Shift + S: Swap units
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
                e.preventDefault();
                this.swapUnits();
            }
        });
    }

    /**
     * Update unit options based on selected category
     */
    updateUnits() {
        const category = this.categorySelect.value;
        const units = this.conversions[category].units;

        let fromHtml = '';
        let toHtml = '';

        Object.keys(units).forEach((unit, index) => {
            fromHtml += `<option value="${unit}" ${index === 0 ? 'selected' : ''}>${this.conversions[category].display[unit]}</option>`;
            toHtml += `<option value="${unit}" ${index === 1 ? 'selected' : ''}>${this.conversions[category].display[unit]}</option>`;
        });

        this.fromUnit.innerHTML = fromHtml;
        this.toUnit.innerHTML = toHtml;

        this.main();
    }

    /**
     * Main conversion method
     */
    main() {
        const category = this.categorySelect.value;
        const inputVal = parseFloat(this.inputValue.value);
        const from = this.fromUnit.value;
        const to = this.toUnit.value;

        // Clear previous error
        if (this.errorMsg) {
            this.errorMsg.classList.remove('show');
        }

        if (isNaN(inputVal) || inputVal === '') {
            this.outputValue.value = '';
            return;
        }

        try {
            let result;

            if (category === 'temperature') {
                result = this.convertTemperature(inputVal, from, to);
            } else {
                const baseUnit = this.conversions[category].units[from];
                const targetUnit = this.conversions[category].units[to];
                const baseValue = inputVal * baseUnit;
                result = baseValue / targetUnit;
            }

            result = Math.round(result * 1000000) / 1000000;
            this.outputValue.value = result;
            SharedUtilities.showNotification('Converted successfully!', 'success');
        } catch (error) {
            const errorMessage = `Conversion error: ${error.message}`;
            if (this.errorMsg) {
                this.errorMsg.textContent = errorMessage;
                this.errorMsg.classList.add('show');
            }
            SharedUtilities.showNotification(errorMessage, 'error');
        }
    }

    /**
     * Convert temperature between Celsius, Fahrenheit, and Kelvin
     */
    convertTemperature(value, from, to) {
        let celsius;

        switch (from) {
            case 'C':
                celsius = value;
                break;
            case 'F':
                celsius = (value - 32) * 5 / 9;
                break;
            case 'K':
                celsius = value - 273.15;
                break;
        }

        switch (to) {
            case 'C':
                return celsius;
            case 'F':
                return (celsius * 9 / 5) + 32;
            case 'K':
                return celsius + 273.15;
        }
    }

    /**
     * Swap input and output units
     */
    swapUnits() {
        const tempUnit = this.fromUnit.value;
        this.fromUnit.value = this.toUnit.value;
        this.toUnit.value = tempUnit;
        this.main();
    }

    /**
     * Clear all inputs
     */
    clearAll() {
        this.inputValue.value = '';
        this.outputValue.value = '';
        if (this.errorMsg) {
            this.errorMsg.classList.remove('show');
        }
        SharedUtilities.showNotification('Cleared!', 'info');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.unitConverter = new UnitConverter();
});
