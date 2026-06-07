/**
 * Countdown Timer Tool
 * Set a countdown timer with hours, minutes, and seconds with audio notification
 */

class CountdownTimer {
    constructor() {
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.soundToggle = document.getElementById('soundToggle');
        this.errorMsg = document.getElementById('errorMsg');

        this.timeRemaining = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;

        this.init();
    }

    /**
     * Initialize event listeners
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.updateDisplay();
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.hoursInput.addEventListener('change', () => this.updateDisplay());
        this.minutesInput.addEventListener('change', () => this.updateDisplay());
        this.secondsInput.addEventListener('change', () => this.updateDisplay());
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Start/Resume
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (this.isPaused) {
                    this.togglePause();
                } else if (!this.isRunning) {
                    this.start();
                }
            }
            // Ctrl/Cmd + Shift + R: Reset
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'r') {
                e.preventDefault();
                this.reset();
            }
        });
    }

    /**
     * Clear error message
     */
    clearError() {
        if (this.errorMsg) {
            this.errorMsg.classList.remove('show');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.classList.add('show');
        }
    }

    /**
     * Update timer display
     */
    updateDisplay() {
        const hours = Math.max(0, Math.min(23, parseInt(this.hoursInput.value) || 0));
        const minutes = Math.max(0, Math.min(59, parseInt(this.minutesInput.value) || 0));
        const seconds = Math.max(0, Math.min(59, parseInt(this.secondsInput.value) || 0));

        this.hoursInput.value = hours;
        this.minutesInput.value = minutes;
        this.secondsInput.value = seconds;

        this.timerDisplay.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        this.clearError();
    }

    /**
     * Start the timer
     */
    start() {
        if (this.isRunning) return;

        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;

        this.timeRemaining = hours * 3600 + minutes * 60 + seconds;

        if (this.timeRemaining === 0) {
            this.showError('Please set a time greater than 0');
            SharedUtilities.showNotification('Please set a time greater than 0', 'warning');
            return;
        }

        this.clearError();
        this.isRunning = true;
        this.isPaused = false;
        this.hoursInput.disabled = true;
        this.minutesInput.disabled = true;
        this.secondsInput.disabled = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;

        SharedUtilities.showNotification('Timer started', 'info');

        this.timerInterval = setInterval(() => this.tick(), 1000);
    }

    /**
     * Timer tick - called every second
     */
    tick() {
        this.timeRemaining--;

        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;

        this.timerDisplay.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        document.title = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - MicroTools`;

        if (this.timeRemaining === 0) {
            this.finish();
        }
    }

    /**
     * Toggle pause/resume
     */
    togglePause() {
        if (this.isPaused) {
            this.isRunning = true;
            this.isPaused = false;
            this.pauseBtn.textContent = 'Pause';
            SharedUtilities.showNotification('Timer resumed', 'info');
            this.timerInterval = setInterval(() => this.tick(), 1000);
        } else {
            this.isRunning = false;
            this.isPaused = true;
            this.pauseBtn.textContent = 'Resume';
            SharedUtilities.showNotification('Timer paused', 'info');
            clearInterval(this.timerInterval);
        }
    }

    /**
     * Timer finished
     */
    finish() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.hoursInput.disabled = false;
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;

        document.title = 'MicroTools';
        SharedUtilities.showNotification('Timer finished!', 'success');

        if (this.soundToggle.checked) {
            this.playSound();
        }
    }

    /**
     * Reset the timer
     */
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.hoursInput.disabled = false;
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;

        this.hoursInput.value = 0;
        this.minutesInput.value = 1;
        this.secondsInput.value = 0;
        this.updateDisplay();

        document.title = 'MicroTools';
        SharedUtilities.showNotification('Timer reset', 'info');
        this.clearError();
    }

    /**
     * Play audio notification
     */
    playSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
}

/**
 * Set preset time
 */
function setPreset(minutes, hours = 0, seconds = 0) {
    const timer = window.countdownTimerInstance;
    if (timer) {
        timer.hoursInput.value = hours;
        timer.minutesInput.value = minutes;
        timer.secondsInput.value = seconds;
        timer.updateDisplay();
        SharedUtilities.showNotification(`Timer set to ${hours}h ${minutes}m ${seconds}s`, 'info');
    }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.countdownTimerInstance = new CountdownTimer();
});