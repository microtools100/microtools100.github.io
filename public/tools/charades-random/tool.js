// Random Charades Generator
class CharadesGenerator {
    constructor() {
        this.charadesData = {
            movies: [
                "The Godfather", "Titanic", "Star Wars", "Jurassic Park", "The Matrix",
                "Forrest Gump", "The Lion King", "Pulp Fiction", "The Dark Knight", "Frozen",
                "Avengers: Endgame", "The Shawshank Redemption", "Inception", "Gladiator",
                "Back to the Future", "The Wizard of Oz", "Casablanca", "Gone with the Wind",
                "Psycho", "The Silence of the Lambs"
            ],
            books: [
                "Harry Potter", "The Lord of the Rings", "To Kill a Mockingbird", "1984",
                "Pride and Prejudice", "The Great Gatsby", "Moby Dick", "War and Peace",
                "The Catcher in the Rye", "The Hobbit", "Alice in Wonderland", "Dracula",
                "Frankenstein", "The Odyssey", "Romeo and Juliet", "Hamlet", "Macbeth",
                "The Bible", "The Quran", "The Art of War"
            ],
            songs: [
                "Bohemian Rhapsody", "Imagine", "Like a Rolling Stone", "Smells Like Teen Spirit",
                "Billie Jean", "Hey Jude", "Sweet Child O' Mine", "Hotel California",
                "Stairway to Heaven", "What's Going On", "Respect", "Good Vibrations",
                "Johnny B. Goode", "Purple Haze", "Yesterday", "Blowin' in the Wind",
                "Let It Be", "Bridge Over Troubled Water", "Hallelujah", "Wonderwall"
            ],
            celebrities: [
                "Albert Einstein", "Michael Jackson", "Marilyn Monroe", "Elvis Presley",
                "Oprah Winfrey", "Steve Jobs", "Barack Obama", "Queen Elizabeth II",
                "Charlie Chaplin", "Mickey Mouse", "Superman", "Spider-Man", "Harry Potter",
                "James Bond", "Sherlock Holmes", "Santa Claus", "The Pope", "Beyoncé",
                "Taylor Swift", "Cristiano Ronaldo"
            ],
            actions: [
                "Brushing teeth", "Driving a car", "Swimming", "Cooking pasta", "Playing guitar",
                "Taking a selfie", "Washing dishes", "Reading a book", "Writing a letter",
                "Playing basketball", "Dancing", "Sleeping", "Eating spaghetti", "Shaving",
                "Making a bed", "Walking a dog", "Fishing", "Gardening", "Shopping",
                "Cleaning windows"
            ],
            objects: [
                "Smartphone", "Toothbrush", "Refrigerator", "Bicycle", "Coffee mug",
                "Umbrella", "Sunglasses", "Piano", "Television", "Microwave",
                "Lawn mower", "Vacuum cleaner", "Washing machine", "Air conditioner",
                "Sofa", "Bookshelf", "Lamp", "Clock", "Mirror", "Key"
            ],
            places: [
                "Eiffel Tower", "Great Wall of China", "Statue of Liberty", "Pyramids of Giza",
                "Sydney Opera House", "Taj Mahal", "Grand Canyon", "Mount Everest",
                "Amazon Rainforest", "North Pole", "Hollywood", "Times Square",
                "Disneyland", "The Louvre", "Buckingham Palace", "White House",
                "Colosseum", "Stonehenge", "Niagara Falls", "Yellowstone National Park"
            ],
            animals: [
                "Elephant", "Giraffe", "Penguin", "Kangaroo", "Dolphin", "Butterfly",
                "Octopus", "Chameleon", "Peacock", "Panda", "Tiger", "Lion", "Eagle",
                "Shark", "Whale", "Gorilla", "Zebra", "Crocodile", "Hippopotamus", "Owl"
            ]
        };

        this.phrases = {
            easy: [
                "Cat on a mat", "Dog chasing tail", "Man reading newspaper",
                "Woman drinking coffee", "Child playing ball", "Bird in nest",
                "Fish in bowl", "Sun rising", "Rain falling", "Snow melting"
            ],
            medium: [
                "Making a cup of tea", "Walking in the park", "Riding a bicycle",
                "Watching a movie", "Listening to music", "Painting a picture",
                "Building a sandcastle", "Flying a kite", "Blowing bubbles",
                "Jumping rope"
            ],
            hard: [
                "Searching for lost keys", "Trying to catch a butterfly",
                "Getting ready for a party", "Learning to play piano",
                "Attempting to fix a leaky faucet", "Telling a scary story",
                "Pretending to be a superhero", "Exploring a haunted house",
                "Preparing for a job interview", "Planning a surprise party"
            ]
        };

        this.elements = {
            category: document.getElementById('category'),
            difficulty: document.getElementById('difficulty'),
            count: document.getElementById('count'),
            countValue: document.getElementById('countValue'),
            timer: document.getElementById('timer'),
            includePhrases: document.getElementById('includePhrases'),
            allowProperNouns: document.getElementById('allowProperNouns'),
            showHint: document.getElementById('showHint'),
            avoidDuplicates: document.getElementById('avoidDuplicates'),
            generateBtn: document.getElementById('generateBtn'),
            clearBtn: document.getElementById('clearBtn'),
            startGameBtn: document.getElementById('startGameBtn'),
            copyBtn: document.getElementById('copyBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            printBtn: document.getElementById('printBtn'),
            toggleAdvanced: document.getElementById('toggleAdvanced'),
            advancedOptions: document.getElementById('advancedOptions'),
            charadesOutput: document.getElementById('charadesOutput'),
            timerDisplay: document.getElementById('timerDisplay'),
            currentIndex: document.getElementById('currentIndex'),
            nextCardBtn: document.getElementById('nextCardBtn'),
            prevCardBtn: document.getElementById('prevCardBtn'),
            team1Score: document.getElementById('team1Score'),
            team2Score: document.getElementById('team2Score'),
            team1Add: document.getElementById('team1Add'),
            team1Remove: document.getElementById('team1Remove'),
            team2Add: document.getElementById('team2Add'),
            team2Remove: document.getElementById('team2Remove'),
            resetScoresBtn: document.getElementById('resetScoresBtn'),
            toggleHintsBtn: document.getElementById('toggleHintsBtn')
        };

        this.gameState = {
            isPlaying: false,
            currentTimer: null,
            timeLeft: 0,
            currentCharadeIndex: 0,
            usedCharades: new Set(),
            generatedCharades: [],
            team1Score: 0,
            team2Score: 0,
            showHints: true
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupQuickCategories();
        this.updateCountValue();
    }

    setupEventListeners() {
        // Generate button
        this.elements.generateBtn.addEventListener('click', () => this.generateCharades());
        
        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        
        // Start game button
        this.elements.startGameBtn.addEventListener('click', () => this.toggleGame());
        
        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.download());
        
        // Print button
        this.elements.printBtn.addEventListener('click', () => this.printCharades());
        
        // Advanced options toggle
        this.elements.toggleAdvanced.addEventListener('click', () => {
            this.elements.advancedOptions.classList.toggle('hidden');
        });
        
        // Count slider
        this.elements.count.addEventListener('input', () => this.updateCountValue());
        
        // Difficulty change
        this.elements.difficulty.addEventListener('change', () => {
            if (this.elements.difficulty.value === 'custom') {
                this.showCustomLengthInput();
            }
        });
        
        // Card navigation
        this.elements.nextCardBtn.addEventListener('click', () => this.nextCard());
        this.elements.prevCardBtn.addEventListener('click', () => this.previousCard());
        
        // Team score buttons
        this.elements.team1Add.addEventListener('click', () => this.updateTeamScore(1, 1));
        this.elements.team1Remove.addEventListener('click', () => this.updateTeamScore(1, -1));
        this.elements.team2Add.addEventListener('click', () => this.updateTeamScore(2, 1));
        this.elements.team2Remove.addEventListener('click', () => this.updateTeamScore(2, -1));
        this.elements.resetScoresBtn.addEventListener('click', () => this.resetScores());
        
        // Toggle hints button
        this.elements.toggleHintsBtn.addEventListener('click', () => this.toggleHints());
    }

    setupQuickCategories() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.elements.category.value = category;
                this.generateCharades();
            });
        });
    }

    updateCountValue() {
        this.elements.countValue.textContent = this.elements.count.value;
    }

    showCustomLengthInput() {
        const customLength = prompt('Enter custom word length (e.g., "2-4" for 2 to 4 words):', '2-4');
        if (customLength && /^\d+-\d+$/.test(customLength)) {
            // Store custom length for use in generation
            this.customLength = customLength;
        } else if (customLength !== null) {
            alert('Please enter a valid range in format "min-max" (e.g., "2-4")');
            this.elements.difficulty.value = 'medium';
        }
    }

    generateCharades() {
        const count = parseInt(this.elements.count.value);
        const category = this.elements.category.value;
        const difficulty = this.elements.difficulty.value;
        const includePhrases = this.elements.includePhrases.checked;
        const avoidDuplicates = this.elements.avoidDuplicates.checked;
        
        let charades = [];
        let attempts = 0;
        const maxAttempts = count * 3;
        
        while (charades.length < count && attempts < maxAttempts) {
            const charade = this.generateSingleCharade(category, difficulty, includePhrases);
            
            if (!avoidDuplicates || !charades.some(c => c.text === charade.text)) {
                charades.push(charade);
            }
            
            attempts++;
        }
        
        // If we couldn't generate enough unique charades, fill with what we have
        if (charades.length < count) {
            const additionalNeeded = count - charades.length;
            for (let i = 0; i < additionalNeeded; i++) {
                const charade = this.generateSingleCharade(category, difficulty, includePhrases);
                charades.push(charade);
            }
        }
        
        this.gameState.generatedCharades = charades;
        this.gameState.currentCharadeIndex = 0;
        this.gameState.usedCharades.clear();
        
        this.displayCharades(charades);
        this.updateStats();
        
        SharedUtilities.showNotification(`Generated ${charades.length} charades`, 'success');
    }

    generateSingleCharade(category, difficulty, includePhrases) {
        let charade = {};
        
        // Determine if we should generate a phrase
        const shouldGeneratePhrase = includePhrases && Math.random() > 0.5;
        
        if (shouldGeneratePhrase) {
            // Generate a phrase based on difficulty
            const phraseDifficulty = difficulty === 'custom' ? 'medium' : difficulty;
            const phrases = this.phrases[phraseDifficulty];
            charade.text = phrases[Math.floor(Math.random() * phrases.length)];
            charade.category = 'phrase';
            charade.type = 'phrase';
        } else {
            // Generate a single word/name from selected category
            let selectedCategory = category;
            if (category === 'mixed') {
                const categories = Object.keys(this.charadesData);
                selectedCategory = categories[Math.floor(Math.random() * categories.length)];
            }
            
            const items = this.charadesData[selectedCategory];
            charade.text = items[Math.floor(Math.random() * items.length)];
            charade.category = selectedCategory;
            charade.type = 'single';
        }
        
        // Add hint based on category
        charade.hint = this.getHint(charade.category, charade.type);
        
        return charade;
    }

    getHint(category, type) {
        if (!this.elements.showHint.checked) return '';
        
        const hints = {
            movies: "Think about famous scenes or characters",
            books: "Consider the plot or main character",
            songs: "What's the chorus or famous lyrics?",
            celebrities: "Think about their profession or fame",
            actions: "Show the movement step by step",
            objects: "Describe its use or appearance",
            places: "Think about location or landmarks",
            animals: "Consider movements or sounds",
            phrase: "Act out each word separately"
        };
        
        return hints[category] || "Use gestures to convey the idea";
    }

    displayCharades(charades) {
        this.elements.charadesOutput.innerHTML = '';
        
        if (charades.length === 0) {
            this.elements.charadesOutput.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎭</div>
                    <h4>No charades generated yet</h4>
                    <p>Click "Generate Charades" to create your first set of charades words!</p>
                </div>
            `;
            this.elements.nextCardBtn.disabled = true;
            this.elements.prevCardBtn.disabled = true;
            return;
        }
        
        // Display the current card only
        this.displayCurrentCard();
        this.updateCardNavigation();
    }

    displayCurrentCard() {
        const charades = this.gameState.generatedCharades;
        
        if (charades.length === 0 || this.gameState.currentCharadeIndex >= charades.length) {
            this.elements.charadesOutput.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎭</div>
                    <h4>No more charades</h4>
                    <p>All charades have been viewed!</p>
                </div>
            `;
            return;
        }
        
        const charade = charades[this.gameState.currentCharadeIndex];
        const card = document.createElement('div');
        card.className = 'charade-card single-card';
        
        card.innerHTML = `
            <div class="charade-word">${this.escapeHtml(charade.text)}</div>
            <div class="charade-category">${charade.category}</div>
            ${this.gameState.showHints && charade.hint ? `<div class="charade-hint">${this.escapeHtml(charade.hint)}</div>` : ''}
        `;
        
        this.elements.charadesOutput.innerHTML = '';
        this.elements.charadesOutput.appendChild(card);
        this.updateStats();
    }

    updateCardNavigation() {
        const charades = this.gameState.generatedCharades;
        const currentIndex = this.gameState.currentCharadeIndex;
        
        // Previous button
        this.elements.prevCardBtn.disabled = currentIndex === 0;
        
        // Next button
        this.elements.nextCardBtn.disabled = currentIndex >= charades.length - 1;
    }

    nextCard() {
        const charades = this.gameState.generatedCharades;
        if (this.gameState.currentCharadeIndex < charades.length - 1) {
            this.gameState.currentCharadeIndex++;
            this.displayCurrentCard();
            this.updateCardNavigation();
        }
    }

    previousCard() {
        if (this.gameState.currentCharadeIndex > 0) {
            this.gameState.currentCharadeIndex--;
            this.displayCurrentCard();
            this.updateCardNavigation();
        }
    }

    toggleGame() {
        if (this.gameState.isPlaying) {
            this.stopGame();
        } else {
            this.startGame();
        }
    }

    startGame() {
        if (this.gameState.generatedCharades.length === 0) {
            SharedUtilities.showNotification('Please generate charades first', 'warning');
            return;
        }
        
        const timerSeconds = parseInt(this.elements.timer.value);
        if (timerSeconds === 0) {
            SharedUtilities.showNotification('Please set a timer to start the game', 'warning');
            return;
        }
        
        this.gameState.isPlaying = true;
        this.gameState.timeLeft = timerSeconds;
        this.gameState.currentCharadeIndex = 0;
        this.gameState.usedCharades.clear();
        
        // Update UI
        this.elements.startGameBtn.innerHTML = '<span>Stop Game</span><span>⏹️</span>';
        this.updateTimerDisplay();
        
        // Highlight first charade
        this.highlightCurrentCharade();
        
        // Start timer
        this.gameState.currentTimer = setInterval(() => {
            this.gameState.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.gameState.timeLeft <= 0) {
                this.endRound();
            }
        }, 1000);
        
        SharedUtilities.showNotification('Game started! Get ready to act!', 'success');
    }

    stopGame() {
        this.gameState.isPlaying = false;
        clearInterval(this.gameState.currentTimer);
        
        // Update UI
        this.elements.startGameBtn.innerHTML = '<span>Start Game Timer</span><span>⏱️</span>';
        this.elements.timerDisplay.textContent = '--:--';
        
        // Remove highlights
        document.querySelectorAll('.charade-card.active').forEach(card => {
            card.classList.remove('active');
        });
        
        SharedUtilities.showNotification('Game stopped', 'info');
    }

    endRound() {
        clearInterval(this.gameState.currentTimer);
        
        // Mark current charade as used
        const currentIndex = this.gameState.currentCharadeIndex;
        this.gameState.usedCharades.add(currentIndex);
        
        const card = this.elements.charadesOutput.querySelector(`[data-index="${currentIndex}"]`);
        if (card) {
            card.classList.add('used');
            card.classList.remove('active');
        }
        
        // Move to next charade
        this.gameState.currentCharadeIndex++;
        
        if (this.gameState.currentCharadeIndex >= this.gameState.generatedCharades.length) {
            // End of game
            this.stopGame();
            SharedUtilities.showNotification('Game finished! All charades completed.', 'success');
        } else {
            // Start next round
            this.gameState.timeLeft = parseInt(this.elements.timer.value);
            this.highlightCurrentCharade();
            this.updateTimerDisplay();
            
            // Restart timer
            this.gameState.currentTimer = setInterval(() => {
                this.gameState.timeLeft--;
                this.updateTimerDisplay();
                
                if (this.gameState.timeLeft <= 0) {
                    this.endRound();
                }
            }, 1000);
            
            SharedUtilities.showNotification('Next charade!', 'info');
        }
    }

    highlightCurrentCharade() {
        // Remove previous highlight
        document.querySelectorAll('.charade-card.active').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add new highlight
        const card = this.elements.charadesOutput.querySelector(
            `[data-index="${this.gameState.currentCharadeIndex}"]`
        );
        
        if (card) {
            card.classList.add('active');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.gameState.timeLeft / 60);
        const seconds = this.gameState.timeLeft % 60;
        this.elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning classes
        this.elements.timerDisplay.className = 'timer-display';
        if (this.gameState.timeLeft <= 10) {
            this.elements.timerDisplay.classList.add('danger');
        } else if (this.gameState.timeLeft <= 30) {
            this.elements.timerDisplay.classList.add('warning');
        }
    }

    updateStats() {
        this.elements.currentIndex.textContent = 
            `${this.gameState.currentCharadeIndex + 1}/${this.gameState.generatedCharades.length}`;
    }

    updateTeamScore(team, change) {
        if (team === 1) {
            this.gameState.team1Score = Math.max(0, this.gameState.team1Score + change);
            this.elements.team1Score.textContent = this.gameState.team1Score;
        } else if (team === 2) {
            this.gameState.team2Score = Math.max(0, this.gameState.team2Score + change);
            this.elements.team2Score.textContent = this.gameState.team2Score;
        }
    }

    resetScores() {
        this.gameState.team1Score = 0;
        this.gameState.team2Score = 0;
        this.elements.team1Score.textContent = '0';
        this.elements.team2Score.textContent = '0';
        SharedUtilities.showNotification('Scores reset', 'info');
    }

    toggleHints() {
        this.gameState.showHints = !this.gameState.showHints;
        
        // Update button text
        if (this.gameState.showHints) {
            this.elements.toggleHintsBtn.innerHTML = '<span>Hide Hints</span><span>💡</span>';
        } else {
            this.elements.toggleHintsBtn.innerHTML = '<span>Show Hints</span><span>💡</span>';
        }
        
        // Refresh current card display
        this.displayCurrentCard();
        
        const message = this.gameState.showHints ? 'Hints enabled' : 'Hints disabled';
        SharedUtilities.showNotification(message, 'info');
    }

    clear() {
        this.gameState.generatedCharades = [];
        this.gameState.usedCharades.clear();
        this.gameState.currentCharadeIndex = 0;
        
        this.displayCharades([]);
        this.updateStats();
        
        if (this.gameState.isPlaying) {
            this.stopGame();
        }
        
        SharedUtilities.showNotification('All charades cleared', 'info');
    }

    async copyToClipboard() {
        if (this.gameState.generatedCharades.length === 0) {
            SharedUtilities.showNotification('No charades to copy', 'warning');
            return;
        }
        
        const text = this.gameState.generatedCharades
            .map((charade, index) => `${index + 1}. ${charade.text} (${charade.category})`)
            .join('\n');
        
        if (window.MicroTools?.utils?.copyToClipboard) {
            await window.MicroTools.utils.copyToClipboard(text, this.elements.copyBtn);
        } else {
            // Fallback copy method
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            SharedUtilities.showNotification('Copied to clipboard!', 'success');
        }
    }

    download() {
        if (this.gameState.generatedCharades.length === 0) {
            SharedUtilities.showNotification('No charades to download', 'warning');
            return;
        }
        
        const text = this.gameState.generatedCharades
            .map((charade, index) => `${index + 1}. ${charade.text} (${charade.category})`)
            .join('\n');
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'charades-list.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        SharedUtilities.showNotification('Charades list downloaded', 'success');
    }

    printCharades() {
        if (this.gameState.generatedCharades.length === 0) {
            SharedUtilities.showNotification('No charades to print', 'warning');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Charades Cards</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .charade-card { 
                        border: 2px solid #333; 
                        padding: 20px; 
                        margin: 10px; 
                        page-break-inside: avoid;
                        border-radius: 10px;
                        text-align: center;
                    }
                    .charade-word { 
                        font-size: 24px; 
                        font-weight: bold; 
                        margin-bottom: 10px;
                    }
                    .charade-category { 
                        color: #666; 
                        font-style: italic;
                    }
                    @media print {
                        .charade-card { 
                            width: 45%; 
                            display: inline-block; 
                            vertical-align: top;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>Charades Cards</h1>
                <div>
                    ${this.gameState.generatedCharades.map(charade => `
                        <div class="charade-card">
                            <div class="charade-word">${this.escapeHtml(charade.text)}</div>
                            <div class="charade-category">${charade.category}</div>
                        </div>
                    `).join('')}
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.charadesGenerator = new CharadesGenerator();
});