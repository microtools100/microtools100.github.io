// Decision Maker Wheel Tool - Complete Rewrite

class DecisionMaker {
    constructor() {
        this.inputOptions = document.getElementById('inputOptions');
        this.decisionType = document.getElementById('decisionType');
        this.spinBtn = document.getElementById('spinBtn');
        this.resultDisplay = document.querySelector('.result-display');
        this.wheel = document.querySelector('.wheel');
        this.pointer = document.querySelector('.pointer');
        this.resultText = document.querySelector('.result-text');
        this.errorMsg = document.getElementById('errorMsg');
        
        this.isSpinning = false;
        this.currentRotation = 0; // Track total rotation for consistency
        this.segmentCount = 3; // Default
        
        this.init();
        this.initializeWheel();
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

    init() {
        this.spinBtn.addEventListener('click', () => this.spin());
        this.decisionType.addEventListener('change', () => this.updateUI());
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.spin();
            }
        });
    }

    initializeWheel() {
        this.createWheel(['YES', 'NO', 'MAYBE'], 'yes-no');
    }

    updateUI() {
        const type = this.decisionType.value;
        this.clearError();
        if (type === 'yes-no') {
            this.inputOptions.classList.remove('active');
            this.createWheel(['YES', 'NO', 'MAYBE'], 'yes-no');
            SharedUtilities.showNotification('Ready to make a decision!', 'info');
        } else if (type === 'coin') {
            this.inputOptions.classList.remove('active');
            this.createWheel(['HEADS', 'TAILS'], 'coin');
            SharedUtilities.showNotification('Heads or Tails?', 'info');
        } else if (type === 'dice') {
            this.inputOptions.classList.remove('active');
            this.createWheel(Array.from({ length: 6 }, (_, i) => (i + 1).toString()), 'dice');
            SharedUtilities.showNotification('Roll the dice!', 'info');
        } else if (type === 'custom') {
            this.inputOptions.classList.add('active');
            // Show empty wheel for custom - user will update it when they enter options
            this.createWheel(['Add Options...'], 'custom');
            
            // Add event listener to input textarea to update wheel as user types
            const textarea = document.getElementById('inputText');
            if (textarea && !textarea.hasAttribute('data-listener-attached')) {
                textarea.addEventListener('input', () => this.updateCustomWheel());
                textarea.setAttribute('data-listener-attached', 'true');
            }
        }
    }

    updateCustomWheel() {
        const textarea = document.getElementById('inputText');
        const text = textarea ? textarea.value.trim() : '';
        
        if (!text) {
            // No options yet - show placeholder
            this.createWheel(['Add Options...'], 'custom');
            return;
        }
        
        const options = text.split('\n')
            .map(o => o.trim())
            .filter(o => o.length > 0);
        
        if (options.length >= 2) {
            // Valid custom options - show the wheel
            this.createWheel(options, 'custom');
        } else if (options.length === 1) {
            // Only one option - show it but indicate need for more
            this.createWheel([...options, 'Need more...'], 'custom');
        }
    }

    /**
     * Determines which segment is under the pointer at a given rotation
     * @param {number} rotationAngle - Total rotation in degrees
     * @param {number} segmentCount - Number of segments on wheel
     * @returns {number} - Segment index (0 to segmentCount-1)
     * 
     * KEY LOGIC:
     * - Pointer is at CSS rotation 0° (top of wheel)
     * - Segments are drawn starting at canvas angle -90° (which is CSS top)
     * - Segment i spans from angle (i * segmentSize) to ((i+1) * segmentSize)
     * - After rotating by X degrees, the segment at angle (-X) is under pointer
     * - So we find which segment contains angle (-rotationAngle % 360)
     * - Equivalently: (360 - rotationAngle) % 360 / segmentSize
     */
    getWinningSegment(rotationAngle, segmentCount) {
        // Normalize rotation to 0-360 range
        const normalizedRotation = ((rotationAngle % 360) + 360) % 360;
        
        // Segment size in degrees
        const segmentSize = 360 / segmentCount;
        
        // Calculate which segment is under the pointer
        // The pointer looks at position (360 - normalizedRotation) in the wheel's reference frame
        const pointerPosition = (360 - normalizedRotation) % 360;
        
        // Find segment index
        let segmentIndex = Math.floor(pointerPosition / segmentSize);
        
        // Safety check for edge cases
        if (segmentIndex >= segmentCount) {
            segmentIndex = segmentCount - 1;
        }
        if (segmentIndex < 0) {
            segmentIndex = 0;
        }
        
        return segmentIndex;
    }

    spin() {
        if (this.isSpinning) return;

        const type = this.decisionType.value;
        let options = [];

        // Get options based on type
        if (type === 'yes-no') {
            options = ['YES', 'NO', 'MAYBE'];
        } else if (type === 'coin') {
            options = ['HEADS', 'TAILS'];
        } else if (type === 'dice') {
            options = Array.from({ length: 6 }, (_, i) => (i + 1).toString());
        } else if (type === 'custom') {
            const textarea = document.getElementById('inputText');
            const text = textarea ? textarea.value.trim() : '';
            if (!text) {
                this.showError('Please enter your options in the text area');
                SharedUtilities.showNotification('Please enter your options', 'warning');
                return;
            }
            options = text.split('\n')
                .map(o => o.trim())
                .filter(o => o.length > 0);

            if (options.length < 2) {
                this.showError('Please enter at least 2 options (one per line)');
                SharedUtilities.showNotification('Need at least 2 options', 'warning');
                return;
            }
        }

        this.clearError();
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.resultDisplay.style.display = 'none';
        this.resultDisplay.style.opacity = '0';
        this.pointer.classList.add('visible');
        this.segmentCount = options.length;

        // Create wheel before spinning
        this.createWheel(options, type);

        // Calculate spin
        const spinDuration = 4000; // 4 seconds
        const totalSpins = 5 + Math.random() * 5; // 5-10 full rotations
        const finalStopAngle = Math.random() * 360; // Random angle where wheel stops
        const totalRotation = (totalSpins * 360) + finalStopAngle;

        // Determine winning segment BEFORE animation starts
        const winningSegmentIndex = this.getWinningSegment(totalRotation, options.length);
        const winningOption = options[winningSegmentIndex];

        // Animate the wheel
        this.animateWheel(totalRotation, spinDuration, () => {
            this.showResult(winningOption);
            this.currentRotation = totalRotation;
            this.isSpinning = false;
            this.spinBtn.disabled = false;
        });
    }

    createWheel(options, type) {
        const colors = this.getColors(options.length);
        const segmentAngle = 360 / options.length;
        
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 250;
        
        const ctx = canvas.getContext('2d');
        const centerX = 125;
        const centerY = 125;
        const radius = 110;

        // Draw each segment
        options.forEach((option, index) => {
            // Canvas angles: 0° = right, measured clockwise
            // We want segment 0 to start at top (-90°), segment 1 after that, etc.
            const startAngle = (index * segmentAngle - 90) * Math.PI / 180;
            const endAngle = ((index + 1) * segmentAngle - 90) * Math.PI / 180;

            // Draw colored segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw text in center of segment
            const textAngle = (startAngle + endAngle) / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.6);
            const textY = centerY + Math.sin(textAngle) * (radius * 0.6);

            ctx.save();
            ctx.translate(textX, textY);
            // Keep text upright by counter-rotating it
            // The text should be perpendicular to the radius, not following the wheel
            ctx.rotate(textAngle + Math.PI / 2);
            
            // For longer text or when wheel rotates, ensure readability
            // Rotate back to horizontal for better readability
            ctx.rotate(-textAngle - Math.PI / 2);
            
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

    animateWheel(targetRotation, duration, callback) {
        let startTime = null;

        const animate = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use a smooth easing that only goes forward, never backward
            // This is a cubic ease-in-out that naturally decelerates at the end
            let easeProgress;
            if (progress < 0.5) {
                // First half: ease in (accelerate)
                easeProgress = 2 * progress * progress * progress;
            } else {
                // Second half: ease out (decelerate) 
                const p = progress - 1;
                easeProgress = 1 + 2 * p * p * p;
            }

            // Apply rotation - always increases monotonically forward
            const currentRotation = targetRotation * easeProgress;
            this.wheel.style.transform = `rotate(${currentRotation}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure we end at exactly the target rotation
                this.wheel.style.transform = `rotate(${targetRotation}deg)`;
                callback();
            }
        };

        requestAnimationFrame(animate);
    }

    showResult(result) {
        // Add delay to ensure wheel animation completes fully
        setTimeout(() => {
            this.resultText.textContent = result;
            this.resultDisplay.style.display = 'block';
            // Ensure it's fully visible with opacity
            this.resultDisplay.style.opacity = '1';
            this.resultDisplay.style.transition = 'opacity 0.5s ease';
            // Force reflow to trigger animation
            void this.resultDisplay.offsetHeight;
        }, 600);
    }

    getColors(count) {
        // Bright color palette for all wheels
        const brightColors = [
            '#10b981', // emerald green
            '#ef4444', // bright red
            '#f59e0b', // amber yellow
            '#3b82f6', // bright blue
            '#ec4899', // pink
            '#8b5cf6', // purple
            '#06b6d4', // cyan
            '#f97316', // orange
            '#14b8a6', // teal
            '#6366f1'  // indigo
        ];

        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(brightColors[i % brightColors.length]);
        }
        return result;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MicroTools = window.MicroTools || {};
    window.MicroTools.decisionMaker = new DecisionMaker();
});
