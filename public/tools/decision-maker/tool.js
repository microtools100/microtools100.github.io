// Decision Maker Tool

class DecisionMaker {
    constructor() {
        this.inputOptions = document.getElementById('inputOptions');
        this.decisionType = document.getElementById('decisionType');
        this.spinBtn = document.getElementById('spinBtn');
        this.resultDisplay = document.querySelector('.result-display');
        this.wheel = document.querySelector('.wheel');
        this.resultText = document.querySelector('.result-text');
        
        this.isSpinning = false;
        this.init();
    }

    init() {
        this.spinBtn.addEventListener('click', () => this.spin());
        this.decisionType.addEventListener('change', () => this.updateUI());
    }

    updateUI() {
        const type = this.decisionType.value;
        
        if (type === 'yes-no') {
            this.inputOptions.style.display = 'none';
        } else if (type === 'custom') {
            this.inputOptions.style.display = 'block';
        }
    }

    spin() {
        if (this.isSpinning) return;

        const type = this.decisionType.value;
        let options = [];

        if (type === 'yes-no') {
            options = ['YES', 'NO', 'MAYBE'];
        } else if (type === 'coin') {
            options = ['HEADS', 'TAILS'];
        } else if (type === 'dice') {
            options = Array.from({ length: 6 }, (_, i) => (i + 1).toString());
        } else if (type === 'custom') {
            const text = this.inputOptions.value.trim();
            if (!text) {
                alert('Please enter options');
                return;
            }
            options = text.split('\n')
                .map(o => o.trim())
                .filter(o => o.length > 0);

            if (options.length < 2) {
                alert('Please enter at least 2 options');
                return;
            }
        }

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.resultDisplay.style.display = 'none';

        // Animate the wheel
        const rotations = 5 + Math.random() * 5; // 5-10 full rotations
        const selectedIndex = Math.floor(Math.random() * options.length);
        const finalRotation = rotations * 360 + (selectedIndex / options.length) * 360;

        // Create wheel if needed
        this.createWheel(options, type);
        this.animateWheel(finalRotation, () => {
            this.showResult(options[selectedIndex]);
            this.isSpinning = false;
            this.spinBtn.disabled = false;
        });
    }

    createWheel(options, type) {
        const colors = this.getColors(options.length);
        const sliceAngle = 360 / options.length;
        
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        
        const ctx = canvas.getContext('2d');
        const centerX = 200;
        const centerY = 200;
        const radius = 180;

        // Draw slices
        options.forEach((option, index) => {
            const startAngle = (index * sliceAngle - 90) * Math.PI / 180;
            const endAngle = ((index + 1) * sliceAngle - 90) * Math.PI / 180;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw text
            const textAngle = (startAngle + endAngle) / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.6);
            const textY = centerY + Math.sin(textAngle) * (radius * 0.6);

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(textAngle + Math.PI / 2);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(option, 0, 0);
            ctx.restore();
        });

        this.wheel.innerHTML = '';
        this.wheel.appendChild(canvas);
    }

    animateWheel(rotation, callback) {
        let currentRotation = 0;
        const step = rotation / 30; // 30 frames
        let frame = 0;

        const animate = () => {
            frame++;
            currentRotation += step * (frame / 30);
            this.wheel.style.transform = `rotate(${currentRotation}deg)`;

            if (frame < 30) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        };

        animate();
    }

    showResult(result) {
        this.resultText.textContent = result;
        this.resultDisplay.style.display = 'block';
    }

    getColors(count) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
            '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
        ];
        
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        return result;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.decisionMaker = new DecisionMaker();
});
