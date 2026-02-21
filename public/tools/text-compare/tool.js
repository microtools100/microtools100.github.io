// Version Comparison Tool

class VersionComparison {
    constructor() {
        this.versionOriginal = document.getElementById('versionOriginal');
        this.versionUpdated = document.getElementById('versionUpdated');
        this.ignoreCase = document.getElementById('ignoreCase');
        this.ignoreWhitespace = document.getElementById('ignoreWhitespace');
        this.showStats = document.getElementById('showStats');
        this.resultsOutput = document.getElementById('resultsOutput');
        this.statsContainer = document.getElementById('stats-container');
        this.LINE_LEVEL_THRESHOLD = 0.5; // Show line-level diff if > 50% of words are different

        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.copyResultsBtn = document.getElementById('copyResultsBtn');
        
        this.init();
        this.addExcelExportButton(); // Add this line
    }

    init() {
        this.showUnchanged = document.getElementById('showUnchanged');
        
        // Input listeners
        this.versionOriginal.addEventListener('input', () => this.compare());
        this.versionUpdated.addEventListener('input', () => this.compare());
        this.ignoreCase.addEventListener('change', () => this.compare());
        this.ignoreWhitespace.addEventListener('change', () => this.compare());
        this.showStats.addEventListener('change', () => this.toggleStats());
        if (this.showUnchanged) {
            this.showUnchanged.addEventListener('change', () => this.compare());
        }
        
        // Button listeners
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.copyResultsBtn.addEventListener('click', () => this.copyResults());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Ensure stats area is rendered consistently on load
        this.resetStats();
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'e') {
                e.preventDefault();
                this.clearAll();
            }
        }
    }


    clearAll() {
        this.versionOriginal.value = '';
        this.versionUpdated.value = '';
        this.resultsOutput.innerHTML = '<div class="empty-state"><p>Paste two versions to see the comparison results here</p></div>';
        this.resetStats();
    }

    compare() {
        let original = this.versionOriginal.value;
        let updated = this.versionUpdated.value;

        if (this.ignoreCase.checked) {
            original = original.toLowerCase();
            updated = updated.toLowerCase();
        }

        const originalLines = original.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const updatedLines = updated.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const comparison = this.performComparison(originalLines, updatedLines);
        this.displayResults(comparison);
        this.displayStats(comparison);
    }

    performComparison(original, updated) {
        // Create result array following updated version order
        const result = [];
        const matchedOriginal = new Set();
        const processedUpdated = new Set();
        
        // First pass: Find exact matches
        for (let j = 0; j < updated.length; j++) {
            for (let i = 0; i < original.length; i++) {
                if (!matchedOriginal.has(i) && this.areEqual(original[i], updated[j])) {
                    result.push({
                        type: 'unchanged',
                        originalIndex: i,
                        updatedIndex: j,
                        content: updated[j]
                    });
                    matchedOriginal.add(i);
                    processedUpdated.add(j);
                    break;
                }
            }
        }
        
        // Second pass: Find modified lines with lower threshold
        // Calculate similarity for all remaining pairs
        const similarityMatrix = [];
        for (let i = 0; i < original.length; i++) {
            if (matchedOriginal.has(i)) continue;
            similarityMatrix[i] = [];
            for (let j = 0; j < updated.length; j++) {
                if (processedUpdated.has(j)) continue;
                similarityMatrix[i][j] = this.calculateSimilarity(original[i], updated[j]);
            }
        }
        
        // Greedy matching for modified lines (lower threshold = 0.3)
        const MODIFICATION_THRESHOLD = 0.3;
        let changed;
        do {
            changed = false;
            let bestI = -1, bestJ = -1;
            let bestSimilarity = MODIFICATION_THRESHOLD;
            
            // Find the best matching pair
            for (let i = 0; i < original.length; i++) {
                if (matchedOriginal.has(i)) continue;
                for (let j = 0; j < updated.length; j++) {
                    if (processedUpdated.has(j)) continue;
                    const similarity = similarityMatrix[i][j];
                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestI = i;
                        bestJ = j;
                    }
                }
            }
            
            if (bestI !== -1) {
                // Found a modified line match
                result.push({
                    type: 'modified',
                    originalIndex: bestI,
                    updatedIndex: bestJ,
                    original: original[bestI],
                    updated: updated[bestJ]
                });
                matchedOriginal.add(bestI);
                processedUpdated.add(bestJ);
                changed = true;
            }
        } while (changed);
        
        // Third pass: Check for moved lines (content appears elsewhere)
        // Create a map of normalized content for remaining original lines
        const originalContentMap = new Map();
        for (let i = 0; i < original.length; i++) {
            if (matchedOriginal.has(i)) continue;
            const normalizedContent = this.normalizeContent(original[i]);
            if (!originalContentMap.has(normalizedContent)) {
                originalContentMap.set(normalizedContent, []);
            }
            originalContentMap.get(normalizedContent).push(i);
        }
        
        // Match remaining updated lines with similar content from original
        for (let j = 0; j < updated.length; j++) {
            if (processedUpdated.has(j)) continue;
            
            const normalizedContent = this.normalizeContent(updated[j]);
            
            // Check for exact content match (ignoring case/whitespace)
            if (originalContentMap.has(normalizedContent)) {
                const originalIndices = originalContentMap.get(normalizedContent);
                if (originalIndices.length > 0) {
                    const originalIndex = originalIndices.shift();
                    result.push({
                        type: 'modified',
                        originalIndex: originalIndex,
                        updatedIndex: j,
                        original: original[originalIndex],
                        updated: updated[j],
                        isMoved: true
                    });
                    matchedOriginal.add(originalIndex);
                    processedUpdated.add(j);
                    continue;
                }
            }
            
            // Check for similar content with very low threshold (0.2)
            let bestMatch = -1;
            let bestSimilarity = 0.2;
            
            for (let i = 0; i < original.length; i++) {
                if (matchedOriginal.has(i)) continue;
                const similarity = this.calculateSimilarity(original[i], updated[j]);
                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity;
                    bestMatch = i;
                }
            }
            
            if (bestMatch !== -1) {
                result.push({
                    type: 'modified',
                    originalIndex: bestMatch,
                    updatedIndex: j,
                    original: original[bestMatch],
                    updated: updated[j]
                });
                matchedOriginal.add(bestMatch);
                processedUpdated.add(j);
            }
        }
        
        // Sort results by updated index to maintain order
        const sortedResult = [];
        for (let j = 0; j < updated.length; j++) {
            const item = result.find(r => r.updatedIndex === j);
            if (item) {
                sortedResult.push(item);
            } else {
                // This is an added line
                sortedResult.push({
                    type: 'added',
                    updatedIndex: j,
                    content: updated[j]
                });
            }
        }
        
        // Add remaining unmatched original lines as removed (in original order)
        for (let i = 0; i < original.length; i++) {
            if (!matchedOriginal.has(i)) {
                sortedResult.push({
                    type: 'removed',
                    originalIndex: i,
                    content: original[i]
                });
            }
        }
        
        return sortedResult;
    }
    
    // Helper method to normalize content for move detection
    normalizeContent(content) {
        let normalized = content;
        if (this.ignoreCase && this.ignoreCase.checked) {
            normalized = normalized.toLowerCase();
        }
        if (this.ignoreWhitespace && this.ignoreWhitespace.checked) {
            normalized = normalized.replace(/\s+/g, ' ').trim();
        }
        return normalized;
    }
    areEqual(a, b) {
        if (this.ignoreWhitespace.checked) {
            a = a.replace(/\s+/g, ' ').trim();
            b = b.replace(/\s+/g, ' ').trim();
        }
        return a === b;
    }

    // Update calculateSimilarity to be more accurate for longer texts
    calculateSimilarity(a, b) {
        if (this.ignoreWhitespace.checked) {
            a = a.replace(/\s+/g, ' ').trim();
            b = b.replace(/\s+/g, ' ').trim();
        }
        if (this.ignoreCase.checked) {
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        
        // If one is empty, similarity is 0
        if (a.length === 0 || b.length === 0) return 0;
        
        // Use Levenshtein distance for better accuracy
        const distance = this.levenshteinDistance(a, b);
        const maxLength = Math.max(a.length, b.length);
        
        return 1 - (distance / maxLength);
    }

    // Add Levenshtein distance for better similarity calculation
    levenshteinDistance(a, b) {
        const matrix = [];
        
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1       // deletion
                    );
                }
            }
        }
        
        return matrix[b.length][a.length];
    }

    // Helper method to check if word change is minor (< 40% different)
    isMinorWordChange(origWord, updWord) {
        const minLen = Math.min(origWord.length, updWord.length);
        const maxLen = Math.max(origWord.length, updWord.length);
        
        if (maxLen === 0) return true;
        
        // Calculate character match percentage
        let charMatches = 0;
        for (let i = 0; i < minLen; i++) {
            if (origWord[i] === updWord[i]) {
                charMatches++;
            }
        }
        
        const changePercentage = 1 - (charMatches / maxLen);
        return changePercentage < 0.4; // Less than 40% different = minor change
    }

    getWordDifferences(original, updated) {
        // Don't convert to lowercase here - let the comparison options handle it
        const origWords = original.split(/\s+/);
        const updWords = updated.split(/\s+/);
        
        const result = [];
        const maxLen = Math.max(origWords.length, updWords.length);
        
        for (let i = 0; i < maxLen; i++) {
            const origWord = origWords[i] || '';
            const updWord = updWords[i] || '';
            
            // Compare based on ignoreCase setting
            let areEqual;
            if (this.ignoreCase.checked) {
                areEqual = origWord.toLowerCase() === updWord.toLowerCase();
            } else {
                areEqual = origWord === updWord;
            }
            
            if (!origWord && updWord) {
                // New word added
                result.push({ type: 'added', word: updWord });
            } else if (origWord && !updWord) {
                // Word removed
                result.push({ type: 'removed', word: origWord });
            } else if (areEqual) {
                // Words match (preserve original case)
                result.push({ type: 'same', word: origWords[i] });
            } else {
                // Words differ - check if it's a minor change
                const origForCompare = this.ignoreCase.checked ? origWord.toLowerCase() : origWord;
                const updForCompare = this.ignoreCase.checked ? updWord.toLowerCase() : updWord;
                
                if (this.isMinorWordChange(origForCompare, updForCompare)) {
                    // Minor change - show character-level diff with original case preserved
                    const charDiff = this.getCharDifferences(origWord, updWord);
                    result.push({ type: 'modified-word', charDiff: charDiff, origWord: origWords[i], updWord: updWords[i] });
                } else {
                    // Major change - show as removed+added at word level
                    result.push({ type: 'removed', word: origWords[i] });
                    result.push({ type: 'added', word: updWords[i] });
                }
            }
        }
        
        return result;
    }

    // Character-level diff using simple algorithm
    getCharDifferences(original, updated) {
        const result = [];
        let i = 0, j = 0;

        while (i < original.length || j < updated.length) {
            if (i < original.length && j < updated.length && original[i] === updated[j]) {
                // Characters match
                result.push({ type: 'same', char: original[i] });
                i++;
                j++;
            } else if (i < original.length && j < updated.length) {
                // Characters differ - simple substitution
                const origChar = original[i];
                const updChar = updated[j];

                result.push({ type: 'removed', char: origChar });
                result.push({ type: 'added', char: updChar });
                i++;
                j++;
            } else if (i < original.length) {
                // Original has extra characters (removed)
                result.push({ type: 'removed', char: original[i] });
                i++;
            } else {
                // Updated has extra characters (added)
                result.push({ type: 'added', char: updated[j] });
                j++;
            }
        }

        return result;
    }

    displayResults(comparison) {
        if (comparison.length === 0) {
            this.resultsOutput.innerHTML = '<div class="empty-state"><p>Paste two versions to see the comparison results here</p></div>';
            return;
        }

        const showUnchangedLines = this.showUnchanged ? this.showUnchanged.checked : true;
        let html = '';
        let addedCount = 0, removedCount = 0, modifiedCount = 0, unchangedCount = 0;

        for (let item of comparison) {
            let lineHtml = '';

            switch (item.type) {
                case 'unchanged':
                    unchangedCount++;
                    if (showUnchangedLines) {
                        lineHtml = `<div class="result-line line-unchanged" data-type="unchanged">${this.escapeHTML(item.content)}</div>`;
                    }
                    break;

                case 'added':
                    addedCount++;
                    lineHtml = `<div class="result-line line-added" data-type="added">${this.escapeHTML(item.content)}</div>`;
                    break;

                case 'removed':
                    removedCount++;
                    lineHtml = `<div class="result-line line-removed" data-type="removed"><span class="char-removed" style="text-decoration: line-through;">${this.escapeHTML(item.content)}</span></div>`;
                    break;
                case 'modified':
                    modifiedCount++;
                    
                    // Calculate what percentage of words are different
                    const wordDiff = this.getWordDifferences(item.original, item.updated);
                    let totalWords = 0;
                    let changedWords = 0;
                    
                    for (let word of wordDiff) {
                        if (word.type === 'same') {
                            totalWords++;
                        } else if (word.type === 'removed' || word.type === 'added' || word.type === 'modified-word') {
                            totalWords++;
                            changedWords++;
                        }
                    }
                    
                    const changePercentage = totalWords > 0 ? changedWords / totalWords : 0;
                    
                    // Decide whether to show word-level or line-level diff
                    if (changePercentage > this.LINE_LEVEL_THRESHOLD) {
                        // Show line-level diff (old version vs new version)
                        let oldLineHtml = '';
                        let newLineHtml = '';
                        
                        // Process old version words
                        for (let word of wordDiff) {
                            if (word.type === 'same' || word.type === 'removed' || word.type === 'modified-word') {
                                if (word.type === 'modified-word') {
                                    // For modified words in old version, show them as removed
                                    let charHighlight = '';
                                    for (let char of word.charDiff) {
                                        const escapedChar = this.escapeHTML(char.char);
                                        if (char.type === 'same' || char.type === 'removed') {
                                            charHighlight += `<span class="char-removed">${escapedChar}</span>`;
                                        }
                                    }
                                    oldLineHtml += charHighlight + ' ';
                                } else if (word.type === 'removed') {
                                    oldLineHtml += `<span class="char-removed">${this.escapeHTML(word.word)}</span> `;
                                } else {
                                    oldLineHtml += this.escapeHTML(word.word) + ' ';
                                }
                            }
                        }
                        
                        // Process new version words
                        for (let word of wordDiff) {
                            if (word.type === 'same' || word.type === 'added' || word.type === 'modified-word') {
                                if (word.type === 'modified-word') {
                                    // For modified words in new version, show them as added
                                    let charHighlight = '';
                                    for (let char of word.charDiff) {
                                        const escapedChar = this.escapeHTML(char.char);
                                        if (char.type === 'same' || char.type === 'added') {
                                            charHighlight += `<span class="char-added">${escapedChar}</span>`;
                                        }
                                    }
                                    newLineHtml += charHighlight + ' ';
                                } else if (word.type === 'added') {
                                    newLineHtml += `<span class="char-added">${this.escapeHTML(word.word)}</span> `;
                                } else {
                                    newLineHtml += this.escapeHTML(word.word) + ' ';
                                }
                            }
                        }
                        
                        lineHtml = `<div class="result-line line-modified" data-type="modified">
                            <div class="line-diff-container">
                                <div class="old-version-line"><span class="diff-label">Old:</span> ${oldLineHtml.trim()}</div>
                                <div class="new-version-line"><span class="diff-label">New:</span> ${newLineHtml.trim()}</div>
                            </div>
                        </div>`;
                    } else {
                        // Show word-level diff (current behavior)
                        let formattedLine = '';
                        
                        for (let word of wordDiff) {
                            if (word.type === 'same') {
                                formattedLine += this.escapeHTML(word.word) + ' ';
                            } else if (word.type === 'removed') {
                                formattedLine += `<span class="char-removed">${this.escapeHTML(word.word)}</span> `;
                            } else if (word.type === 'added') {
                                formattedLine += `<span class="char-added">${this.escapeHTML(word.word)}</span> `;
                            } else if (word.type === 'modified-word') {
                                // For individual words that changed, show character-level diff
                                let charHighlight = '';
                                for (let char of word.charDiff) {
                                    const escapedChar = this.escapeHTML(char.char);
                                    if (char.type === 'same') {
                                        charHighlight += escapedChar;
                                    } else if (char.type === 'removed') {
                                        charHighlight += `<span class="char-removed">${escapedChar}</span>`;
                                    } else if (char.type === 'added') {
                                        charHighlight += `<span class="char-added">${escapedChar}</span>`;
                                    }
                                }
                                formattedLine += charHighlight + ' ';
                            }
                        }
                        
                        lineHtml = `<div class="result-line line-modified" data-type="modified">${formattedLine.trim()}</div>`;
                    }
                    break;            }

            html += lineHtml;
        }

        this.resultsOutput.innerHTML = html || '<div class="empty-state"><p>No differences found</p></div>';
        this.updateResultsCounter(unchangedCount, addedCount, removedCount, modifiedCount);
    }

    // Add Excel export button
    addExcelExportButton() {
        const resultsActions = document.querySelector('.results-actions');
        if (resultsActions) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-success';
            exportBtn.id = 'exportExcelBtn';
            exportBtn.innerHTML = '📊 Export to Excel';
            exportBtn.style.marginLeft = '10px';
            exportBtn.style.backgroundColor = '#28a745';
            exportBtn.style.color = 'white';
            exportBtn.addEventListener('click', () => this.exportToExcel());
            resultsActions.appendChild(exportBtn);
        }
    }

    // Export to Excel with formatting
    exportToExcel() {
        const lines = this.resultsOutput.querySelectorAll('.result-line');
        if (lines.length === 0) {
            alert('No results to export');
            return;
        }

        const showUnchangedLines = this.showUnchanged ? this.showUnchanged.checked : true;
        
        // Create HTML content with inline styles for Excel
        let htmlContent = `
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    .line-added { color: #28a745; }
                    .line-removed { color: #dc3545; text-decoration: line-through; }
                    .line-modified { color: #ffc107; }
                    .line-unchanged { color: #000000; }
                    .char-added { color: #28a745; font-weight: bold; }
                    .char-removed { color: #dc3545; text-decoration: line-through; font-weight: bold; }
                    .result-line { 
                        font-family: 'Courier New', monospace; 
                        padding: 4px; 
                        border-bottom: 1px solid #eee;
                        white-space: pre-wrap;
                    }
                </style>
            </head>
            <body>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Change Type</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Line Content</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        lines.forEach(line => {
            const type = line.getAttribute('data-type');
            
            if (type === 'unchanged' && !showUnchangedLines) {
                return;
            }
            
            let changeType = '';
            let rowClass = '';
            
            switch (type) {
                case 'added':
                    changeType = 'Added';
                    rowClass = 'line-added';
                    break;
                case 'removed':
                    changeType = 'Removed';
                    rowClass = 'line-removed';
                    break;
                case 'modified':
                    changeType = 'Modified';
                    rowClass = 'line-modified';
                    break;
                case 'unchanged':
                    changeType = 'Unchanged';
                    rowClass = 'line-unchanged';
                    break;
            }
            
            // Get the HTML content with preserved formatting
            const lineContent = line.innerHTML;
            
            htmlContent += `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${changeType}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;" class="${rowClass}">${lineContent}</td>
                </tr>
            `;
        });

        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'version_comparison.xls';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    updateResultsCounter(unchanged, added, removed, modified) {
        const counter = document.getElementById('results-counter');
        if (counter) {
            const parts = [];
            if (added > 0) parts.push(`<span class="counter-added">+${added}</span>`);
            if (removed > 0) parts.push(`<span class="counter-removed">-${removed}</span>`);
            if (modified > 0) parts.push(`<span class="counter-modified">~${modified}</span>`);
            if (unchanged > 0) parts.push(`<span class="counter-unchanged">${unchanged} unchanged</span>`);
            counter.innerHTML = parts.join(' • ') || 'No changes';
        }
    }

    displayStats(comparison) {
        if (!this.showStats.checked) return;

        const stats = {
            totalLines: comparison.length,
            unchanged: 0,
            added: 0,
            removed: 0,
            modified: 0
        };

        for (let item of comparison) {
            stats[item.type]++;
        }

        const html = this.renderStatsHtml(stats);
        this.statsContainer.innerHTML = html;
        this.statsContainer.style.display = 'block';
    }

    renderStatsHtml(stats) {
        return `
            <div class="stats-box">
                <h3>Comparison Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Total Lines:</span>
                        <span class="stat-value">${stats.totalLines}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Unchanged:</span>
                        <span class="stat-value stat-unchanged">${stats.unchanged}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Added:</span>
                        <span class="stat-value stat-added">${stats.added}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Removed:</span>
                        <span class="stat-value stat-removed">${stats.removed}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Modified:</span>
                        <span class="stat-value stat-modified">${stats.modified}</span>
                    </div>
                </div>
            </div>
        `;
    }

    toggleStats() {
        if (this.showStats.checked) {
            this.statsContainer.style.display = 'block';
        } else {
            this.statsContainer.style.display = 'none';
        }
    }

    resetStats() {
        const stats = { totalLines: 0, unchanged: 0, added: 0, removed: 0, modified: 0 };
        this.statsContainer.innerHTML = this.renderStatsHtml(stats);
        // Hide stats unless the checkbox is checked
        this.statsContainer.style.display = (this.showStats && this.showStats.checked) ? 'block' : 'none';
    }

    copyResults() {
        const lines = this.resultsOutput.querySelectorAll('.result-line');

        if (lines.length === 0) {
            alert('No results to copy');
            return;
        }

        let text = '';
        lines.forEach(line => {
            const type = line.getAttribute('data-type');
            
            if (type === 'unchanged') {
                // Skip unchanged lines in copy
                return;
            }
            
            text += line.innerText.trim() + '\n';
        });

        if (text.trim().length === 0) {
            alert('No changes to copy');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            const originalText = this.copyResultsBtn.textContent;
            this.copyResultsBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyResultsBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            alert('Failed to copy to clipboard');
        });
    }

    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize tool when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VersionComparison();
});
