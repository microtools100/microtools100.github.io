// Random Team Generator Tool

class RandomTeamGenerator {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.teamSizeInput = document.getElementById('teamSizeInput');
        this.teamCountInput = document.getElementById('teamCountInput');
        this.teamAllocationMode = document.getElementById('teamAllocationMode');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.outputContainer = document.querySelector('.teams-output');
        
        this.init();
    }

    init() {
        this.shuffleBtn.addEventListener('click', () => this.generateTeams());
        this.teamAllocationMode.addEventListener('change', () => {
            if (this.inputText.value) this.generateTeams();
        });
    }

    generateTeams() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.outputContainer.innerHTML = '<p style="text-align: center; color: #999;">Enter names/items to generate teams</p>';
            return;
        }

        const items = text.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        if (items.length < 2) {
            this.outputContainer.innerHTML = '<p style="text-align: center; color: #999;">Need at least 2 items to create teams</p>';
            return;
        }

        const mode = this.teamAllocationMode.value;
        let teams;

        if (mode === 'by-size') {
            const teamSize = parseInt(this.teamSizeInput.value) || 2;
            teams = this.divideByTeamSize(items, teamSize);
        } else {
            const teamCount = parseInt(this.teamCountInput.value) || 2;
            teams = this.divideByTeamCount(items, teamCount);
        }

        this.displayTeams(teams);
    }

    divideByTeamSize(items, teamSize) {
        // Shuffle items
        const shuffled = this.shuffleArray([...items]);
        const teams = [];

        for (let i = 0; i < shuffled.length; i += teamSize) {
            teams.push(shuffled.slice(i, i + teamSize));
        }

        return teams;
    }

    divideByTeamCount(items, teamCount) {
        // Shuffle items
        const shuffled = this.shuffleArray([...items]);
        const teams = Array.from({ length: teamCount }, () => []);

        // Distribute items round-robin
        shuffled.forEach((item, index) => {
            teams[index % teamCount].push(item);
        });

        return teams.filter(team => team.length > 0);
    }

    shuffleArray(array) {
        // Fisher-Yates shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    displayTeams(teams) {
        const html = teams.map((team, index) => {
            const teamMembersHtml = team.map(member => 
                `<li class="team-member">${this.escapeHtml(member)}</li>`
            ).join('');

            return `
                <div class="team-card">
                    <h3>Team ${index + 1} (${team.length} member${team.length !== 1 ? 's' : ''})</h3>
                    <ul class="team-members">
                        ${teamMembersHtml}
                    </ul>
                </div>
            `;
        }).join('');

        this.outputContainer.innerHTML = html;
    }

    escapeHtml(text) {
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.randomTeamGenerator = new RandomTeamGenerator();
});
