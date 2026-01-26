class SQLFormatter {
    constructor() {
        this.sqlInput = document.getElementById('sqlInput');
        this.sqlOutput = document.getElementById('sqlOutput');
        this.formatBtn = document.getElementById('formatBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 
                        'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 
                        'VALUES', 'SET', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'AS'];

        this.init();
    }

    init() {
        this.formatBtn.addEventListener('click', () => this.format());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.minifyBtn.addEventListener('click', () => this.minify());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.sqlInput.addEventListener('input', () => this.autoFormat());
    }

    autoFormat() {
        clearTimeout(this.autoFormatTimer);
        this.autoFormatTimer = setTimeout(() => this.format(), 500);
    }

    format() {
        try {
            let sql = this.sqlInput.value.trim();
            if (!sql) {
                this.sqlOutput.value = '';
                return;
            }

            // Convert to uppercase and split by keywords
            let formatted = this.formatSQL(sql);
            this.sqlOutput.value = formatted;
            window.MicroTools?.utils?.showNotification?.('Formatted successfully!', 'success');
        } catch (error) {
            this.sqlOutput.value = `Error: ${error.message}`;
            window.MicroTools?.utils?.showNotification?.('Error formatting SQL', 'error');
        }
    }

    formatSQL(sql) {
        // Replace multiple spaces with single space
        sql = sql.replace(/\s+/g, ' ');

        // Add line breaks before keywords
        let formatted = sql;
        formatted = formatted.replace(/\b(SELECT|FROM|WHERE|AND|OR|JOIN|INNER|LEFT|RIGHT|FULL|ON|ORDER BY|GROUP BY|HAVING|LIMIT|INSERT|UPDATE|DELETE|VALUES|SET|CASE|WHEN|THEN|ELSE|END|UNION|INTERSECT|EXCEPT)\b/gi, '\n$1');

        // Handle parentheses
        formatted = formatted.replace(/\(/g, '\n  (');
        formatted = formatted.replace(/\)/g, '\n  )');

        // Remove extra blank lines
        formatted = formatted.split('\n').map(line => line.trim()).filter(line => line).join('\n');

        // Indent continuation lines
        const lines = formatted.split('\n');
        let result = [];
        let indentLevel = 0;

        for (let line of lines) {
            if (line.match(/^(WHERE|AND|OR|HAVING|ORDER BY|GROUP BY|LIMIT|INSERT|UPDATE|DELETE|SET|CASE|WHEN|THEN|ELSE|JOIN|INNER|LEFT|RIGHT|FULL|ON|UNION|INTERSECT|EXCEPT)/i)) {
                result.push(line);
            } else if (line.match(/^(SELECT|FROM)/i)) {
                result.push(line);
            } else {
                result.push('  ' + line);
            }
        }

        return result.join('\n');
    }

    minify() {
        let sql = this.sqlInput.value.trim();
        if (!sql) {
            this.sqlOutput.value = '';
            return;
        }

        // Remove newlines and extra spaces
        sql = sql.replace(/\s+/g, ' ').trim();
        this.sqlOutput.value = sql;
        window.MicroTools?.utils?.showNotification?.('Minified successfully!', 'success');
    }

    copy() {
        if (!this.sqlOutput.value) {
            window.MicroTools?.utils?.showNotification?.('Nothing to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.sqlOutput.value).then(() => {
            window.MicroTools?.utils?.showNotification?.('SQL copied to clipboard!', 'success');
        }).catch(() => {
            window.MicroTools?.utils?.showNotification?.('Failed to copy', 'error');
        });
    }

    clear() {
        this.sqlInput.value = '';
        this.sqlOutput.value = '';
        window.MicroTools?.utils?.showNotification?.('Cleared!', 'info');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SQLFormatter();
});