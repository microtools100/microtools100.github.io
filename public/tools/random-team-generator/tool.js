// Random Team Generator Tool - Standardized Implementation

class RandomTeamGenerator {
    constructor() {
        // Element references
        this.inputText = document.getElementById('inputText');
        this.teamSizeInput = document.getElementById('teamSizeInput');
        this.teamCountInput = document.getElementById('teamCountInput');
        this.allocationModeRadios = document.querySelectorAll('input[name="allocationMode"]');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.outputContainer = document.querySelector('.teams-output');
        
        // Initialize listeners
        this.init();
    }

    init() {
        // Main button listeners
        if (this.shuffleBtn) {
            this.shuffleBtn.addEventListener('click', () => this.generateTeams());
        }

        // Mode change listeners
        this.allocationModeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (this.inputText.value.trim()) {
                    this.generateTeams();
                }
            });
        });

        // Real-time input listeners
        this.inputText.addEventListener('input', () => this.generateTeams());
        this.teamSizeInput.addEventListener('change', () => this.generateTeams());
        this.teamCountInput.addEventListener('change', () => this.generateTeams());

        // Keyboard shortcuts: Ctrl+Enter to generate, Ctrl+K to clear
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.generateTeams();
                } else if (e.key === 'k' || e.key === 'K') {
                    e.preventDefault();
                    this.clearAll();
                }
            }
        });
    }

    generateTeams() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.outputContainer.innerHTML = '<p style="text-align: center; color: var(--text-color-secondary);">Enter names/items to generate teams</p>';
            return;
        }

        const items = text.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        if (items.length < 2) {
            this.outputContainer.innerHTML = '<p style="text-align: center; color: var(--text-color-secondary);">Need at least 2 items to create teams</p>';
            return;
        }

        const mode = document.querySelector('input[name="allocationMode"]:checked').value;
        let teams;

        if (mode === 'by-size') {
            const teamSize = parseInt(this.teamSizeInput.value) || 2;
            teams = this.divideByTeamSize(items, teamSize);
        } else {
            const teamCount = parseInt(this.teamCountInput.value) || 2;
            teams = this.divideByTeamCount(items, teamCount);
        }

        this.displayTeams(teams);
        
        // Show success notification via SharedUtilities if available
        if (window.SharedUtilities?.showNotification) {
            window.SharedUtilities.showNotification(`Generated ${teams.length} team(s)!`, 'success');
        }
    }

    divideByTeamSize(items, teamSize) {
        const shuffled = this.shuffleArray([...items]);
        const teams = [];

        for (let i = 0; i < shuffled.length; i += teamSize) {
            teams.push(shuffled.slice(i, i + teamSize));
        }

        return teams;
    }

    divideByTeamCount(items, teamCount) {
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
                    <button class="copy-team-btn" data-team-index="${index}" title="Copy team members">📋 Copy</button>
                </div>
            `;
        }).join('');

        this.outputContainer.innerHTML = html;

        // Add copy listeners to team cards
        this.outputContainer.querySelectorAll('.copy-team-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.teamIndex);
                this.copyTeamToClipboard(teams[index]);
            });
        });
    }

    copyTeamToClipboard(team) {
        const text = team.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Team copied to clipboard!', 'success');
            }
        }).catch(() => {
            if (window.SharedUtilities?.showNotification) {
                window.SharedUtilities.showNotification('Failed to copy', 'error');
            }
        });
    }

    clearAll() {
        this.inputText.value = '';
        this.outputContainer.innerHTML = '';
        this.inputText.focus();
        
        if (window.SharedUtilities?.showNotification) {
            window.SharedUtilities.showNotification('Cleared all inputs', 'info');
        }
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
