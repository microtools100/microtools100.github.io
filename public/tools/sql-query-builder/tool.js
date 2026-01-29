document.addEventListener('DOMContentLoaded', function() {
    let currentMode = 'simple';
    let currentQueryType = 'select';
    
    // Mode switching
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchMode(this.dataset.mode);
        });
    });

    // Simple mode query type
    const queryTypeBtns = document.querySelectorAll('.query-type-btn');
    queryTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchQueryType('simple', this.dataset.type);
        });
    });

    // Advanced mode query type
    const advQueryTypeBtns = document.querySelectorAll('.adv-query-type-btn');
    advQueryTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchQueryType('advanced', this.dataset.type);
        });
    });

    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const queryOutput = document.getElementById('queryOutput');

    generateBtn.addEventListener('click', generateQuery);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyQuery);

    // Simple mode button handlers
    document.getElementById('addAdvColumnBtn')?.addEventListener('click', addAdvColumn);
    document.getElementById('selectAllAdvBtn')?.addEventListener('click', selectAllAdvColumns);
    document.getElementById('addAdvConditionBtn')?.addEventListener('click', addAdvCondition);
    document.getElementById('addAdvValueBtn')?.addEventListener('click', addAdvValue);
    document.getElementById('addAdvSetBtn')?.addEventListener('click', addAdvSet);
    document.getElementById('addAdvUpdateConditionBtn')?.addEventListener('click', addAdvUpdateCondition);
    document.getElementById('addAdvDeleteConditionBtn')?.addEventListener('click', addAdvDeleteCondition);

    function switchMode(mode) {
        currentMode = mode;
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        document.getElementById('simpleMode').classList.toggle('hidden', mode !== 'simple');
        document.getElementById('advancedMode').classList.toggle('hidden', mode !== 'advanced');

        currentQueryType = 'select';
        generateQuery();
    }

    function switchQueryType(mode, type) {
        currentQueryType = type;
        
        if (mode === 'simple') {
            queryTypeBtns.forEach(btn => {
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
            advQueryTypeBtns.forEach(btn => {
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

        generateQuery();
    }

    function addAdvColumn() {
        const columnsList = document.getElementById('advColumnsList');
        const div = document.createElement('div');
        div.className = 'column-item';
        div.innerHTML = `
            <input type="text" placeholder="Column name" class="column-input">
            <button class="remove-btn" onclick="this.parentElement.remove(); document.getElementById('generateBtn').click();">Remove</button>
        `;
        columnsList.appendChild(div);
    }

    function selectAllAdvColumns() {
        document.getElementById('advColumnsList').innerHTML = '';
        generateQuery();
    }

    function addAdvCondition() {
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
            <button class="remove-btn" onclick="this.parentElement.remove(); document.getElementById('generateBtn').click();">Remove</button>
        `;
        conditionsList.appendChild(div);
    }

    function addAdvValue() {
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
            <button class="remove-btn" onclick="this.parentElement.remove(); document.getElementById('generateBtn').click();">Remove</button>
        `;
        valuesList.appendChild(div);
    }

    function addAdvSet() {
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
            <button class="remove-btn" onclick="this.parentElement.remove(); document.getElementById('generateBtn').click();">Remove</button>
        `;
        setList.appendChild(div);
    }

    function addAdvUpdateCondition() {
        const conditionsList = document.getElementById('advUpdateConditionsList');
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
            <button class="remove-btn" onclick="this.parentElement.remove(); document.getElementById('generateBtn').click();">Remove</button>
        `;
        conditionsList.appendChild(div);
    }

    function addAdvDeleteCondition() {
        const conditionsList = document.getElementById('advDeleteConditionsList');
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
            <button class="remove-btn" onclick="this.parentElement.remove(); document.getElementById('generateBtn').click();">Remove</button>
        `;
        conditionsList.appendChild(div);
    }

    function generateQuery() {
        if (currentMode === 'simple') {
            generateSimpleQuery();
        } else {
            generateAdvancedQuery();
        }
    }

    function generateSimpleQuery() {
        const tableName = document.getElementById('simplTableName').value.trim();
        
        if (!tableName) {
            queryOutput.textContent = 'Please enter a table name';
            return;
        }

        let query = '';

        if (currentQueryType === 'select') {
            const columns = document.getElementById('simpleColumns').value.trim() || '*';
            const where = document.getElementById('simpleWhere').value.trim();
            
            query = `SELECT ${columns}\nFROM ${tableName}`;
            if (where) {
                query += `\nWHERE ${where}`;
            }
        } else if (currentQueryType === 'insert') {
            const values = document.getElementById('simpleInsertValues').value.trim();
            if (!values) {
                queryOutput.textContent = 'Please enter column-value pairs';
                return;
            }

            const pairs = values.split('\n').map(line => line.split(',').map(s => s.trim())).filter(p => p.length === 2);
            const columns = pairs.map(p => p[0]).join(', ');
            const vals = pairs.map(p => {
                const val = p[1];
                if (val.toUpperCase() === 'NULL') return 'NULL';
                if (isNaN(val)) return `'${val.replace(/'/g, "''")}'`;
                return val;
            }).join(', ');

            query = `INSERT INTO ${tableName} (${columns})\nVALUES (${vals})`;
        } else if (currentQueryType === 'update') {
            const setValues = document.getElementById('simpleUpdateSet').value.trim();
            const where = document.getElementById('simpleUpdateWhere').value.trim();

            if (!setValues) {
                queryOutput.textContent = 'Please enter SET values';
                return;
            }

            query = `UPDATE ${tableName}\nSET ${setValues}`;
            if (where) {
                query += `\nWHERE ${where}`;
            }
        } else if (currentQueryType === 'delete') {
            const where = document.getElementById('simpleDeleteWhere').value.trim();
            
            query = `DELETE FROM ${tableName}`;
            if (where) {
                query += `\nWHERE ${where}`;
            } else {
                query += '\n-- WARNING: No WHERE clause! This will delete all rows!';
            }
        }

        queryOutput.textContent = query + ';';
    }

    function generateAdvancedQuery() {
        const tableName = document.getElementById('advTableName').value.trim();
        
        if (!tableName) {
            queryOutput.textContent = 'Please enter a table name';
            return;
        }

        let query = '';

        if (currentQueryType === 'select') {
            const columns = Array.from(document.querySelectorAll('#advColumnsList .column-input'))
                .map(input => input.value.trim())
                .filter(v => v);
            
            const columnList = columns.length > 0 ? columns.join(', ') : '*';
            query = `SELECT ${columnList}\nFROM ${tableName}`;

            const conditions = getAdvConditions('#advConditionsList');
            if (conditions.length > 0) {
                query += `\nWHERE ${conditions.join(' AND ')}`;
            }

            const groupBy = document.getElementById('advGroupBy').value.trim();
            if (groupBy) {
                query += `\nGROUP BY ${groupBy}`;
            }

            const having = document.getElementById('advHaving').value.trim();
            if (having) {
                query += `\nHAVING ${having}`;
            }

            const orderBy = document.getElementById('advOrderBy').value.trim();
            if (orderBy) {
                query += `\nORDER BY ${orderBy}`;
            }

            const limit = document.getElementById('advLimit').value.trim();
            if (limit) {
                query += `\nLIMIT ${limit}`;
            }
        } else if (currentQueryType === 'insert') {
            const values = Array.from(document.querySelectorAll('#advValuesList .value-item'));
            
            if (values.length === 0) {
                queryOutput.textContent = 'Please add at least one value';
                return;
            }

            const columns = values.map(item => item.querySelector('.value-column').value.trim()).filter(v => v);
            const vals = values.map(item => {
                const type = item.querySelector('.set-type')?.value || 'string';
                const val = item.querySelector('.value-input').value.trim();
                
                if (type === 'null' || val.toUpperCase() === 'NULL') return 'NULL';
                if (type === 'number') return val;
                return `'${val.replace(/'/g, "''")}'`;
            });

            const columnList = columns.join(', ');
            const valueList = vals.join(', ');
            query = `INSERT INTO ${tableName} (${columnList})\nVALUES (${valueList})`;
        } else if (currentQueryType === 'update') {
            const setItems = Array.from(document.querySelectorAll('#advSetList .set-item'));
            
            if (setItems.length === 0) {
                queryOutput.textContent = 'Please add at least one SET value';
                return;
            }

            const setPairs = setItems.map(item => {
                const col = item.querySelector('.set-column').value.trim();
                const type = item.querySelector('.set-type').value;
                const val = item.querySelector('.set-value').value.trim();
                
                let formattedVal;
                if (type === 'null' || val.toUpperCase() === 'NULL') formattedVal = 'NULL';
                else if (type === 'number') formattedVal = val;
                else formattedVal = `'${val.replace(/'/g, "''")}'`;
                
                return `${col} = ${formattedVal}`;
            }).filter(p => p);

            query = `UPDATE ${tableName}\nSET ${setPairs.join(', ')}`;

            const conditions = getAdvConditions('#advUpdateConditionsList');
            if (conditions.length > 0) {
                query += `\nWHERE ${conditions.join(' AND ')}`;
            }
        } else if (currentQueryType === 'delete') {
            query = `DELETE FROM ${tableName}`;

            const conditions = getAdvConditions('#advDeleteConditionsList');
            if (conditions.length > 0) {
                query += `\nWHERE ${conditions.join(' AND ')}`;
            } else {
                query += '\n-- WARNING: No WHERE clause! This will delete all rows!';
            }
        }

        queryOutput.textContent = query + ';';
    }

    function getAdvConditions(selector) {
        return Array.from(document.querySelectorAll(`${selector} .condition-item`))
            .map(item => {
                const col = item.querySelector('.condition-column').value.trim();
                const op = item.querySelector('.condition-operator').value;
                const val = item.querySelector('.condition-value').value.trim();
                
                if (!col) return '';
                
                if (op.includes('NULL')) {
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

    function clearAll() {
        document.getElementById('simplTableName').value = '';
        document.getElementById('simpleColumns').value = '';
        document.getElementById('simpleWhere').value = '';
        document.getElementById('simpleInsertValues').value = '';
        document.getElementById('simpleUpdateSet').value = '';
        document.getElementById('simpleUpdateWhere').value = '';
        document.getElementById('simpleDeleteWhere').value = '';

        document.getElementById('advTableName').value = '';
        document.getElementById('advSchema').value = '';
        document.getElementById('advColumnsList').innerHTML = '';
        document.getElementById('advConditionsList').innerHTML = '';
        document.getElementById('advGroupBy').value = '';
        document.getElementById('advHaving').value = '';
        document.getElementById('advOrderBy').value = '';
        document.getElementById('advLimit').value = '';
        document.getElementById('advValuesList').innerHTML = '';
        document.getElementById('advSetList').innerHTML = '';
        document.getElementById('advUpdateConditionsList').innerHTML = '';
        document.getElementById('advDeleteConditionsList').innerHTML = '';

        queryOutput.textContent = '';
    }

    function copyQuery() {
        const query = queryOutput.textContent;
        if (!query || query.includes('Please')) {
            if (window.MicroTools?.utils?.showNotification) {
                window.MicroTools.utils.showNotification('No query to copy', 'error');
            }
            return;
        }

        navigator.clipboard.writeText(query).then(() => {
            if (window.MicroTools?.utils?.showNotification) {
                window.MicroTools.utils.showNotification('Query copied to clipboard!', 'success');
            }
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }
});
