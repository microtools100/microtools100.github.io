/**
 * Bundle Analyzer
 * Analyzes and reports on bundle sizes and optimization opportunities
 * Run with: node analyze-bundle.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function analyzeFiles() {
    log('\n🔍 Bundle Analysis Report\n', 'cyan');

    const dirs = {
        'JavaScript': 'public/assets/js',
        'CSS': 'public/assets/css',
        'Tools': 'public/tools'
    };

    let totalSize = 0;

    for (const [label, dir] of Object.entries(dirs)) {
        log(`\n📦 ${label} Files`, 'blue');
        log('─'.repeat(50), 'blue');

        const fullPath = path.join(__dirname, dir);
        if (!fs.existsSync(fullPath)) continue;

        let dirSize = 0;
        const files = fs.readdirSync(fullPath);

        files.forEach(file => {
            const filePath = path.join(fullPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
                const size = stat.size;
                dirSize += size;
                totalSize += size;

                const sizeFormatted = formatBytes(size);
                log(`  ${file.padEnd(35)} ${sizeFormatted.padStart(12)}`);
            }
        });

        log(`  ${'Total'.padEnd(35)} ${formatBytes(dirSize).padStart(12)}`, 'green');
    }

    // Tool analysis
    log(`\n📦 Tool Breakdown`, 'blue');
    log('─'.repeat(50), 'blue');

    const toolsDir = path.join(__dirname, 'public/tools');
    const toolDirs = fs.readdirSync(toolsDir).filter(f => 
        fs.statSync(path.join(toolsDir, f)).isDirectory()
    );

    let toolsTotal = 0;
    toolDirs.forEach(tool => {
        const toolPath = path.join(toolsDir, tool);
        let toolSize = 0;

        fs.readdirSync(toolPath).forEach(file => {
            const filePath = path.join(toolPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                toolSize += stat.size;
                toolsTotal += stat.size;
            }
        });

        const sizeFormatted = formatBytes(toolSize);
        log(`  ${tool.padEnd(35)} ${sizeFormatted.padStart(12)}`);
    });

    log(`  ${'Total'.padEnd(35)} ${formatBytes(toolsTotal).padStart(12)}`, 'green');

    // Summary
    log(`\n📊 Summary`, 'blue');
    log('─'.repeat(50), 'blue');
    log(`  Total Bundle Size: ${formatBytes(totalSize)}`, 'cyan');

    // Optimization suggestions
    log(`\n💡 Optimization Opportunities`, 'yellow');
    log('─'.repeat(50), 'yellow');

    if (totalSize > 1024 * 1024) {
        log(`  ⚠️  Bundle size is ${formatBytes(totalSize)} - consider code splitting`, 'yellow');
    }

    log(`  ✓ Use gzip compression (saves ~60%)`, 'green');
    log(`  ✓ Minify all CSS and JS files`, 'green');
    log(`  ✓ Lazy load tool files on demand`, 'green');
    log(`  ✓ Use service worker for caching`, 'green');

    log('\n✅ Analysis complete!\n', 'green');
}

analyzeFiles();
