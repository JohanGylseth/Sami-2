import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { Character } from '../components/Character.js';
import { getCharacter } from '../data/characters.js';
import { gameContent } from '../data/gameContent.js';

export default class YoikPuzzleScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.YOIK_PUZZLE });
    }

    init(data) {
        this.challengeData = data.challengeData || {};
    }

    create() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        
        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);
        
        // Title
        this.add.text(width / 2, 30, gameContent.challenges.yoik.title, {
            fontSize: '36px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Educational text about joik
        this.add.text(width / 2, 80, 'Joik is a traditional Sámi form of music that connects us to people, places, and feelings.', {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 },
            align: 'center'
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(width / 2, 130, gameContent.challenges.yoik.instruction, {
            fontSize: '16px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Create joiker character
        const joikerData = getCharacter('joiker');
        const joiker = new Character(this, 150, height - 150, joikerData);
        joiker.create();
        
        // Rhythm patterns (represented visually)
        this.patterns = [
            [1, 0, 1, 0, 1, 1, 0, 1], // Pattern 1
            [1, 1, 0, 1, 0, 1, 0, 1], // Pattern 2
            [1, 0, 0, 1, 1, 0, 1, 1]  // Pattern 3
        ];
        
        this.currentPatternIndex = 0;
        this.playerSequence = [];
        this.isPlaying = false;
        this.isListening = false;
        
        // Pattern display area
        const patternY = 250;
        this.patternDisplay = this.add.container(width / 2, patternY);
        
        // Create pattern visualization
        this.createPatternDisplay();
        
        // Player input area
        const inputY = 450;
        this.inputArea = this.add.container(width / 2, inputY);
        this.createInputButtons();
        
        // Status text
        this.statusText = this.add.text(width / 2, 550, 'Click "Play Pattern" to hear the rhythm', {
            fontSize: '20px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 15, y: 8 }
        });
        this.statusText.setOrigin(0.5);
        
        // Control buttons
        const buttonY = height - 100;
        const playButton = this.add.rectangle(
            width / 2 - 150,
            buttonY,
            200,
            50,
            COLORS.BUTTON
        );
        playButton.setStrokeStyle(2, COLORS.PRIMARY);
        playButton.setInteractive({ useHandCursor: true });
        
        const playText = this.add.text(width / 2 - 150, buttonY, 'Play Pattern', {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial'
        });
        playText.setOrigin(0.5);
        
        playButton.on('pointerdown', () => {
            if (!this.isPlaying) {
                this.playPattern();
            }
        });
        
        const checkButton = this.add.rectangle(
            width / 2 + 150,
            buttonY,
            200,
            50,
            COLORS.SECONDARY
        );
        checkButton.setStrokeStyle(2, COLORS.PRIMARY);
        checkButton.setInteractive({ useHandCursor: true });
        
        const checkText = this.add.text(width / 2 + 150, buttonY, 'Check Answer', {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial'
        });
        checkText.setOrigin(0.5);
        
        checkButton.on('pointerdown', () => {
            this.checkPattern();
        });
        
        // Progress
        this.completedPatterns = 0;
        this.progressText = this.add.text(width / 2, height - 50, 'Patterns Completed: 0/3', {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 15, y: 8 }
        });
        this.progressText.setOrigin(0.5);
        
        // Back button
        const backButton = this.add.text(50, height - 50, 'Back to Map', {
            fontSize: '20px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            backgroundColor: COLORS.BUTTON,
            padding: { x: 15, y: 8 }
        });
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.scene.start(SCENES.WORLD_MAP);
        });
    }

    createPatternDisplay() {
        this.patternDisplay.removeAll(true);
        
        const pattern = this.patterns[this.currentPatternIndex];
        const spacing = 50;
        const startX = -(pattern.length - 1) * spacing / 2;
        
        this.patternBeats = [];
        pattern.forEach((beat, index) => {
            const x = startX + index * spacing;
            const circle = this.add.circle(x, 0, 20, beat === 1 ? COLORS.PRIMARY : 0x666666);
            circle.setStrokeStyle(2, 0x000000);
            this.patternBeats.push(circle);
            this.patternDisplay.add(circle);
        });
    }

    createInputButtons() {
        this.inputArea.removeAll(true);
        
        const buttonCount = 8;
        const spacing = 50;
        const startX = -(buttonCount - 1) * spacing / 2;
        
        this.inputButtons = [];
        for (let i = 0; i < buttonCount; i++) {
            const x = startX + i * spacing;
            const button = this.add.circle(x, 0, 25, COLORS.BUTTON);
            button.setStrokeStyle(2, COLORS.PRIMARY);
            button.setInteractive({ useHandCursor: true });
            
            button.index = i;
            button.pressed = false;
            
            button.on('pointerover', () => {
                if (!button.pressed) {
                    button.setFillStyle(COLORS.BUTTON_HOVER);
                }
            });
            
            button.on('pointerout', () => {
                if (!button.pressed) {
                    button.setFillStyle(COLORS.BUTTON);
                }
            });
            
            button.on('pointerdown', () => {
                if (this.isListening) {
                    this.addToSequence(button.index);
                }
            });
            
            this.inputButtons.push(button);
            this.inputArea.add(button);
        }
    }

    playPattern() {
        this.isPlaying = true;
        this.statusText.setText('Listening... Watch the pattern!');
        this.isListening = false;
        this.playerSequence = [];
        
        // Reset input buttons
        this.inputButtons.forEach(btn => {
            btn.pressed = false;
            btn.setFillStyle(COLORS.BUTTON);
        });
        
        const pattern = this.patterns[this.currentPatternIndex];
        let delay = 0;
        
        pattern.forEach((beat, index) => {
            this.time.delayedCall(delay, () => {
                if (beat === 1) {
                    this.patternBeats[index].setFillStyle(COLORS.SECONDARY);
                    // Visual pulse
                    this.tweens.add({
                        targets: this.patternBeats[index],
                        scaleX: 1.3,
                        scaleY: 1.3,
                        duration: 200,
                        yoyo: true
                    });
                }
            });
            delay += 500;
        });
        
        this.time.delayedCall(delay, () => {
            // Reset pattern display
            pattern.forEach((beat, index) => {
                this.patternBeats[index].setFillStyle(beat === 1 ? COLORS.PRIMARY : 0x666666);
            });
            this.isPlaying = false;
            this.isListening = true;
            this.statusText.setText('Now repeat the pattern by clicking the buttons!');
        });
    }

    addToSequence(index) {
        if (this.playerSequence.length < this.patterns[this.currentPatternIndex].length) {
            this.playerSequence.push(index);
            
            // Visual feedback
            const button = this.inputButtons[index];
            button.pressed = true;
            button.setFillStyle(COLORS.SECONDARY);
            
            this.tweens.add({
                targets: button,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true
            });
            
            // Check if sequence is complete
            if (this.playerSequence.length >= this.patterns[this.currentPatternIndex].length) {
                this.statusText.setText('Sequence complete! Click "Check Answer" to verify.');
            }
        }
    }

    checkPattern() {
        const pattern = this.patterns[this.currentPatternIndex];
        const correct = this.playerSequence.length === pattern.length &&
            this.playerSequence.every((val, idx) => {
                const beatIndex = pattern.findIndex((b, i) => b === 1 && i >= idx);
                return val === beatIndex;
            });
        
        if (correct) {
            this.completedPatterns++;
            this.progressText.setText(`Patterns Completed: ${this.completedPatterns}/3`);
            
            this.statusText.setText('Correct! Great job!');
            this.statusText.setStyle({ fill: COLORS.SECONDARY });
            
            // Move to next pattern
            if (this.completedPatterns < 3) {
                this.time.delayedCall(2000, () => {
                    this.currentPatternIndex++;
                    this.createPatternDisplay();
                    this.playerSequence = [];
                    this.statusText.setText('Click "Play Pattern" to hear the next rhythm');
                    this.statusText.setStyle({ fill: COLORS.TEXT });
                });
            } else {
                // All patterns completed
                this.time.delayedCall(2000, () => {
                    this.completeChallenge();
                });
            }
        } else {
            this.statusText.setText('Not quite right. Try again!');
            this.statusText.setStyle({ fill: COLORS.ACCENT });
            
            // Reset
            this.playerSequence = [];
            this.inputButtons.forEach(btn => {
                btn.pressed = false;
                btn.setFillStyle(COLORS.BUTTON);
            });
        }
    }

    completeChallenge() {
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        if (progressTracker.addArtifact(ARTIFACTS.YOIK_CRYSTAL)) {
            tokenSystem.awardTokens(50, 'Artifact Collected!');
        }
        progressTracker.completeChallenge('yoikPuzzle');
        
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        );
        
        const panel = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            600,
            300,
            COLORS.UI_BG
        );
        panel.setStrokeStyle(4, COLORS.SECONDARY);
        
        const message = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            gameContent.challenges.yoik.success + '\n\nYou earned the Yoik Crystal Artifact!',
            {
                fontSize: '24px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: 550 }
            }
        );
        message.setOrigin(0.5);
        
        const continueButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Continue',
            {
                fontSize: '24px',
                fill: COLORS.PRIMARY,
                fontFamily: 'Arial',
                backgroundColor: COLORS.BUTTON,
                padding: { x: 20, y: 10 }
            }
        );
        continueButton.setOrigin(0.5);
        continueButton.setInteractive({ useHandCursor: true });
        
        continueButton.on('pointerdown', () => {
            this.scene.start(SCENES.WORLD_MAP);
        });
    }
}

