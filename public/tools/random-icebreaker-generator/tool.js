class IcebreakerGenerator {
    constructor() {
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.display = document.getElementById('icebreaker-display');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.historyList = document.getElementById('historyList');
        this.historyDiv = document.getElementById('history');
        this.currentIcebreaker = '';
        this.history = [];

        this.icebreakers = {
            fun: [
                "If you could have dinner with anyone, who would it be?",
                "What's the most embarrassing thing you've ever done?",
                "Would you rather fight one horse-sized duck or 100 duck-sized horses?",
                "What's your guilty pleasure TV show?",
                "If you could be any animal, which would you be?",
                "What's the weirdest food combination you like?",
                "Have you ever had a paranormal experience?",
                "What's the funniest thing that's happened to you recently?",
                "If you could travel anywhere tomorrow, where would you go?",
                "What's your hidden talent?",
                "Would you rather have the ability to fly or be invisible?",
                "What's the best advice you've ever received?",
                "If you won the lottery, what would you do first?",
                "What's your favorite movie and why?",
                "Have you ever met anyone famous?",
                "What's the most interesting job you've ever had?",
                "If you could master any skill instantly, what would it be?",
                "What's your most unpopular opinion?",
                "Would you rather time travel to the past or future?",
                "What's something you're surprisingly good at?"
            ],
            professional: [
                "What attracted you to this industry?",
                "What's your biggest professional achievement?",
                "How do you stay updated with industry trends?",
                "What's a challenge you've overcome in your career?",
                "What does success mean to you professionally?",
                "How do you handle work-life balance?",
                "What's the best feedback you've received at work?",
                "What's your management style?",
                "How do you approach learning new skills?",
                "What's a project you're proud of?",
                "How do you deal with difficult colleagues?",
                "What are your career goals for the next 5 years?",
                "What's the best decision you've made in your career?",
                "How do you handle deadline pressure?",
                "What motivates you at work?",
                "Describe your ideal work environment.",
                "What's the most valuable lesson you've learned professionally?",
                "How do you stay organized and productive?",
                "What's your approach to teamwork?",
                "What's the most important quality in a colleague?"
            ],
            creative: [
                "If you could create any invention, what would it be?",
                "What creative project are you currently working on?",
                "If you could redesign your city, what would you change?",
                "What's the most creative thing you've ever made?",
                "If you could write a book, what would it be about?",
                "What's your creative process?",
                "If you were a color, which would you be?",
                "What dream have you not pursued yet?",
                "If you could collaborate with anyone, who would it be?",
                "What inspires your creativity?",
                "If you could live in any fictional world, where would it be?",
                "What's the most unique perspective you have?",
                "If you could start a business, what would it be?",
                "What's a skill you'd love to learn?",
                "If you could solve one problem in the world, what would it be?",
                "What's your creative superpower?",
                "If you could design your perfect day, what would it look like?",
                "What piece of art resonates most with you?",
                "If you could have any job in the world, what would it be?",
                "What's something everyone should try at least once?"
            ],
            random: [
                "What's your earliest memory?",
                "What do you want to be remembered for?",
                "What's the kindest thing someone has done for you?",
                "What's a tradition you love?",
                "What brings you joy?",
                "What's the best compliment you've received?",
                "If you could change one thing about yourself, what would it be?",
                "What's your biggest fear?",
                "What makes you laugh?",
                "What's something you're grateful for today?",
                "What's the best advice you'd give to your younger self?",
                "What's your favorite quote?",
                "What's a habit you'd like to break?",
                "What energizes you?",
                "What's something you worry about?",
                "What's your definition of happiness?",
                "What's the most important thing in your life?",
                "What's something you're passionate about?",
                "What's a goal you're working towards?",
                "What makes you feel alive?"
            ]
        };

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.categoryFilter.addEventListener('change', () => this.generate());
    }

    generate() {
        const category = this.categoryFilter.value || 'random';
        const questions = this.icebreakers[category] || 
                         Object.values(this.icebreakers).flat();

        this.currentIcebreaker = questions[Math.floor(Math.random() * questions.length)];
        
        this.display.innerHTML = `<div style="font-size: 1.5em; font-weight: 500; color: var(--primary-color);">${this.currentIcebreaker}</div>`;
        
        this.history.unshift(this.currentIcebreaker);
        if (this.history.length > 10) this.history.pop();
        
        this.updateHistory();
    }

    updateHistory() {
        if (this.history.length === 0) {
            this.historyDiv.style.display = 'none';
            return;
        }
        
        this.historyDiv.style.display = 'block';
        this.historyList.innerHTML = this.history.map((q, i) => 
            `<div style="padding: 6px 0; border-bottom: 1px solid var(--border-color); font-size: 0.9em;">${i + 1}. ${q}</div>`
        ).join('');
    }

    copy() {
        if (!this.currentIcebreaker) {
            showNotification('Generate an icebreaker first', 'error');
            return;
        }
        navigator.clipboard.writeText(this.currentIcebreaker).then(() => {
            showNotification('Copied!', 'success');
        });
    }

    clear() {
        this.currentIcebreaker = '';
        this.display.innerHTML = '<p style="color: var(--text-secondary); font-size: 1.1em; margin: 0;">Click the button to generate your first icebreaker</p>';
        this.history = [];
        this.historyDiv.style.display = 'none';
        this.historyList.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new IcebreakerGenerator();
});