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
    },
    {
      id: 'text-summarizer',
      name: 'Text Summarizer',
      category: 'text-analysis',
      categoryLabel: 'Text Analysis Tools',
      description: 'Reduce long text into concise summaries by extracting key sentences automatically.',
      icon: '📄',
      url: '/tools/text-summarizer/',
      keywords: 'text summarizer, summarize text, content summary, text reduction, key sentences',
      priority: 0.87,
      status: 'complete'
    },
    {
      id: 'line-sorter',
      name: 'Line Sorter',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Sort text lines alphabetically in ascending (A-Z) or descending (Z-A) order.',
      icon: '🔤',
      url: '/tools/line-sorter/',
      keywords: 'line sorter, sort text, alphabetical sort, text organizer, list sorter',
      priority: 0.80,
      status: 'complete'
    },
    {
      id: 'line-numbering',
      name: 'Line Numbering Tool',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Add line numbers to your text with customizable formatting and numbering styles.',
      icon: '1️⃣',
      url: '/tools/line-numbering/',
      keywords: 'line numbering, line numbers, text formatter, code formatter',
      priority: 0.78,
      status: 'not-started'
    },
    {
      id: 'percentage-calculator',
      name: 'Percentage Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate percentage change, increase, and decrease between two values.',
      icon: '%️',
      url: '/tools/percentage-calculator/',
      keywords: 'percentage calculator, percentage change, percentage increase, percentage decrease',
      priority: 0.90,
      status: 'not-started'
    },
    {
      id: 'average-calculator',
      name: 'Average & Weighted Average Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate simple average, weighted average, and median values from a dataset.',
      icon: '📊',
      url: '/tools/average-calculator/',
      keywords: 'average calculator, weighted average, mean, median, statistics',
      priority: 0.85,
      status: 'not-started'
    },
    {
      id: 'ratio-calculator',
      name: 'Ratio Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Simplify ratios to their lowest terms and scale proportions easily.',
      icon: '::',
      url: '/tools/ratio-calculator/',
      keywords: 'ratio calculator, simplify ratio, scale ratio, proportion calculator',
      priority: 0.83,
      status: 'not-started'
    },
    {
      id: 'unit-price-calculator',
      name: 'Unit Price Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate the price per unit to compare product values and find the best deals.',
      icon: '💵',
      url: '/tools/unit-price-calculator/',
      keywords: 'unit price calculator, price per unit, cost comparison, unit cost',
      priority: 0.86,
      status: 'not-started'
    },
    {
      id: 'discount-calculator',
      name: 'Discount Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate discounted prices with percentage or fixed amount discounts.',
      icon: '🏷️',
      url: '/tools/discount-calculator/',
      keywords: 'discount calculator, sale price, percent off, price reduction',
      priority: 0.87,
      status: 'not-started'
    },
    {
      id: 'rounding-calculator',
      name: 'Rounding & Decimal Formatter',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Round numbers to any decimal place with multiple rounding methods.',
      icon: '🔢',
      url: '/tools/rounding-calculator/',
      keywords: 'rounding calculator, decimal formatter, round numbers, number formatter',
      priority: 0.82,
      status: 'not-started'
    },
    {
      id: 'working-days-calculator',
      name: 'Working Days Calculator',
      category: 'time-tools',
      categoryLabel: 'Time Tools',
      description: 'Calculate business days between dates, excluding weekends and holidays.',
      icon: '📅',
      url: '/tools/working-days-calculator/',
      keywords: 'working days calculator, business days, days calculator, project deadline',
      priority: 0.84,
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
      id: 'excel-column-to-comma-list',
      name: 'Column to List Converter',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert column data (Excel, newline-separated, etc.) to comma-separated with customizable separators and formatting.',
      icon: '📊',
      url: '/tools/excel-column-to-comma-list/',
      keywords: 'excel to csv, csv converter, data converter, newline to comma, column converter, list converter',
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
      id: 'excel-column-to-sql-in',
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
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      category: 'testing-tools',
      categoryLabel: 'Testing Tools',
      description: 'Generate unique UUIDs v4 for databases and applications.',
      icon: '🆔',
      url: '/tools/uuid-generator/',
      keywords: 'uuid generator, generate uuid, unique identifier, uuid v4',
      priority: 0.85,
      status: 'not-started'
    },
    {
      id: 'text-to-binary',
      name: 'Text to Binary Converter',
      category: 'encoding-tools',
      categoryLabel: 'Encoding Tools',
      description: 'Convert text to binary representation and vice versa.',
      icon: '01',
      url: '/tools/text-to-binary/',
      keywords: 'text to binary, binary converter, text encoding',
      priority: 0.80,
      status: 'not-started'
    },
    {
      id: 'image-to-base64',
      name: 'Image to Base64',
      category: 'encoding-tools',
      categoryLabel: 'Encoding Tools',
      description: 'Convert images to Base64 for embedding in HTML/CSS.',
      icon: '🖼️',
      url: '/tools/image-to-base64/',
      keywords: 'image to base64, image encoding, base64 image',
      priority: 0.82,
      status: 'not-started'
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester',
      category: 'testing-tools',
      categoryLabel: 'Testing Tools',
      description: 'Test and validate regular expressions with real-time matching.',
      icon: '🔍',
      url: '/tools/regex-tester/',
      keywords: 'regex tester, regular expression, regex validator, pattern matching',
      priority: 0.83,
      status: 'not-started'
    },
    {
      id: 'xml-to-json',
      name: 'XML to JSON',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert XML data to JSON format for modern API usage.',
      icon: '♻️',
      url: '/tools/xml-to-json/',
      keywords: 'xml to json, xml converter, data conversion',
      priority: 0.82,
      status: 'not-started'
    },
    {
      id: 'json-to-xml',
      name: 'JSON to XML',
      category: 'data-converters',
      categoryLabel: 'Data Format Converters',
      description: 'Convert JSON data to XML format for API integration and data exchange.',
      icon: '🔄',
      url: '/tools/json-to-xml/',
      keywords: 'json to xml, json converter, xml format',
      priority: 0.82,
      status: 'not-started'
    },
    {
      id: 'string-case-converter',
      name: 'String Case Converter',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Convert strings between camelCase, snake_case, PascalCase, kebab-case, and more. Perfect for programming and APIs.',
      icon: '🔤',
      url: '/tools/string-case-converter/',
      keywords: 'case converter, camelCase, snake_case, PascalCase, kebab-case, string formatter',
      priority: 0.84,
      status: 'complete'
    },
    {
      id: 'budget-calculator',
      name: 'Budget Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Plan and manage your budget. Track income, expenses, and savings goals.',
      icon: '💰',
      url: '/tools/budget-calculator/',
      keywords: 'budget calculator, budget planner, expense tracker, income planner',
      priority: 0.87,
      status: 'complete'
    },
    {
      id: 'savings-goal-calculator',
      name: 'Savings Goal Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Calculate time to reach savings goals. See impact of regular deposits.',
      icon: '🎯',
      url: '/tools/savings-goal-calculator/',
      keywords: 'savings goal, savings calculator, financial planning',
      priority: 0.86,
      status: 'complete'
    },
    {
      id: 'loan-calculator',
      name: 'Loan Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Calculate loan payments and amortization schedules. Compare different terms.',
      icon: '🏦',
      url: '/tools/loan-calculator/',
      keywords: 'loan calculator, mortgage calculator, payment calculator',
      priority: 0.89,
      status: 'complete'
    },
    {
      id: 'debt-payoff-calculator',
      name: 'Debt Payoff Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Compare debt payoff strategies. Snowball vs avalanche methods.',
      icon: '📉',
      url: '/tools/debt-payoff-calculator/',
      keywords: 'debt payoff, debt calculator, snowball method, debt strategy',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'credit-card-interest-calculator',
      name: 'Credit Card Interest Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Calculate credit card interest and payment impact. See total payoff time.',
      icon: '💳',
      url: '/tools/credit-card-interest-calculator/',
      keywords: 'credit card interest, interest calculator, apr calculator',
      priority: 0.84,
      status: 'complete'
    },
    {
      id: 'investment-return-calculator',
      name: 'Investment Return Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Calculate compound interest and investment returns. Project future growth.',
      icon: '📈',
      url: '/tools/investment-return-calculator/',
      keywords: 'investment calculator, compound interest, return calculator, roi',
      priority: 0.88,
      status: 'complete'
    },
    {
      id: 'retirement-calculator',
      name: 'Retirement Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Plan for retirement. Calculate required savings and withdrawal strategies.',
      icon: '🏖️',
      url: '/tools/retirement-calculator/',
      keywords: 'retirement calculator, retirement planning, pension calculator',
      priority: 0.89,
      status: 'complete'
    },
    {
      id: 'dollar-cost-averaging-calculator',
      name: 'Dollar-Cost Averaging Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Analyze dollar-cost averaging investment strategy. See long-term benefits.',
      icon: '📊',
      url: '/tools/dollar-cost-averaging-calculator/',
      keywords: 'dollar cost averaging, dca, investment strategy, periodic investment',
      priority: 0.83,
      status: 'complete'
    },
    {
      id: 'daily-balance-interest-calculator',
      name: 'Daily Balance Interest Calculator',
      category: 'finance-tools',
      categoryLabel: 'Finance & Investment Tools',
      description: 'Calculate monthly interest earnings on your savings account with daily balance tracking. Understand how deposits throughout the month affect your interest.',
      icon: '💵',
      url: '/tools/daily-balance-interest-calculator/',
      keywords: 'daily balance, savings interest, monthly interest, savings calculator, financial planning, interest calculator',
      priority: 0.85,
      status: 'complete'
    }
  ],

  phase3: [
    // File Tools (4)
    {
      id: 'bulk-file-name-generator',
      name: 'Bulk File Name Generator',
      category: 'file-tools',
      categoryLabel: 'File Management Tools',
      description: 'Generate bulk file names with prefix, suffix, and automatic numbering.',
      icon: '📁',
      url: '/tools/bulk-file-name-generator/',
      keywords: 'file name generator, bulk rename, file naming, batch naming',
      priority: 0.80,
      status: 'complete'
    },
    {
      id: 'remove-special-characters-from-filenames',
      name: 'Remove Special Characters from Filenames',
      category: 'file-tools',
      categoryLabel: 'File Management Tools',
      description: 'Remove special characters and invalid symbols from file names while preserving extensions.',
      icon: '🧹',
      url: '/tools/remove-special-characters-from-filenames/',
      keywords: 'filename cleaner, remove special characters, file name sanitizer',
      priority: 0.78,
      status: 'complete'
    },
    {
      id: 'file-name-case-converter',
      name: 'File Name Case Converter',
      category: 'file-tools',
      categoryLabel: 'File Management Tools',
      description: 'Convert file names to different case formats: lowercase, UPPERCASE, Title Case, camelCase, snake_case.',
      icon: '🔄',
      url: '/tools/file-name-case-converter/',
      keywords: 'file name converter, case converter, filename formatter, batch case conversion',
      priority: 0.77,
      status: 'complete'
    },
    {
      id: 'date-based-file-name-generator',
      name: 'Date-Based File Name Generator',
      category: 'file-tools',
      categoryLabel: 'File Management Tools',
      description: 'Add date prefixes or suffixes to file names in multiple date formats.',
      icon: '📅',
      url: '/tools/date-based-file-name-generator/',
      keywords: 'file name generator, date prefix, date suffix, file naming',
      priority: 0.76,
      status: 'complete'
    },
    // Text/Content Tools (3 additional)
    {
      id: 'duplicate-word-remover',
      name: 'Duplicate Word Remover',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Remove consecutive duplicate words from text. Keep text clean with case sensitivity options.',
      icon: '🔄',
      url: '/tools/duplicate-word-remover/',
      keywords: 'duplicate remover, duplicate words, text cleaner, word deduplicator',
      priority: 0.74,
      status: 'complete'
    },
    {
      id: 'text-repeater',
      name: 'Text Repeater',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Repeat text multiple times with custom separators (newlines, tabs, commas).',
      icon: '🔁',
      url: '/tools/text-repeater/',
      keywords: 'text repeater, repeat text, duplicate text, text multiplier',
      priority: 0.71,
      status: 'complete'
    },
    {
      id: 'remove-empty-lines',
      name: 'Remove Empty Lines',
      category: 'text-formatting',
      categoryLabel: 'Text Formatting Tools',
      description: 'Remove blank and empty lines from text. Keep only content-filled lines.',
      icon: '🗑️',
      url: '/tools/remove-empty-lines/',
      keywords: 'remove empty lines, blank line remover, text cleaner, line filter',
      priority: 0.73,
      status: 'complete'
    },
    // Math/Calculator Tools (7)
    {
      id: 'percentage-calculator',
      name: 'Percentage Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate percentage changes, increases, and decreases. Find what percent X is of Y.',
      icon: '📊',
      url: '/tools/percentage-calculator/',
      keywords: 'percentage calculator, percent calculator, percentage change, percentage increase',
      priority: 0.88,
      status: 'complete'
    },
    {
      id: 'average-calculator',
      name: 'Average Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate average, weighted average, median, and mode. Analyze your data quickly.',
      icon: '📈',
      url: '/tools/average-calculator/',
      keywords: 'average calculator, mean calculator, average formula, weighted average',
      priority: 0.82,
      status: 'complete'
    },
    {
      id: 'ratio-calculator',
      name: 'Ratio Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Simplify ratios to lowest terms. Scale ratios up or down.',
      icon: '⚖️',
      url: '/tools/ratio-calculator/',
      keywords: 'ratio calculator, simplify ratio, ratio converter, proportion calculator',
      priority: 0.79,
      status: 'complete'
    },
    {
      id: 'unit-price-calculator',
      name: 'Unit Price Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate unit price and compare costs between different package sizes.',
      icon: '💰',
      url: '/tools/unit-price-calculator/',
      keywords: 'unit price, price calculator, cost comparison, value calculator',
      priority: 0.81,
      status: 'complete'
    },
    {
      id: 'discount-calculator',
      name: 'Discount Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate discounts, sale prices, and stacked discounts. See final savings.',
      icon: '💳',
      url: '/tools/discount-calculator/',
      keywords: 'discount calculator, discount percentage, sale price, price reduction',
      priority: 0.84,
      status: 'complete'
    },
    {
      id: 'rounding-calculator',
      name: 'Rounding Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Round numbers using different methods: round, ceil, floor, truncate. Format as currency or thousands separator.',
      icon: '🔢',
      url: '/tools/rounding-calculator/',
      keywords: 'rounding calculator, round number, ceil, floor, decimal rounding',
      priority: 0.75,
      status: 'complete'
    },
    {
      id: 'working-days-calculator',
      name: 'Working Days Calculator',
      category: 'math-tools',
      categoryLabel: 'Math & Calculator Tools',
      description: 'Calculate working days between dates. Exclude weekends and holidays.',
      icon: '📅',
      url: '/tools/working-days-calculator/',
      keywords: 'working days calculator, business days, date calculator, holiday calculator',
      priority: 0.80,
      status: 'complete'
    },
    // Office/HR Tools (5)
    {
      id: 'overtime-hours-calculator',
      name: 'Overtime Hours Calculator',
      category: 'hr-tools',
      categoryLabel: 'Office & HR Tools',
      description: 'Calculate overtime hours and earnings. Track regular and overtime separately.',
      icon: '⏰',
      url: '/tools/overtime-hours-calculator/',
      keywords: 'overtime calculator, work hours, payroll, overtime hours',
      priority: 0.82,
      status: 'complete'
    },
    {
      id: 'attendance-percentage-calculator',
      name: 'Attendance Percentage Calculator',
      category: 'hr-tools',
      categoryLabel: 'Office & HR Tools',
      description: 'Calculate attendance percentage based on present and total working days.',
      icon: '✅',
      url: '/tools/attendance-percentage-calculator/',
      keywords: 'attendance calculator, attendance percentage, presence calculator',
      priority: 0.78,
      status: 'complete'
    },
    {
      id: 'notice-period-calculator',
      name: 'Notice Period Calculator',
      category: 'hr-tools',
      categoryLabel: 'Office & HR Tools',
      description: 'Calculate notice period end dates with weekend exclusion option.',
      icon: '📝',
      url: '/tools/notice-period-calculator/',
      keywords: 'notice period calculator, resignation date, last working day',
      priority: 0.75,
      status: 'complete'
    },
    {
      id: 'probation-end-date-calculator',
      name: 'Probation End Date Calculator',
      category: 'hr-tools',
      categoryLabel: 'Office & HR Tools',
      description: 'Calculate probation period end dates and confirmation dates.',
      icon: '📋',
      url: '/tools/probation-end-date-calculator/',
      keywords: 'probation calculator, probation period, employment dates',
      priority: 0.73,
      status: 'complete'
    },
    {
      id: 'shift-allowance-calculator',
      name: 'Shift Allowance Calculator',
      category: 'hr-tools',
      categoryLabel: 'Office & HR Tools',
      description: 'Calculate shift allowance based on number of shifts and allowance rate.',
      icon: '💵',
      url: '/tools/shift-allowance-calculator/',
      keywords: 'shift allowance, shift pay, shift calculator, allowance calculator',
      priority: 0.72,
      status: 'complete'
    },
    // Time/Shift Tools (4)
    {
      id: 'time-difference-calculator',
      name: 'Time Difference Calculator',
      category: 'time-tools',
      categoryLabel: 'Time Tools',
      description: 'Calculate time difference between two times. Get results in hours and minutes.',
      icon: '⏱️',
      url: '/tools/time-difference-calculator/',
      keywords: 'time difference, time calculator, duration calculator, time duration',
      priority: 0.81,
      status: 'complete'
    },
    {
      id: 'shift-hours-calculator',
      name: 'Shift Hours Calculator',
      category: 'time-tools',
      categoryLabel: 'Time Tools',
      description: 'Calculate actual working hours by subtracting break time from shift duration.',
      icon: '🕒',
      url: '/tools/shift-hours-calculator/',
      keywords: 'shift hours calculator, work hours, shift duration, break calculator',
      priority: 0.79,
      status: 'complete'
    },
    {
      id: 'weekly-working-hours-calculator',
      name: 'Weekly Working Hours Calculator',
      category: 'time-tools',
      categoryLabel: 'Time Tools',
      description: 'Calculate total and average working hours for a full week.',
      icon: '📊',
      url: '/tools/weekly-working-hours-calculator/',
      keywords: 'weekly hours, work hours calculator, total hours, average hours',
      priority: 0.76,
      status: 'complete'
    },
    {
      id: 'multiple-time-adder',
      name: 'Multiple Time Adder',
      category: 'time-tools',
      categoryLabel: 'Time Tools',
      description: 'Add multiple time durations together. Supports various time formats.',
      icon: '➕',
      url: '/tools/multiple-time-adder/',
      keywords: 'time adder, add times, total time, time duration calculator',
      priority: 0.74,
      status: 'complete'
    },
    // Developer Tools (4)
    {
      id: 'html-css-js-minifier',
      name: 'HTML/CSS/JS Minifier',
      category: 'developer-tools',
      categoryLabel: 'Developer Tools',
      description: 'Minify HTML, CSS, and JavaScript code. Remove comments and whitespace to reduce file size.',
      icon: '🗜️',
      url: '/tools/html-css-js-minifier/',
      keywords: 'minifier, code minifier, minify html, minify css, minify javascript',
      priority: 0.90,
      status: 'complete'
    },
    {
      id: 'code-beautifier',
      name: 'Code Beautifier',
      category: 'developer-tools',
      categoryLabel: 'Developer Tools',
      description: 'Format and beautify HTML, CSS, and JavaScript code with proper indentation.',
      icon: '✨',
      url: '/tools/code-beautifier/',
      keywords: 'code beautifier, code formatter, prettify code, format code',
      priority: 0.88,
      status: 'complete'
    },
    {
      id: 'json-diff-tool',
      name: 'JSON Diff Tool',
      category: 'developer-tools',
      categoryLabel: 'Developer Tools',
      description: 'Compare two JSON objects and see all differences highlighted.',
      icon: '🔍',
      url: '/tools/json-diff-tool/',
      keywords: 'json diff, json compare, json difference, json comparison',
      priority: 0.86,
      status: 'complete'
    },
    {
      id: 'http-status-code-lookup',
      name: 'HTTP Status Code Lookup',
      category: 'developer-tools',
      categoryLabel: 'Developer Tools',
      description: 'Reference guide for HTTP status codes. Search and understand all status codes.',
      icon: '🔗',
      url: '/tools/http-status-code-lookup/',
      keywords: 'http status codes, status code reference, 404 error, 500 error',
      priority: 0.87,
      status: 'complete'
    },
    // Social Media Tools (4)
    {
      id: 'whatsapp-text-formatter',
      name: 'WhatsApp Text Formatter',
      category: 'social-media-tools',
      categoryLabel: 'Social Media Tools',
      description: 'Format text for WhatsApp with bold, italic, strikethrough, and monospace styles.',
      icon: '💬',
      url: '/tools/whatsapp-text-formatter/',
      keywords: 'whatsapp formatter, whatsapp bold, whatsapp italic, text formatting',
      priority: 0.85,
      status: 'complete'
    },
    {
      id: 'invisible-character-generator',
      name: 'Invisible Character Generator',
      category: 'social-media-tools',
      categoryLabel: 'Social Media Tools',
      description: 'Generate invisible Unicode characters like zero-width space for copying.',
      icon: '👻',
      url: '/tools/invisible-character-generator/',
      keywords: 'invisible characters, zero-width space, unicode characters, invisible text',
      priority: 0.79,
      status: 'complete'
    },
    {
      id: 'caption-line-break-formatter',
      name: 'Caption Line Break Formatter',
      category: 'social-media-tools',
      categoryLabel: 'Social Media Tools',
      description: 'Automatically add line breaks to captions for better readability on social media.',
      icon: '📱',
      url: '/tools/caption-line-break-formatter/',
      keywords: 'caption formatter, line breaks, social media captions, text formatter',
      priority: 0.81,
      status: 'complete'
    },
    {
      id: 'hashtag-formatter',
      name: 'Hashtag Formatter',
      category: 'social-media-tools',
      categoryLabel: 'Social Media Tools',
      description: 'Format and organize hashtags. Convert to single line, one per line, or grouped format.',
      icon: '#️⃣',
      url: '/tools/hashtag-formatter/',
      keywords: 'hashtag formatter, hashtag organizer, instagram hashtags, social media hashtags',
      priority: 0.83,
      status: 'complete'
    },
    // Engagement Tool (1)
    {
      id: 'random-icebreaker-generator',
      name: 'Random Icebreaker Generator',
      category: 'engagement-tools',
      categoryLabel: 'Engagement Tools',
      description: 'Generate random icebreaker questions for team building and social events.',
      icon: '🎯',
      url: '/tools/random-icebreaker-generator/',
      keywords: 'icebreaker questions, conversation starters, team building, random questions',
      priority: 0.75,
      status: 'complete'
    }
  ],

  // Main categories for navigation and homepage
  mainCategories: [
    {
      id: 'text-content',
      name: 'Text & Content Tools',
      description: 'Convert, analyze, format, and manipulate text. Case converters, summarizers, formatters, and more.',
      icon: '📝',
      url: '/tools/hub/text-content/'
    },
    {
      id: 'math-calculators',
      name: 'Math & Calculators',
      description: 'Calculate percentages, averages, ratios, discounts, and more. All your math needs in one place.',
      icon: '🧮',
      url: '/tools/hub/math-calculators/'
    },
    {
      id: 'data-tools',
      name: 'Data Tools',
      description: 'Convert, format, and transform data. JSON, XML, SQL, encoding, and more.',
      icon: '📊',
      url: '/tools/hub/data-tools/'
    },
    {
      id: 'developer-tools',
      name: 'Developer Tools',
      description: 'Code formatting, minification, testing, hash generation, and HTTP utilities.',
      icon: '💻',
      url: '/tools/hub/developer-tools/'
    },
    {
      id: 'finance-tools',
      name: 'Finance Tools',
      description: 'Budget planning, loan calculations, investment analysis, and financial planning.',
      icon: '💰',
      url: '/tools/hub/finance-tools/'
    },
    {
      id: 'office-time',
      name: 'Office & Time Tools',
      description: 'HR calculators, time tracking, scheduling, and office management tools.',
      icon: '⏱️',
      url: '/tools/hub/office-time/'
    },
    {
      id: 'utilities',
      name: 'Utilities & More',
      description: 'File management, social media formatters, password generators, and more.',
      icon: '⚙️',
      url: '/tools/hub/utilities/'
    }
  ],

  // Sub-categories for organizational structure (used by hub pages)
  categories: [
    // Text & Content Sub-categories
    {
      id: 'text-case-tools',
      name: 'Text Case Tools',
      parentId: 'text-content',
      description: 'Convert text between different case formats',
      icon: '📝'
    },
    {
      id: 'text-analysis',
      name: 'Text Analysis Tools',
      parentId: 'text-content',
      description: 'Analyze and get insights from your text',
      icon: '📊'
    },
    {
      id: 'text-formatting',
      name: 'Text Formatting Tools',
      parentId: 'text-content',
      description: 'Format and clean your text',
      icon: '✏️'
    },
    // Math & Calculators (no sub-categories needed)
    {
      id: 'math-tools',
      name: 'Math & Calculators',
      parentId: 'math-calculators',
      description: 'Calculate percentages, averages, ratios, and more',
      icon: '🧮'
    },
    // Data Tools Sub-categories
    {
      id: 'encoding-tools',
      name: 'Encoding Tools',
      parentId: 'data-tools',
      description: 'Encode, decode, and encrypt data',
      icon: '🔐'
    },
    {
      id: 'json-tools',
      name: 'JSON Tools',
      parentId: 'data-tools',
      description: 'Work with JSON data',
      icon: '{}'
    },
    {
      id: 'data-converters',
      name: 'Data Format Converters',
      parentId: 'data-tools',
      description: 'Convert between data formats',
      icon: '📈'
    },
    {
      id: 'sql-tools',
      name: 'SQL Tools',
      parentId: 'data-tools',
      description: 'SQL formatting and query building',
      icon: '🔍'
    },
    {
      id: 'conversion-tools',
      name: 'Conversion Tools',
      parentId: 'data-tools',
      description: 'Convert units, colors, and formats',
      icon: '🔄'
    },
    // Developer Tools Sub-categories
    {
      id: 'testing-tools',
      name: 'Testing Tools',
      parentId: 'developer-tools',
      description: 'Tools for developers and testers',
      icon: '🧪'
    },
    {
      id: 'hash-generators',
      name: 'Hash Generators',
      parentId: 'developer-tools',
      description: 'Generate hashes and checksums',
      icon: '#'
    },
    // Finance Tools (no sub-categories needed)
    {
      id: 'finance-tools',
      name: 'Finance & Investment Tools',
      parentId: 'finance-tools',
      description: 'Calculate and plan personal finances, investments, and debt payoff',
      icon: '💰'
    },
    // Office & Time Sub-categories
    {
      id: 'time-tools',
      name: 'Time Tools',
      parentId: 'office-time',
      description: 'Time tracking and calculation tools',
      icon: '⏱️'
    },
    {
      id: 'hr-tools',
      name: 'Office & HR Tools',
      parentId: 'office-time',
      description: 'Tools for HR management and office tasks',
      icon: '👔'
    },
    // Utilities Sub-categories
    {
      id: 'file-tools',
      name: 'File Management Tools',
      parentId: 'utilities',
      description: 'Tools for generating and managing file names',
      icon: '📁'
    },
    {
      id: 'password-tools',
      name: 'Password Tools',
      parentId: 'utilities',
      description: 'Password generation and security checking',
      icon: '🔑'
    },
    {
      id: 'random-generators',
      name: 'Random Generators',
      parentId: 'utilities',
      description: 'Generate random values and decisions',
      icon: '🎲'
    },
    {
      id: 'social-media-tools',
      name: 'Social Media Tools',
      parentId: 'utilities',
      description: 'Tools for formatting content for social media platforms',
      icon: '📱'
    },
    {
      id: 'engagement-tools',
      name: 'Engagement Tools',
      parentId: 'utilities',
      description: 'Tools for team engagement and activities',
      icon: '🎯'
    }
  ]
};

// Export for use in build scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TOOLS_REGISTRY;
}
