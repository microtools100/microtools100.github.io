// Complete Tools Registry for MicroTools Platform
// This file defines all 25 tools with their configuration, categories, and metadata

const TOOLS_REGISTRY = {
  phase1: [
    {
      id: 'title-case-converter',
      name: 'Title Case Converter',
      category: 'text-case-tools',
      categoryLabel: 'Text Case Tools',
      description: 'Convert text to title case format. Capitalize each word properly.',
      icon: '📝',
      url: '/tools/title-case-converter/',
      keywords: 'title case, capitalize words, text converter',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'sentence-case-converter',
      name: 'Sentence Case Converter',
      category: 'text-case-tools',
      categoryLabel: 'Text Case Tools',
      description: 'Convert text to sentence case. Only first letter and proper nouns capitalized.',
      icon: '💬',
      url: '/tools/sentence-case-converter/',
      keywords: 'sentence case, capitalize sentences, text formatting',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'text-uppercase',
      name: 'Text Uppercase Converter',
      category: 'text-case-tools',
      categoryLabel: 'Text Case Tools',
      description: 'Convert any text to uppercase instantly. Perfect for headings and emphasis.',
      icon: 'T↑',
      url: '/tools/text-uppercase/',
      keywords: 'uppercase converter, convert to uppercase, text to caps',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'text-lowercase',
      name: 'Text Lowercase Converter',
      category: 'text-case-tools',
      categoryLabel: 'Text Case Tools',
      description: 'Convert text to lowercase. Useful for formatting and standardization.',
      icon: 'T↓',
      url: '/tools/text-lowercase/',
      keywords: 'lowercase converter, convert to lowercase, text to lowercase',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'word-character-counter',
      name: 'Word & Character Counter',
      category: 'text-analysis',
      categoryLabel: 'Text Analysis Tools',
      description: 'Count words, characters, sentences, paragraphs. Get detailed text statistics instantly.',
      icon: '#️⃣',
      url: '/tools/word-character-counter/',
      keywords: 'word counter, character counter, text analyzer, word count',
      priority: 0.90,
      status: 'in-progress'
    },
    {
      id: 'text-compare-diff',
      name: 'Text Compare & Diff',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Compare two texts side-by-side and highlight differences. Find changes instantly.',
      icon: '🔀',
      url: '/tools/text-compare-diff/',
      keywords: 'text compare, diff, difference finder, text comparison',
      priority: 0.80,
      status: 'not-started'
    },
    {
      id: 'duplicate-line-remover',
      name: 'Duplicate Line Remover',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Remove duplicate lines from text. Keep unique lines only.',
      icon: '🚫',
      url: '/tools/duplicate-line-remover/',
      keywords: 'remove duplicates, duplicate remover, unique lines',
      priority: 0.80,
      status: 'not-started'
    },
    {
      id: 'remove-extra-spaces',
      name: 'Remove Extra Spaces',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Clean up text by removing extra spaces, tabs, and line breaks.',
      icon: '␣',
      url: '/tools/remove-extra-spaces/',
      keywords: 'remove spaces, space remover, clean text, extra spaces',
      priority: 0.80,
      status: 'complete'
    },
    {
      id: 'base64-encoder-decoder',
      name: 'Base64 Encoder/Decoder',
      category: 'encoding-tools',
      categoryLabel: 'Encoding Tools',
      description: 'Encode text to Base64 and decode Base64 strings. Essential for developers.',
      icon: '🔐',
      url: '/tools/base64-encoder-decoder/',
      keywords: 'base64 encode, base64 decode, encoding tool, data encoding',
      priority: 0.95,
      status: 'not-started'
    },
    {
      id: 'html-escape-unescape',
      name: 'HTML Escape/Unescape',
      category: 'encoding-tools',
      categoryLabel: 'Encoding Tools',
      description: 'Escape and unescape HTML entities. Handle special characters properly.',
      icon: '&lt;/&gt;',
      url: '/tools/html-escape-unescape/',
      keywords: 'html escape, html entity, escape characters',
      priority: 0.85,
      status: 'not-started'
    },
    {
      id: 'json-to-csv',
      name: 'JSON to CSV Converter',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert JSON arrays to CSV format. Customizable delimiters and formatting.',
      icon: '📊',
      url: '/tools/json-to-csv/',
      keywords: 'json to csv, json converter, csv export',
      priority: 0.90,
      status: 'not-started'
    },
    {
      id: 'csv-to-json',
      name: 'CSV to JSON Converter',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert CSV data to JSON format. Pretty print and validate your data.',
      icon: '📋',
      url: '/tools/csv-to-json/',
      keywords: 'csv to json, data converter, csv converter',
      priority: 0.90,
      status: 'not-started'
    },
    {
      id: 'json-formatter',
      name: 'JSON Formatter & Validator',
      category: 'json-tools',
      categoryLabel: 'JSON Tools',
      description: 'Format, validate, minify and beautify JSON with syntax highlighting.',
      icon: '{}',
      url: '/tools/json-formatter/',
      keywords: 'json formatter, json validator, format json, beautify json',
      priority: 0.95,
      status: 'complete'
    },
    {
      id: 'qr-code-generator',
      name: 'QR Code Generator',
      category: 'conversion-tools',
      categoryLabel: 'Conversion Tools',
      description: 'Generate QR codes from text or URLs instantly. Download as image.',
      icon: '📱',
      url: '/tools/qr-code-generator/',
      keywords: 'qr code generator, generate qr code, qr code maker',
      priority: 0.92,
      status: 'not-started'
    },
    {
      id: 'password-strength-checker',
      name: 'Password Strength Checker',
      category: 'password-tools',
      categoryLabel: 'Password Tools',
      description: 'Check password strength in real-time. Get security recommendations.',
      icon: '🛡️',
      url: '/tools/password-strength-checker/',
      keywords: 'password strength, password checker, password security',
      priority: 0.92,
      status: 'not-started'
    },
    {
      id: 'random-team-generator',
      name: 'Random Team Generator',
      category: 'random-generators',
      categoryLabel: 'Random Generators',
      description: 'Divide items or names into random teams. Fair distribution guaranteed.',
      icon: '👥',
      url: '/tools/random-team-generator/',
      keywords: 'random team, team generator, divide teams, group generator',
      priority: 0.85,
      status: 'not-started'
    },
    {
      id: 'decision-maker',
      name: 'Decision Maker',
      category: 'random-generators',
      categoryLabel: 'Random Generators',
      description: 'Get random decisions with spinning wheel. Yes/No, Coin flip, Dice roll.',
      icon: '🎡',
      url: '/tools/decision-maker/',
      keywords: 'decision maker, random decision, coin flip, yes or no',
      priority: 0.82,
      status: 'not-started'
    },
    {
      id: 'fake-data-generator',
      name: 'Fake Data Generator',
      category: 'testing-tools',
      categoryLabel: 'Testing Tools',
      description: 'Generate realistic fake data for testing. Names, emails, addresses, more.',
      icon: '🤖',
      url: '/tools/fake-data-generator/',
      keywords: 'fake data, test data generator, mock data, dummy data',
      priority: 0.88,
      status: 'not-started'
    },
    {
      id: 'unit-converter',
      name: 'Unit Converter',
      category: 'conversion-tools',
      categoryLabel: 'Conversion Tools',
      description: 'Convert between units. Length, weight, temperature, volume, time.',
      icon: '📏',
      url: '/tools/unit-converter/',
      keywords: 'unit converter, convert units, length converter, weight converter',
      priority: 0.88,
      status: 'not-started'
    }
  ],
  
  phase2: [
    {
      id: 'reading-time-calculator',
      name: 'Reading Time Calculator',
      category: 'text-analysis',
      categoryLabel: 'Text Analysis Tools',
      description: 'Calculate estimated reading time for any text. Adjustable reading speed.',
      icon: '⏱️',
      url: '/tools/reading-time-calculator/',
      keywords: 'reading time, reading time calculator, text duration',
      priority: 0.80,
      status: 'not-started'
    },
    {
      id: 'json-to-yaml',
      name: 'JSON to YAML Converter',
      category: 'json-tools',
      categoryLabel: 'JSON Tools',
      description: 'Convert JSON to YAML format. Perfect for configuration files.',
      icon: '⚙️',
      url: '/tools/json-to-yaml/',
      keywords: 'json to yaml, yaml converter, json converter',
      priority: 0.80,
      status: 'not-started'
    },
    {
      id: 'sql-formatter',
      name: 'SQL Formatter',
      category: 'sql-tools',
      categoryLabel: 'SQL Tools',
      description: 'Format and beautify SQL queries. Proper indentation and highlighting.',
      icon: '🔍',
      url: '/tools/sql-formatter/',
      keywords: 'sql formatter, format sql, sql beautifier, sql query formatter',
      priority: 0.85,
      status: 'not-started'
    },
    {
      id: 'sql-query-builder',
      name: 'SQL Query Builder',
      category: 'sql-tools',
      categoryLabel: 'SQL Tools',
      description: 'Build SQL queries visually. Generate SELECT, INSERT, UPDATE queries.',
      icon: '🛠️',
      url: '/tools/sql-query-builder/',
      keywords: 'sql builder, query builder, sql generator',
      priority: 0.82,
      status: 'not-started'
    },
    {
      id: 'md5-sha-generator',
      name: 'MD5/SHA Hash Generator',
      category: 'hash-generators',
      categoryLabel: 'Hash Generators',
      description: 'Generate MD5, SHA1, SHA256 hashes. Perfect for checksums and verification.',
      icon: '#️⃣',
      url: '/tools/md5-sha-generator/',
      keywords: 'md5 generator, sha generator, hash generator, hash tool',
      priority: 0.87,
      status: 'not-started'
    },
    {
      id: 'jwt-decoder',
      name: 'JWT Decoder',
      category: 'testing-tools',
      categoryLabel: 'Testing Tools',
      description: 'Decode and analyze JWT tokens. Verify token structure and claims.',
      icon: '🔓',
      url: '/tools/jwt-decoder/',
      keywords: 'jwt decoder, jwt token, decode jwt, token analysis',
      priority: 0.85,
      status: 'not-started'
    },
    {
      id: 'color-picker',
      name: 'Color Picker',
      category: 'conversion-tools',
      categoryLabel: 'Conversion Tools',
      description: 'Pick colors and convert between HEX, RGB, HSL formats. Generate palettes.',
      icon: '🎨',
      url: '/tools/color-picker/',
      keywords: 'color picker, color converter, hex to rgb, color palette',
      priority: 0.86,
      status: 'not-started'
    },
    {
      id: 'url-encoder-decoder',
      name: 'URL Encoder/Decoder',
      category: 'encoding-tools',
      categoryLabel: 'Encoding Tools',
      description: 'Encode and decode URLs. Handle query parameters and special characters.',
      icon: '🔗',
      url: '/tools/url-encoder-decoder/',
      keywords: 'url encoder, url decoder, encode url, decode url',
      priority: 0.90,
      status: 'complete'
    },
    {
      id: 'excel-to-comma-list',
      name: 'Excel Column to Comma List',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert Excel column data to comma-separated values.',
      icon: '📊',
      url: '/tools/excel-column-to-comma-list/',
      keywords: 'excel to csv, csv converter, data converter',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'quote-comma-formatter',
      name: 'Quote & Comma Formatter',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Add quotes and delimiters to column values. Perfect for SQL queries.',
      icon: '"\'',
      url: '/tools/quote-comma-formatter/',
      keywords: 'quote formatter, comma formatter, data formatter, sql formatter',
      priority: 0.82,
      status: 'complete'
    },
    {
      id: 'countdown-timer',
      name: 'Countdown Timer',
      category: 'time-tools',
      categoryLabel: 'Time Tools',
      description: 'Set custom countdown timers. Perfect for productivity and breaks.',
      icon: '⏲️',
      url: '/tools/countdown-timer/',
      keywords: 'timer, countdown, time tracking, stopwatch',
      priority: 0.80,
      status: 'not-started'
    },
    {
      id: 'excel-to-sql-in',
      name: 'Excel Column to SQL IN List',
      category: 'sql-tools',
      categoryLabel: 'SQL Tools',
      description: 'Convert Excel data to SQL IN statement format.',
      icon: '⬚',
      url: '/tools/excel-column-to-sql-in/',
      keywords: 'sql in list, sql converter, data to sql',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'comma-to-newline',
      name: 'Comma to Newline',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert comma-separated values to newline-separated format.',
      icon: '⮎',
      url: '/tools/comma-to-newline/',
      keywords: 'comma to newline, data converter, text converter',
      priority: 0.80,
      status: 'complete'
    },
    {
      id: 'newline-to-comma',
      name: 'Newline to Comma',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert newline-separated values to comma-separated format.',
      icon: '⮏',
      url: '/tools/newline-to-comma/',
      keywords: 'newline to comma, data converter, list converter',
      priority: 0.80,
      status: 'complete'
    },
    {
      id: 'password-generator',
      name: 'Password Generator',
      category: 'password-tools',
      categoryLabel: 'Password Tools',
      description: 'Create strong, secure passwords with customizable options.',
      icon: '🔒',
      url: '/tools/password-generator/',
      keywords: 'password generator, generate password, secure password',
      priority: 0.88,
      status: 'complete'
    },
    {
      id: 'charades-random',
      name: 'Random Charades Generator',
      category: 'random-generators',
      categoryLabel: 'Random Generators',
      description: 'Generate random charades words for parties and games.',
      icon: '🎭',
      url: '/tools/charades-random/',
      keywords: 'charades, random charades, charades words, party games',
      priority: 0.80,
      status: 'complete'
    }
  ],

  categories: [
    {
      id: 'text-case-tools',
      name: 'Text Case Tools',
      description: 'Convert text between different case formats',
      icon: '📝'
    },
    {
      id: 'text-analysis',
      name: 'Text Analysis Tools',
      description: 'Analyze and get insights from your text',
      icon: '📊'
    },
    {
      id: 'text-formatting',
      name: 'Text Formatting Tools',
      description: 'Format and clean your text',
      icon: '✏️'
    },
    {
      id: 'encoding-tools',
      name: 'Encoding Tools',
      description: 'Encode, decode, and encrypt data',
      icon: '🔐'
    },
    {
      id: 'json-tools',
      name: 'JSON Tools',
      description: 'Work with JSON data',
      icon: '{}'
    },
    {
      id: 'data-converters',
      name: 'Data Format Converters',
      description: 'Convert between data formats',
      icon: '📈'
    },
    {
      id: 'sql-tools',
      name: 'SQL Tools',
      description: 'SQL formatting and query building',
      icon: '🔍'
    },
    {
      id: 'conversion-tools',
      name: 'Conversion Tools',
      description: 'Convert units, colors, and formats',
      icon: '🔄'
    },
    {
      id: 'password-tools',
      name: 'Password Tools',
      description: 'Password generation and security checking',
      icon: '🔑'
    },
    {
      id: 'random-generators',
      name: 'Random Generators',
      description: 'Generate random values and decisions',
      icon: '🎲'
    },
    {
      id: 'testing-tools',
      name: 'Testing Tools',
      description: 'Tools for developers and testers',
      icon: '🧪'
    },
    {
      id: 'hash-generators',
      name: 'Hash Generators',
      description: 'Generate hashes and checksums',
      icon: '#'
    },
    {
      id: 'time-tools',
      name: 'Time Tools',
      description: 'Time tracking and countdown tools',
      icon: '⏱️'
    }
  ]
};

// Export for use in build scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TOOLS_REGISTRY;
}
