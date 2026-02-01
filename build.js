/**
 * Build Configuration for MicroTools Platform
 * Minification, optimization, and performance setup
 * Run with: node build.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Simple CSS Minification
 */
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around special characters
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove leading/trailing spaces
        .trim();
}

/**
 * Simple JavaScript Minification
 * (Basic - for production use a proper tool like terser)
 */
function minifyJS(js) {
    return js
        // Remove single-line comments
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around special characters
        .replace(/\s*([{}();:,=\[\]])\s*/g, '$1')
        // Remove spaces around operators (careful with minus)
        .replace(/\s*([+\-*/])\s*/g, '$1')
        // Trim
        .trim();
}

/**
 * Calculate file statistics
 */
function getFileStats(content) {
    const original = content.length;
    const minified = minifyJS(content).length;
    const reduction = ((original - minified) / original * 100).toFixed(2);
    
    return {
        original: `${(original / 1024).toFixed(2)} KB`,
        minified: `${(minified / 1024).toFixed(2)} KB`,
        reduction: `${reduction}%`
    };
}

/**
 * Process files
 */
function processFiles() {
    log('\n🔧 Starting MicroTools Build Optimization...\n', 'blue');

    const paths = {
        css: [
            'public/assets/css/core.css',
            'public/assets/css/homepage.css',
            'public/assets/css/tools.css'
        ],
        js: [
            'public/assets/js/shared-utilities.js',
            'public/assets/js/utils.js',
            'public/assets/js/homepage.js'
        ]
    };

    let totalOriginal = 0;
    let totalMinified = 0;

    // Process CSS files
    log('📦 Minifying CSS Files...', 'yellow');
    paths.css.forEach(filePath => {
        try {
            const fullPath = path.join(__dirname, filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const minified = minifyCSS(content);

            // Create .min.css file
            const minFilePath = filePath.replace('.css', '.min.css');
            const minFullPath = path.join(__dirname, minFilePath);
            fs.writeFileSync(minFullPath, minified);

            const stats = getFileStats(content);
            totalOriginal += content.length;
            totalMinified += minified.length;

            log(`  ✓ ${path.basename(filePath)}: ${stats.original} → ${stats.minified} (${stats.reduction} saved)`, 'green');
        } catch (err) {
            log(`  ✗ Error processing ${filePath}: ${err.message}`, 'red');
        }
    });

    // Process JS files
    log('\n📦 Minifying JavaScript Files...', 'yellow');
    paths.js.forEach(filePath => {
        try {
            const fullPath = path.join(__dirname, filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const minified = minifyJS(content);

            // Create .min.js file
            const minFilePath = filePath.replace('.js', '.min.js');
            const minFullPath = path.join(__dirname, minFilePath);
            fs.writeFileSync(minFilePath, minified);

            const stats = getFileStats(content);
            totalOriginal += content.length;
            totalMinified += minified.length;

            log(`  ✓ ${path.basename(filePath)}: ${stats.original} → ${stats.minified} (${stats.reduction} saved)`, 'green');
        } catch (err) {
            log(`  ✗ Error processing ${filePath}: ${err.message}`, 'red');
        }
    });

    // Summary
    log('\n📊 Build Summary', 'blue');
    log(`  Total Original: ${(totalOriginal / 1024).toFixed(2)} KB`, 'yellow');
    log(`  Total Minified: ${(totalMinified / 1024).toFixed(2)} KB`, 'yellow');
    log(`  Total Reduction: ${((totalOriginal - totalMinified) / totalOriginal * 100).toFixed(2)}%`, 'green');

    log('\n✅ Build optimization complete!\n', 'green');
}

// Run the build
processFiles();
