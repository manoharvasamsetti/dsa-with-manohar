/**
 * controls.js - Animation Controller
 * Manages the state and playback of array visualizations/algorithms.
 */

class AnimationController {
    constructor(visualizer, pseudocodeManager) {
        this.visualizer = visualizer;
        this.pseudocode = pseudocodeManager;

        // State
        this.steps = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.speed = 500; // ms per step
        this.timer = null;

        // DOM Elements
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.stepPrevBtn = document.getElementById('step-prev-btn');
        this.stepNextBtn = document.getElementById('step-next-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.speedSlider = document.getElementById('speed-slider');
        this.operationText = document.getElementById('current-operation');

        this.initEventListeners();
    }

    initEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.stepPrevBtn.addEventListener('click', () => this.stepPrev());
        this.stepNextBtn.addEventListener('click', () => this.stepNext());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.speedSlider.addEventListener('input', (e) => {
            // Slider value 1-100. Let's map it: 1 (slow, 2000ms), 100 (fast, 10ms)
            const val = parseInt(e.target.value);
            this.speed = 2000 - (val * 19.9);
            if (this.isPlaying) {
                // Restart timer with new speed
                this.pause();
                this.play();
            }
        });
    }

    setSteps(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.pause();
        this.renderCurrentStep();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (this.currentStep >= this.steps.length - 1) {
                this.currentStep = 0;
            }
            this.play();
        }
    }

    play() {
        if (this.steps.length === 0) return;
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

        const tick = () => {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.renderCurrentStep();
                this.timer = setTimeout(tick, this.speed);
            } else {
                this.pause();
            }
        };

        tick();
    }

    pause() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        clearTimeout(this.timer);
    }

    stepNext() {
        this.pause();
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.renderCurrentStep();
        }
    }

    stepPrev() {
        this.pause();
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderCurrentStep();
        }
    }

    reset() {
        this.pause();
        this.currentStep = 0;
        this.renderCurrentStep();
    }

    renderCurrentStep() {
        if (!this.steps || this.steps.length === 0) return;
        const step = this.steps[this.currentStep];

        // Tell visualizer to draw
        this.visualizer.draw(step);

        // Tell pseudocode to highlight
        if (step.line !== undefined) {
            this.pseudocode.highlightLine(step.line);
        }

        // Update operation text
        if (step.operation) {
            this.operationText.textContent = step.operation;
        }
    }
}

// Global instance 
window.appControls = null; // Will be instantiated properly with visualizer and pseudocode
