/**
 * SQL Formatter Tool
 * Formats SQL queries for better readability
 * Uses global auto-convert and auto-copy functions
 */

class SQLFormatter {
    constructor() {
        this.sqlInput = document.getElementById('sqlInput');
        this.sqlOutput = document.getElementById('sqlOutput');
        this.formatBtn = document.getElementById('formatBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorMsg = document.querySelector('.error-msg');

        this.keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 
                        'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 
                        'VALUES', 'SET', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'AS'];

        this.init();
    }

    /**
     * Initialize event listeners and keyboard shortcuts
     */
    init() {
        // Setup auto-convert: Real-time conversion as you type
        SharedUtilities.setupAutoConvert(
            this.sqlInput,
            (sqlText) => this.formatSQL(sqlText),
            this.sqlOutput,
            this.errorMsg,
            300
        );

        // Setup auto-copy: Automatically copy to clipboard after conversion
        SharedUtilities.setupAutoCopy(this.sqlOutput, 500);

        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        if (this.formatBtn) {
            this.formatBtn.addEventListener('click', () => this.manualFormat());
        }
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.download());
        }
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        this.sqlInput.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + L: Clear
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
                e.preventDefault();
                this.clearAll();
            }
        });
    }

    /**
     * Manual format (button click)
     */
    manualFormat() {
        try {
            let sql = this.sqlInput.value.trim();
            if (!sql) {
                this.showError('Please enter some SQL to format');
                SharedUtilities.showNotification('Empty input', 'warning');
                this.sqlOutput.value = '';
                return;
            }

            let formatted = this.formatSQL(sql);
            this.sqlOutput.value = formatted;
            this.clearError();
            SharedUtilities.showNotification('Formatted successfully!', 'success');
        } catch (error) {
            this.showError('Error formatting SQL: ' + error.message);
            SharedUtilities.showNotification('Formatting error', 'error');
            this.sqlOutput.value = '';
        }
    }

    /**
     * Format SQL query
     */
    formatSQL(sql) {
        // Preserve comments - split by lines first to protect comments
        const lines = sql.split('\n');
        let result = [];
        let inMultilineComment = false;
        let currentStatement = '';

        for (let line of lines) {
            line = line.trim();
            
            // Handle multi-line comments
            if (line.includes('/*')) {
                inMultilineComment = true;
            }
            if (inMultilineComment) {
                result.push(line);
                if (line.includes('*/')) {
                    inMultilineComment = false;
                }
                continue;
            }

            // Preserve single-line comments
            if (line.startsWith('--')) {
                if (currentStatement.trim()) {
                    result.push(...this.formatStatement(currentStatement));
                    currentStatement = '';
                }
                result.push(line);
                continue;
            }

            // Accumulate statement
            currentStatement += ' ' + line;

            // If line ends with semicolon, format the complete statement
            if (line.endsWith(';')) {
                result.push(...this.formatStatement(currentStatement));
                currentStatement = '';
            }
        }

        // Format any remaining statement
        if (currentStatement.trim()) {
            result.push(...this.formatStatement(currentStatement));
        }

        return result.join('\n');
    }

    /**
     * Format a single SQL statement
     */
    formatStatement(sql) {
        sql = sql.replace(/\s+/g, ' ').trim();

        const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 
                               'UNION', 'INTERSECT', 'EXCEPT', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 
                               'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'VALUES', 'SET'];
        
        let formatted = sql;
        
        // Add newlines before major keywords
        for (let keyword of majorKeywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${keyword}`);
        }

        // Handle JOIN keywords
        const joinKeywords = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN'];
        for (let keyword of joinKeywords) {
            const regex = new RegExp(`\\s+${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${keyword}`);
        }

        // Handle AND/OR with indentation
        formatted = formatted.replace(/\s+(AND|OR)\s+/gi, '\n    $1 ');

        // Split and process lines
        const statementLines = formatted.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        let resultLines = [];
        let parenDepth = 0;

        for (let i = 0; i < statementLines.length; i++) {
            let line = statementLines[i];
            
            // Count parentheses to track nesting
            const openParens = (line.match(/\(/g) || []).length;
            const closeParens = (line.match(/\)/g) || []).length;
            
            let indent = '';
            
            // Determine indentation based on context
            if (line.match(/^(AND|OR)\b/i)) {
                indent = '    '; // 4 spaces for AND/OR
            } else if (line.match(/^(WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|SET|VALUES)\b/i)) {
                indent = ''; // No indent for main clauses
            } else if (parenDepth > 0) {
                // Inside parentheses (like column definitions in CREATE TABLE)
                indent = '    '; // 4 spaces for content inside parens
            }
            
            resultLines.push(indent + line);
            
            // Update parenthesis depth for next iteration
            parenDepth += openParens - closeParens;
        }

        return resultLines;
    }

    /**
     * Copy output to clipboard
     */
    copyToClipboard() {
        const text = this.sqlOutput.value.trim();
        if (!text) {
            this.showError('No SQL to copy. Please format some SQL first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        SharedUtilities.copyToClipboard(text, 'SQL copied to clipboard!', 'success');
        this.clearError();
    }

    /**
     * Clear all inputs
     */
    clearAll() {
        this.sqlInput.value = '';
        this.sqlOutput.value = '';
        this.clearError();
        SharedUtilities.showNotification('Cleared', 'info');
        this.sqlInput.focus();
    }

    /**
     * Download output as file
     */
    download() {
        const sql = this.sqlOutput.value.trim();
        if (!sql) {
            this.showError('No SQL to download. Please format some SQL first.');
            SharedUtilities.showNotification('Nothing to download', 'warning');
            return;
        }

        SharedUtilities.downloadAsFile(sql, 'formatted-query.sql', 'text/plain');
        SharedUtilities.showNotification('Downloaded successfully!', 'success');
    }

    showError(message) {
        SharedUtilities.showError(this.errorMsg, message);
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.classList.remove('show');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SQLFormatter();
});