import Phaser from 'phaser';
import { SCENES, COLORS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MENU });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
        
        // Title
        const title = this.add.text(width / 2, 150, 'Sámi Quest', {
            fontSize: '72px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);
        
        const subtitle = this.add.text(width / 2, 220, 'Guardians of Sápmi', {
            fontSize: '36px',
            fill: COLORS.SECONDARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        
        // Buttons
        const buttonY = height / 2;
        const buttonSpacing = 80;
        
        // Start/Continue button
        const progressTracker = getProgressTracker();
        const hasProgress = progressTracker.completedChallenges.length > 0;
        const startButton = this.createButton(
            width / 2,
            buttonY,
            hasProgress ? 'Continue Adventure' : 'Start New Game',
            () => {
                if (hasProgress) {
                    this.scene.start(SCENES.WORLD_MAP);
                } else {
                    this.scene.start(SCENES.INTRO);
                }
            }
        );
        
        // Instructions button
        const instructionsButton = this.createButton(
            width / 2,
            buttonY + buttonSpacing,
            'Instructions',
            () => this.showInstructions()
        );
        
        // Reset button (if there's progress)
        if (hasProgress) {
            const resetButton = this.createButton(
                width / 2,
                buttonY + buttonSpacing * 2,
                'Reset Progress',
                () => {
                    if (confirm('Are you sure you want to reset all progress?')) {
                        progressTracker.reset();
                        this.scene.restart();
                    }
                }
            );
        }
        
        // Add decorative elements
        this.addStars();
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 300, 60, COLORS.BUTTON);
        button.setStrokeStyle(3, COLORS.PRIMARY);
        button.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(x, y, text, {
            fontSize: '24px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial'
        });
        buttonText.setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setFillStyle(COLORS.BUTTON_HOVER);
        });
        
        button.on('pointerout', () => {
            button.setFillStyle(COLORS.BUTTON);
        });
        
        button.on('pointerdown', callback);
        
        return button;
    }

    showInstructions() {
        const { width, height } = this.cameras.main;
        
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        overlay.setInteractive();
        
        const panel = this.add.rectangle(width / 2, height / 2, 800, 500, COLORS.UI_BG);
        panel.setStrokeStyle(4, COLORS.PRIMARY);
        
        const title = this.add.text(width / 2, height / 2 - 200, 'Instructions', {
            fontSize: '40px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial'
        });
        title.setOrigin(0.5);
        
        const instructions = [
            'You are a Yoik Guardian Apprentice!',
            '',
            'Your mission: Collect magical artifacts scattered across Sápmi.',
            '',
            'Complete challenges to learn about Sámi culture:',
            '• Language puzzles',
            '• Reindeer herding',
            '• Traditional crafting',
            '• Environmental balance',
            '• Music and joik',
            '• Historical events',
            '• Moral choices',
            '',
            'Earn Cultural Knowledge Tokens and restore the runebomme!'
        ];
        
        const instructionText = this.add.text(
            width / 2,
            height / 2,
            instructions.join('\n'),
            {
                fontSize: '20px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial',
                align: 'center'
            }
        );
        instructionText.setOrigin(0.5);
        
        const closeButton = this.createButton(
            width / 2,
            height / 2 + 200,
            'Close',
            () => {
                overlay.destroy();
                panel.destroy();
                title.destroy();
                instructionText.destroy();
                closeButton.destroy();
            }
        );
    }

    addStars() {
        // Add decorative stars
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const star = this.add.circle(x, y, 2, 0xffffff, 0.8);
            
            this.tweens.add({
                targets: star,
                alpha: { from: 0.3, to: 1 },
                duration: Phaser.Math.Between(1000, 3000),
                repeat: -1,
                yoyo: true
            });
        }
    }
}

