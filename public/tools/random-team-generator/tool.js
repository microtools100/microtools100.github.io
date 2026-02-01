class RandomTeamGenerator {
    constructor() {
        // DOM Elements
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.allocationModeSelect = document.getElementById('allocationMode');
        this.teamCountInput = document.getElementById('teamCountInput');
        this.teamSizeInput = document.getElementById('teamSizeInput');
        this.inputText = document.getElementById('inputText');
        this.teamsOutput = document.querySelector('.teams-output');
        this.errorMsg = document.querySelector('.error-msg');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.printBtn = document.getElementById('printBtn');

        // State
        this.teams = [];
        this.currentTeamsText = '';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFooterYear();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.allocationModeSelect.addEventListener('change', () => {
            this.toggleSettingsVisibility();
            if (this.inputText.value.trim()) {
                this.generate();
            }
        });
        this.teamCountInput.addEventListener('change', () => {
            if (this.inputText.value.trim() && this.allocationModeSelect.value === 'by-count') {
                this.generate();
            }
        });
        this.teamSizeInput.addEventListener('change', () => {
            if (this.inputText.value.trim() && this.allocationModeSelect.value === 'by-size') {
                this.generate();
            }
        });
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.printBtn.addEventListener('click', () => this.print());
    }

    toggleSettingsVisibility() {
        const mode = this.allocationModeSelect.value;
        const teamCountItem = document.getElementById('teamCountItem');
        const teamSizeItem = document.getElementById('teamSizeItem');

        if (mode === 'by-count') {
            teamCountItem.style.display = 'flex';
            teamSizeItem.style.display = 'none';
        } else {
            teamCountItem.style.display = 'none';
            teamSizeItem.style.display = 'flex';
        }
    }

    generate() {
        this.clearError();

        const input = this.inputText.value.trim();
        if (!input) {
            this.showError('Please enter at least one name or item');
            return;
        }

        const members = input.split('\n').map(m => m.trim()).filter(m => m);
        
        if (members.length < 2) {
            this.showError('Please enter at least 2 names or items');
            return;
        }

        if (members.length > 200) {
            this.showError('Maximum 200 entries allowed');
            return;
        }

        const mode = this.allocationModeSelect.value;
        const teamCount = parseInt(this.teamCountInput.value);
        const teamSize = parseInt(this.teamSizeInput.value);

        if (mode === 'by-count') {
            if (teamCount < 2 || teamCount > 20) {
                this.showError('Team count must be between 2 and 20');
                return;
            }
            if (teamCount > members.length) {
                this.showError(`Cannot create ${teamCount} teams with only ${members.length} members`);
                return;
            }
            this.teams = this.divideByCount(members, teamCount);
        } else {
            if (teamSize < 1 || teamSize > 10) {
                this.showError('Team size must be between 1 and 10');
                return;
            }
            if (teamSize > members.length) {
                this.showError(`Team size cannot exceed total members (${members.length})`);
                return;
            }
            this.teams = this.divideBySize(members, teamSize);
        }

        this.displayTeams();
        window.MicroTools.utils.showNotification(`Generated ${this.teams.length} teams!`, 'success');
    }

    divideByCount(members, count) {
        const shuffled = this.shuffleArray([...members]);
        const teams = Array.from({ length: count }, () => []);
        
        shuffled.forEach((member, index) => {
            teams[index % count].push(member);
        });

        return teams;
    }

    divideBySize(members, size) {
        const shuffled = this.shuffleArray([...members]);
        const teams = [];
        
        for (let i = 0; i < shuffled.length; i += size) {
            teams.push(shuffled.slice(i, i + size));
        }

        return teams;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayTeams() {
        if (this.teams.length === 0) {
            this.teamsOutput.innerHTML = '<p class="no-teams">No teams generated yet</p>';
            this.currentTeamsText = '';
            return;
        }

        let html = '<div class="teams-display">';
        let text = '';

        this.teams.forEach((team, index) => {
            html += `
                <div class="team-card">
                    <div class="team-header">Team ${index + 1}</div>
                    <div class="team-members">
                        <ul>
                            ${team.map(member => `<li>${member}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="team-count">${team.length} ${team.length === 1 ? 'member' : 'members'}</div>
                </div>
            `;
            text += `Team ${index + 1}:\n${team.join('\n')}\n\n`;
        });

        html += '</div>';
        this.teamsOutput.innerHTML = html;
        this.currentTeamsText = text.trim();
    }

    copyToClipboard() {
        if (this.teams.length === 0) {
            window.MicroTools.utils.showNotification('No teams to copy', 'warning');
            return;
        }

        window.MicroTools.utils.copyToClipboard(this.currentTeamsText, this.copyBtn);
    }

    download() {
        if (this.teams.length === 0) {
            window.MicroTools.utils.showNotification('No teams to download', 'warning');
            return;
        }

        const text = this.currentTeamsText;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teams.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.MicroTools.utils.showNotification('Downloaded successfully', 'success');
    }

    print() {
        if (this.teams.length === 0) {
            window.MicroTools.utils.showNotification('No teams to print', 'warning');
            return;
        }

        const printWindow = window.open('', '', 'width=800,height=600');
        const content = this.teams.map((team, index) => 
            `<div class="print-team"><strong>Team ${index + 1}:</strong><br>${team.join('<br>')}</div>`
        ).join('<br>');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Random Teams</title>
                <style>
                    body { font-family: Arial; margin: 20px; }
                    .print-team { margin: 15px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
                    strong { color: #333; }
                </style>
            </head>
            <body>
                <h1>Random Team Generator Results</h1>
                ${content}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    clear() {
        this.inputText.value = '';
        this.teams = [];
        this.currentTeamsText = '';
        this.teamsOutput.innerHTML = '';
        this.clearError();
        window.MicroTools.utils.showNotification('Cleared', 'success');
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.classList.add('show');
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.classList.remove('show');
        }
    }

    setupFooterYear() {
        const currentYear = document.getElementById('currentYear');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RandomTeamGenerator();
});
