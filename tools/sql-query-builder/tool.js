/**
 * SQL Query Builder Tool
 * Builds SQL queries visually in simple and advanced modes
 */

class SQLQueryBuilder {
    constructor() {
        this.currentMode = 'simple';
        this.currentQueryType = 'select';
        this.queryOutput = document.getElementById('queryOutput');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.errorMsg = document.querySelector('.error-msg');
        
        this.init();
    }

    /**
     * Initialize event listeners and keyboard shortcuts
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Simple mode query type
        document.querySelectorAll('.query-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchQueryType('simple', e.target.dataset.type));
        });

        // Advanced mode query type
        document.querySelectorAll('.adv-query-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchQueryType('advanced', e.target.dataset.type));
        });

        // Action buttons
        this.generateBtn?.addEventListener('click', () => this.generate());
        this.clearBtn?.addEventListener('click', () => this.clearAll());
        this.copyBtn?.addEventListener('click', () => this.copyToClipboard());

        // Advanced mode column and condition buttons
        document.getElementById('addAdvColumnBtn')?.addEventListener('click', () => this.addAdvColumn());
        document.getElementById('selectAllAdvBtn')?.addEventListener('click', () => this.selectAllAdvColumns());
        document.getElementById('addAdvConditionBtn')?.addEventListener('click', () => this.addAdvCondition());
        document.getElementById('addAdvValueBtn')?.addEventListener('click', () => this.addAdvValue());
        document.getElementById('addAdvSetBtn')?.addEventListener('click', () => this.addAdvSet());
        document.getElementById('addAdvUpdateConditionBtn')?.addEventListener('click', () => this.addAdvUpdateCondition());
        document.getElementById('addAdvDeleteConditionBtn')?.addEventListener('click', () => this.addAdvDeleteCondition());
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.generate();
            }
            // Ctrl/Cmd + Shift + L: Clear
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
                e.preventDefault();
                this.clearAll();
            }
        });
    }

    /**
     * Generate query
     */
    generate() {
        try {
            if (this.currentMode === 'simple') {
                this.generateSimpleQuery();
            } else {
                this.generateAdvancedQuery();
            }

            if (!this.queryOutput) {
                return;
            }

            const query = this.queryOutput.textContent.trim();
            
            if (!query || query === 'Please enter a table name' || query === 'Please enter column-value pairs' || query === 'Please enter SET values') {
                this.showError('Please fill in the required fields to generate a query');
                return;
            }

            this.clearError();
        } catch (error) {
            this.showError('Error generating query: ' + error.message);
            if (this.queryOutput) {
                this.queryOutput.textContent = '';
            }
        }
    }

    /**
     * Switch between simple and advanced modes
     */
    switchMode(mode) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        document.getElementById('simpleMode')?.classList.toggle('hidden', mode !== 'simple');
        document.getElementById('advancedMode')?.classList.toggle('hidden', mode !== 'advanced');

        this.currentQueryType = 'select';
        this.generate();
    }

    /**
     * Switch query type (SELECT, INSERT, UPDATE, DELETE)
     */
    switchQueryType(mode, type) {
        this.currentQueryType = type;
        
        if (mode === 'simple') {
            document.querySelectorAll('.query-type-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === type);
            });
            
            document.querySelectorAll('#simpleMode .query-options').forEach(section => {
                section.classList.add('hidden');
            });

            const sectionMap = {
                select: 'simpleSelectOptions',
                insert: 'simpleInsertOptions',
                update: 'simpleUpdateOptions',
                delete: 'simpleDeleteOptions'
            };

            if (sectionMap[type]) {
                document.getElementById(sectionMap[type]).classList.remove('hidden');
            }
        } else {
            document.querySelectorAll('.adv-query-type-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === type);
            });

            document.querySelectorAll('#advancedMode .query-options').forEach(section => {
                section.classList.add('hidden');
            });

            const sectionMap = {
                select: 'advSelectOptions',
                insert: 'advInsertOptions',
                update: 'advUpdateOptions',
                delete: 'advDeleteOptions'
            };

            if (sectionMap[type]) {
                document.getElementById(sectionMap[type]).classList.remove('hidden');
            }
        }

        this.generate();
    }
    /**
     * Main method - calls generate for button click
     */
    main() {
        this.generate();
    }

    /**
     * Generate query in simple mode
     */
    generateSimpleQuery() {
        if (!this.queryOutput) {
            return;
        }

        const tableName = document.getElementById('simplTableName')?.value.trim();
        
        if (!tableName) {
            this.queryOutput.textContent = 'Please enter a table name';
            return;
        }

        let query = '';

        if (this.currentQueryType === 'select') {
            const columns = document.getElementById('simpleColumns')?.value.trim() || '*';
            const where = document.getElementById('simpleWhere')?.value.trim();
            
            query = `SELECT ${columns}\nFROM ${tableName}`;
            if (where) {
                query += `\nWHERE ${where}`;
            }
        } else if (this.currentQueryType === 'insert') {
            const values = document.getElementById('simpleInsertValues')?.value.trim();
            if (!values) {
                this.queryOutput.textContent = 'Please enter column-value pairs';
                return;
            }

            const pairs = values.split('\n')
                .map(line => line.split(',').map(s => s.trim()))
                .filter(p => p.length === 2);
            
            const columns = pairs.map(p => p[0]).join(', ');
            const vals = pairs.map(p => {
                const val = p[1];
                if (val.toUpperCase() === 'NULL') return 'NULL';
                if (isNaN(val)) return `'${val.replace(/'/g, "''")}'`;
                return val;
            }).join(', ');

            query = `INSERT INTO ${tableName} (${columns})\nVALUES (${vals})`;
        } else if (this.currentQueryType === 'update') {
            const setValues = document.getElementById('simpleUpdateSet')?.value.trim();
            const where = document.getElementById('simpleUpdateWhere')?.value.trim();

            if (!setValues) {
                this.queryOutput.textContent = 'Please enter SET values';
                return;
            }

            query = `UPDATE ${tableName}\nSET ${setValues}`;
            if (where) {
                query += `\nWHERE ${where}`;
            }
        } else if (this.currentQueryType === 'delete') {
            const where = document.getElementById('simpleDeleteWhere')?.value.trim();
            
            query = `DELETE FROM ${tableName}`;
            if (where) {
                query += `\nWHERE ${where}`;
            } else {
                query += '\n-- WARNING: No WHERE clause! This will delete all rows!';
            }
        }

        this.queryOutput.textContent = query + ';';
    }

    /**
     * Generate query in advanced mode
     */
    generateAdvancedQuery() {
        if (!this.queryOutput) {
            return;
        }

        const tableName = document.getElementById('advTableName')?.value.trim();
        
        if (!tableName) {
            this.queryOutput.textContent = 'Please enter a table name';
            return;
        }

        let query = '';

        if (this.currentQueryType === 'select') {
            const columns = Array.from(document.querySelectorAll('#advColumnsList .column-input'))
                .map(input => input.value.trim())
                .filter(v => v);
            
            const columnList = columns.length > 0 ? columns.join(', ') : '*';
            query = `SELECT ${columnList}\nFROM ${tableName}`;

            const conditions = this.getAdvConditions('#advConditionsList');
            if (conditions.length > 0) {
                query += `\nWHERE ${conditions.join(' AND ')}`;
            }

            const groupBy = document.getElementById('advGroupBy')?.value.trim();
            if (groupBy) {
                query += `\nGROUP BY ${groupBy}`;
            }

            const having = document.getElementById('advHaving')?.value.trim();
            if (having) {
                query += `\nHAVING ${having}`;
            }

            const orderBy = document.getElementById('advOrderBy')?.value.trim();
            if (orderBy) {
                query += `\nORDER BY ${orderBy}`;
            }

            const limit = document.getElementById('advLimit')?.value.trim();
            if (limit) {
                query += `\nLIMIT ${limit}`;
            }
        } else if (this.currentQueryType === 'insert') {
            const values = Array.from(document.querySelectorAll('#advValuesList .value-item'));
            
            if (values.length === 0) {
                this.queryOutput.textContent = 'Please add at least one value';
                return;
            }

            const columns = values.map(item => item.querySelector('.value-column')?.value.trim()).filter(v => v);
            const vals = values.map(item => {
                const type = item.querySelector('.value-type')?.value || 'string';
                const val = item.querySelector('.value-input')?.value.trim() || '';
                
                if (type === 'null' || val.toUpperCase() === 'NULL') return 'NULL';
                if (type === 'number') return val;
                return `'${val.replace(/'/g, "''")}'`;
            });

            const columnList = columns.join(', ');
            const valueList = vals.join(', ');
            query = `INSERT INTO ${tableName} (${columnList})\nVALUES (${valueList})`;
        } else if (this.currentQueryType === 'update') {
            const setItems = Array.from(document.querySelectorAll('#advSetList .set-item'));
            
            if (setItems.length === 0) {
                this.queryOutput.textContent = 'Please add at least one SET value';
                return;
            }

            const setPairs = setItems.map(item => {
                const col = item.querySelector('.set-column')?.value.trim();
                const type = item.querySelector('.set-type')?.value;
                const val = item.querySelector('.set-value')?.value.trim() || '';
                
                let formattedVal;
                if (type === 'null' || val.toUpperCase() === 'NULL') formattedVal = 'NULL';
                else if (type === 'number') formattedVal = val;
                else formattedVal = `'${val.replace(/'/g, "''")}'`;
                
                return `${col} = ${formattedVal}`;
            }).filter(p => p);

            query = `UPDATE ${tableName}\nSET ${setPairs.join(', ')}`;

            const conditions = this.getAdvConditions('#advUpdateConditionsList');
            if (conditions.length > 0) {
                query += `\nWHERE ${conditions.join(' AND ')}`;
            }
        } else if (this.currentQueryType === 'delete') {
            query = `DELETE FROM ${tableName}`;

            const conditions = this.getAdvConditions('#advDeleteConditionsList');
            if (conditions.length > 0) {
                query += `\nWHERE ${conditions.join(' AND ')}`;
            } else {
                query += '\n-- WARNING: No WHERE clause! This will delete all rows!';
            }
        }

        this.queryOutput.textContent = query + ';';
    }

    /**
     * Get conditions from a selector
     */
    getAdvConditions(selector) {
        return Array.from(document.querySelectorAll(`${selector} .condition-item`))
            .map(item => {
                const col = item.querySelector('.condition-column')?.value.trim();
                const op = item.querySelector('.condition-operator')?.value;
                const val = item.querySelector('.condition-value')?.value.trim();
                
                if (!col) return '';
                
                if (op?.includes('NULL')) {
                    return `${col} ${op}`;
                }
                
                let formattedVal;
                if (isNaN(val)) {
                    formattedVal = `'${val.replace(/'/g, "''")}'`;
                } else {
                    formattedVal = val;
                }
                
                return `${col} ${op} ${formattedVal}`;
            })
            .filter(c => c);
    }

    /**
     * Add advanced column
     */
    addAdvColumn() {
        const columnsList = document.getElementById('advColumnsList');
        const div = document.createElement('div');
        div.className = 'column-item';
        div.innerHTML = `
            <input type="text" placeholder="Column name" class="column-input">
            <button class="remove-btn" type="button">Remove</button>
        `;
        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
            this.main();
        });
        columnsList.appendChild(div);
    }

    /**
     * Select all columns (*)
     */
    selectAllAdvColumns() {
        document.getElementById('advColumnsList').innerHTML = '';
        this.main();
    }

    /**
     * Add advanced condition
     */
    addAdvCondition() {
        const conditionsList = document.getElementById('advConditionsList');
        const div = document.createElement('div');
        div.className = 'condition-item';
        div.innerHTML = `
            <input type="text" placeholder="Column" class="condition-column">
            <select class="condition-operator">
                <option>=</option>
                <option>!=</option>
                <option>></option>
                <option><</option>
                <option>>=</option>
                <option><=</option>
                <option>LIKE</option>
                <option>IN</option>
                <option>BETWEEN</option>
                <option>IS NULL</option>
                <option>IS NOT NULL</option>
            </select>
            <input type="text" placeholder="Value" class="condition-value">
            <button class="remove-btn" type="button">Remove</button>
        `;
        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
            this.main();
        });
        conditionsList.appendChild(div);
    }

    /**
     * Add advanced value
     */
    addAdvValue() {
        const valuesList = document.getElementById('advValuesList');
        const div = document.createElement('div');
        div.className = 'value-item';
        div.innerHTML = `
            <input type="text" placeholder="Column" class="value-column">
            <select class="value-type">
                <option value="string">Text</option>
                <option value="number">Number</option>
                <option value="null">NULL</option>
            </select>
            <input type="text" placeholder="Value" class="value-input">
            <button class="remove-btn" type="button">Remove</button>
        `;
        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
            this.main();
        });
        valuesList.appendChild(div);
    }

    /**
     * Add advanced SET
     */
    addAdvSet() {
        const setList = document.getElementById('advSetList');
        const div = document.createElement('div');
        div.className = 'set-item';
        div.innerHTML = `
            <input type="text" placeholder="Column" class="set-column">
            <select class="set-type">
                <option value="string">Text</option>
                <option value="number">Number</option>
                <option value="null">NULL</option>
            </select>
            <input type="text" placeholder="Value" class="set-value">
            <button class="remove-btn" type="button">Remove</button>
        `;
        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
            this.main();
        });
        setList.appendChild(div);
    }

    /**
     * Add advanced update condition
     */
    addAdvUpdateCondition() {
        const conditionsList = document.getElementById('advUpdateConditionsList');
        this.addConditionItem(conditionsList);
    }

    /**
     * Add advanced delete condition
     */
    addAdvDeleteCondition() {
        const conditionsList = document.getElementById('advDeleteConditionsList');
        this.addConditionItem(conditionsList);
    }

    /**
     * Helper to add condition item
     */
    addConditionItem(conditionsList) {
        const div = document.createElement('div');
        div.className = 'condition-item';
        div.innerHTML = `
            <input type="text" placeholder="Column" class="condition-column">
            <select class="condition-operator">
                <option>=</option>
                <option>!=</option>
                <option>></option>
                <option><</option>
                <option>>=</option>
                <option><=</option>
                <option>LIKE</option>
                <option>IN</option>
            </select>
            <input type="text" placeholder="Value" class="condition-value">
            <button class="remove-btn" type="button">Remove</button>
        `;
        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
            this.main();
        });
        conditionsList.appendChild(div);
    }

    /**
     * Copy query to clipboard
     */
    copyToClipboard() {
        const query = this.queryOutput.textContent.trim();
        if (!query) {
            this.showError('No query generated yet. Click Generate Query first.');
            SharedUtilities.showNotification('Nothing to copy', 'warning');
            return;
        }

        SharedUtilities.copyToClipboard(query, 'Query copied to clipboard', 'success');
        this.clearError();
    }

    /**
     * Clear all inputs
     */
    clearAll() {
        // Simple mode
        const simpleTableName = document.getElementById('simplTableName');
        if (simpleTableName) simpleTableName.value = '';
        const simpleColumns = document.getElementById('simpleColumns');
        if (simpleColumns) simpleColumns.value = '';
        const simpleWhere = document.getElementById('simpleWhere');
        if (simpleWhere) simpleWhere.value = '';
        const simpleInsertValues = document.getElementById('simpleInsertValues');
        if (simpleInsertValues) simpleInsertValues.value = '';
        const simpleUpdateSet = document.getElementById('simpleUpdateSet');
        if (simpleUpdateSet) simpleUpdateSet.value = '';
        const simpleUpdateWhere = document.getElementById('simpleUpdateWhere');
        if (simpleUpdateWhere) simpleUpdateWhere.value = '';
        const simpleDeleteWhere = document.getElementById('simpleDeleteWhere');
        if (simpleDeleteWhere) simpleDeleteWhere.value = '';

        // Advanced mode
        const advTableName = document.getElementById('advTableName');
        if (advTableName) advTableName.value = '';
        const advSchema = document.getElementById('advSchema');
        if (advSchema) advSchema.value = '';
        const advColumnsList = document.getElementById('advColumnsList');
        if (advColumnsList) advColumnsList.innerHTML = '';
        const advConditionsList = document.getElementById('advConditionsList');
        if (advConditionsList) advConditionsList.innerHTML = '';
        const advGroupBy = document.getElementById('advGroupBy');
        if (advGroupBy) advGroupBy.value = '';
        const advHaving = document.getElementById('advHaving');
        if (advHaving) advHaving.value = '';
        const advOrderBy = document.getElementById('advOrderBy');
        if (advOrderBy) advOrderBy.value = '';
        const advLimit = document.getElementById('advLimit');
        if (advLimit) advLimit.value = '';
        const advValuesList = document.getElementById('advValuesList');
        if (advValuesList) advValuesList.innerHTML = '';
        const advSetList = document.getElementById('advSetList');
        if (advSetList) advSetList.innerHTML = '';
        const advUpdateConditionsList = document.getElementById('advUpdateConditionsList');
        if (advUpdateConditionsList) advUpdateConditionsList.innerHTML = '';
        const advDeleteConditionsList = document.getElementById('advDeleteConditionsList');
        if (advDeleteConditionsList) advDeleteConditionsList.innerHTML = '';

        if (this.queryOutput) this.queryOutput.textContent = '';
        this.clearError();
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.classList.add('show');
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.classList.remove('show');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SQLQueryBuilder();
});
