class XMLToJSONConverter {
    constructor() {
        this.xmlInput = document.getElementById('xmlInput');
        this.jsonOutput = document.getElementById('jsonOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.init();
    }

    init() {
        this.convertBtn.addEventListener('click', () => this.convert());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.xmlInput.addEventListener('input', () => this.autoConvert());
    }

    autoConvert() {
        clearTimeout(this.autoConvertTimer);
        this.autoConvertTimer = setTimeout(() => this.convert(), 500);
    }

    convert() {
        try {
            const xml = this.xmlInput.value.trim();
            if (!xml) {
                this.jsonOutput.value = '';
                return;
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'text/xml');

            if (doc.getElementsByTagName('parsererror').length > 0) {
                this.jsonOutput.value = 'Error: Invalid XML';
                window.MicroTools?.utils?.showNotification?.('Invalid XML', 'error');
                return;
            }

            const json = this.xmlToJSON(doc.documentElement);
            this.jsonOutput.value = JSON.stringify(json, null, 2);
            window.MicroTools?.utils?.showNotification?.('Converted successfully!', 'success');
        } catch (error) {
            this.jsonOutput.value = `Error: ${error.message}`;
            window.MicroTools?.utils?.showNotification?.('Conversion error', 'error');
        }
    }

    xmlToJSON(element) {
        const result = {};
        const tagName = element.tagName;
        const obj = {};

        // Add attributes
        if (element.attributes.length > 0) {
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                obj['@' + attr.name] = attr.value;
            }
        }

        // Add child elements
        const children = {};
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];

            if (node.nodeType === 1) { // Element node
                const childObj = this.xmlToJSON(node);
                const childName = node.tagName;

                if (children[childName]) {
                    if (Array.isArray(children[childName])) {
                        children[childName].push(childObj[childName]);
                    } else {
                        children[childName] = [children[childName], childObj[childName]];
                    }
                } else {
                    children[childName] = childObj[childName];
                }
            } else if (node.nodeType === 3) { // Text node
                const text = node.nodeValue.trim();
                if (text && text.length > 0) {
                    obj['#text'] = text;
                }
            }
        }

        // Merge children into object
        Object.assign(obj, children);

        // Return wrapped in element name
        result[tagName] = Object.keys(obj).length > 0 ? obj : null;
        return result;
    }

    copy() {
        if (!this.jsonOutput.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.jsonOutput.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('JSON copied!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    clear() {
        SharedUtilities.clearElements(
            { inputData: this.xmlInput, outputData: this.jsonOutput },
            { message: 'Cleared all data' }
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new XMLToJSONConverter();
});