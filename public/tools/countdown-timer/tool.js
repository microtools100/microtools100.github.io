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

        this.timeRemaining = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.hoursInput.addEventListener('change', () => this.updateDisplay());
        this.minutesInput.addEventListener('change', () => this.updateDisplay());
        this.secondsInput.addEventListener('change', () => this.updateDisplay());

        this.updateDisplay();
    }

    updateDisplay() {
        const hours = Math.max(0, Math.min(23, parseInt(this.hoursInput.value) || 0));
        const minutes = Math.max(0, Math.min(59, parseInt(this.minutesInput.value) || 0));
        const seconds = Math.max(0, Math.min(59, parseInt(this.secondsInput.value) || 0));

        this.hoursInput.value = hours;
        this.minutesInput.value = minutes;
        this.secondsInput.value = seconds;

        this.timerDisplay.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    start() {
        if (this.isRunning) return;

        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;

        this.timeRemaining = hours * 3600 + minutes * 60 + seconds;

        if (this.timeRemaining === 0) {
            window.MicroTools?.utils?.showNotification?.('Please set a time', 'warning');
            return;
        }

        this.isRunning = true;
        this.isPaused = false;
        this.hoursInput.disabled = true;
        this.minutesInput.disabled = true;
        this.secondsInput.disabled = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;

        this.timerInterval = setInterval(() => this.tick(), 1000);
    }

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

    togglePause() {
        if (this.isPaused) {
            this.isRunning = true;
            this.isPaused = false;
            this.pauseBtn.textContent = '⏸️ Pause';
            this.timerInterval = setInterval(() => this.tick(), 1000);
        } else {
            this.isRunning = false;
            this.isPaused = true;
            this.pauseBtn.textContent = '▶️ Resume';
            clearInterval(this.timerInterval);
        }
    }

    finish() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '⏸️ Pause';
        this.hoursInput.disabled = false;
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;

        document.title = 'MicroTools';
        window.MicroTools?.utils?.showNotification?.('⏱️ Timer finished!', 'success');

        if (this.soundToggle.checked) {
            this.playSound();
        }
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '⏸️ Pause';
        this.hoursInput.disabled = false;
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;

        this.hoursInput.value = 0;
        this.minutesInput.value = 1;
        this.secondsInput.value = 0;
        this.updateDisplay();

        document.title = 'MicroTools';
        window.MicroTools?.utils?.showNotification?.('Timer reset', 'info');
    }

    playSound() {
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
    }
}

function setPreset(minutes, hours = 0, seconds = 0) {
    const timer = window.countdownTimerInstance;
    if (timer) {
        timer.hoursInput.value = hours;
        timer.minutesInput.value = minutes;
        timer.secondsInput.value = seconds;
        timer.updateDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.countdownTimerInstance = new CountdownTimer();
});