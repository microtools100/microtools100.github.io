// Unit Converter Tool

class UnitConverter {
    constructor() {
        this.categorySelect = document.getElementById('categorySelect');
        this.inputValue = document.getElementById('inputValue');
        this.fromUnit = document.getElementById('fromUnit');
        this.toUnit = document.getElementById('toUnit');
        this.outputValue = document.getElementById('outputValue');
        
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

    init() {
        this.categorySelect.addEventListener('change', () => this.updateUnits());
        this.inputValue.addEventListener('input', () => this.convert());
        this.fromUnit.addEventListener('change', () => this.convert());
        this.toUnit.addEventListener('change', () => this.convert());
        
        this.updateUnits();
    }

    updateUnits() {
        const category = this.categorySelect.value;
        const units = this.conversions[category].units;

        // Update unit selects
        let fromHtml = '';
        let toHtml = '';

        Object.keys(units).forEach((unit, index) => {
            fromHtml += `<option value="${unit}" ${index === 0 ? 'selected' : ''}>${this.conversions[category].display[unit]}</option>`;
            toHtml += `<option value="${unit}" ${index === 1 ? 'selected' : ''}>${this.conversions[category].display[unit]}</option>`;
        });

        this.fromUnit.innerHTML = fromHtml;
        this.toUnit.innerHTML = toHtml;

        this.convert();
    }

    convert() {
        const category = this.categorySelect.value;
        const inputVal = parseFloat(this.inputValue.value);
        const from = this.fromUnit.value;
        const to = this.toUnit.value;

        if (isNaN(inputVal) || inputVal === '') {
            this.outputValue.value = '';
            return;
        }

        let result;

        if (category === 'temperature') {
            result = this.convertTemperature(inputVal, from, to);
        } else {
            // Convert to base unit first, then to target unit
            const baseUnit = this.conversions[category].units[from];
            const targetUnit = this.conversions[category].units[to];
            const baseValue = inputVal * baseUnit;
            result = baseValue / targetUnit;
        }

        // Round to 6 decimal places
        result = Math.round(result * 1000000) / 1000000;
        this.outputValue.value = result;
    }

    convertTemperature(value, from, to) {
        // Convert to Celsius first
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

        // Convert from Celsius to target
        switch (to) {
            case 'C':
                return celsius;
            case 'F':
                return (celsius * 9 / 5) + 32;
            case 'K':
                return celsius + 273.15;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.unitConverter = new UnitConverter();
});
