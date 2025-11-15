import Phaser from 'phaser';
import { SCENES, COLORS } from '../config.js';
import { TokenSystem } from '../components/TokenSystem.js';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.INTRO });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Background - Nordic landscape
        this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);
        this.add.rectangle(width / 2, height, width, height / 2, 0x34495e); // Ground
        
        // Story text
        const storyTexts = [
            "Welcome, young apprentice...",
            "",
            "You have been chosen as a Yoik Guardian Apprentice.",
            "Your mission is to protect the cultural treasures of Sápmi.",
            "",
            "Long ago, seven magical artifacts were scattered across Sápmi:",
            "• The Runebomme Drum",
            "• The Reindeer Amulet",
            "• The Duodji Pattern",
            "• The Yoik Crystal",
            "• The History Scroll",
            "• The Environmental Stone",
            "• The Wisdom Token",
            "",
            "Each artifact holds important knowledge about Sámi culture.",
            "To retrieve them, you must learn and understand:",
            "the language, traditions, history, and wisdom of the Sámi people.",
            "",
            "Your journey begins now..."
        ];
        
        let currentTextIndex = 0;
        let storyDisplay = null;
        
        const showNextText = () => {
            if (currentTextIndex < storyTexts.length) {
                if (storyDisplay) {
                    storyDisplay.destroy();
                }
                
                storyDisplay = this.add.text(
                    width / 2,
                    height / 2,
                    storyTexts[currentTextIndex],
                    {
                        fontSize: '24px',
                        fill: COLORS.TEXT,
                        fontFamily: 'Arial',
                        wordWrap: { width: width - 100 },
                        align: 'center'
                    }
                );
                storyDisplay.setOrigin(0.5);
                storyDisplay.setAlpha(0);
                
                this.tweens.add({
                    targets: storyDisplay,
                    alpha: 1,
                    duration: 500
                });
                
                currentTextIndex++;
            } else {
                // Show continue button
                const continueButton = this.createButton(
                    width / 2,
                    height - 100,
                    'Begin Your Quest',
                    () => {
                        this.scene.start(SCENES.WORLD_MAP);
                    }
                );
            }
        };
        
        // Auto-advance text or click to continue
        this.input.on('pointerdown', showNextText);
        showNextText();
        
        // Add token system display
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
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
}

