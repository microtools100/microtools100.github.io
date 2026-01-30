class SQLFormatter {
    constructor() {
        this.sqlInput = document.getElementById('sqlInput');
        this.sqlOutput = document.getElementById('sqlOutput');
        this.formatBtn = document.getElementById('formatBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

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
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.download());
        }
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
        // Replace multiple spaces/newlines with single space
        sql = sql.replace(/\s+/g, ' ').trim();

        // Add line breaks before major keywords (at word boundary)
        const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 
                               'UNION', 'INTERSECT', 'EXCEPT', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE', 'ALTER', 'DROP'];
        
        let formatted = sql;
        for (let keyword of majorKeywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${keyword}`);
        }

        // Add line breaks before joining keywords when they follow commas or are at statement start
        const joinKeywords = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN'];
        for (let keyword of joinKeywords) {
            const regex = new RegExp(`\\s+${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${keyword}`);
        }

        // Add line breaks before logical operators in WHERE clause (but not function names)
        formatted = formatted.replace(/\s+(AND|OR)\s+/gi, '\n  $1 ');

        // Clean up multiple blank lines and trim each line
        const lines = formatted.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // Build result with proper indentation
        let result = [];
        let inSubquery = 0;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Count open/close parentheses for subquery depth
            const openParens = (line.match(/\(/g) || []).length;
            const closeParens = (line.match(/\)/g) || []).length;
            inSubquery += openParens - closeParens;

            // Determine indentation
            let indent = '';
            if (line.match(/^(AND|OR)\b/i)) {
                indent = '  '; // Indent AND/OR clauses
            } else if (line.match(/^(WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET)\b/i)) {
                indent = ''; // No indent for these keywords
            } else if (!line.match(/^(SELECT|FROM|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|UNION|INTERSECT|EXCEPT)/i)) {
                indent = '  '; // Indent continuation lines
            }

            result.push(indent + line);
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
        SharedUtilities.clearElements(
            { inputData: this.sqlInput, outputData: this.sqlOutput },
            { message: 'Cleared!' }
        );
    }

    download() {
        const sql = this.sqlOutput.value;
        if (!sql) {
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        const blob = new Blob([sql], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'query.sql';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        SharedUtilities.showNotification('File downloaded', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SQLFormatter();
});