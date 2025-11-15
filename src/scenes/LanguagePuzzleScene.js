import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { Character } from '../components/Character.js';
import { getCharacter } from '../data/characters.js';
import { getRandomVocabulary } from '../data/samiVocabulary.js';
import { gameContent } from '../data/gameContent.js';

export default class LanguagePuzzleScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.LANGUAGE_PUZZLE });
    }

    init(data) {
        this.challengeData = data.challengeData || {};
    }

    create() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        
        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x34495e);
        
        // Title
        this.add.text(width / 2, 50, gameContent.challenges.languagePuzzle.title, {
            fontSize: '36px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(width / 2, 100, gameContent.challenges.languagePuzzle.instruction, {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Get vocabulary for the puzzle
        const vocabulary = getRandomVocabulary(6);
        this.currentVocabulary = vocabulary;
        this.selectedWord = null;
        this.matches = 0;
        this.totalMatches = vocabulary.length;
        
        // Create elder character
        const elderData = getCharacter('elder');
        const elder = new Character(this, 150, height - 150, elderData);
        elder.create();
        
        // Create word buttons (left side)
        const wordStartY = 200;
        const wordSpacing = 60;
        this.wordButtons = [];
        
        vocabulary.forEach((item, index) => {
            const wordButton = this.add.rectangle(
                200,
                wordStartY + index * wordSpacing,
                250,
                50,
                COLORS.BUTTON
            );
            wordButton.setStrokeStyle(2, COLORS.PRIMARY);
            wordButton.setInteractive({ useHandCursor: true });
            
            const wordText = this.add.text(
                200,
                wordStartY + index * wordSpacing,
                `${item.word}\n(${item.pronunciation})`,
                {
                    fontSize: '18px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial',
                    align: 'center'
                }
            );
            wordText.setOrigin(0.5);
            
            wordButton.wordData = item;
            wordButton.matched = false;
            
            wordButton.on('pointerover', () => {
                if (!wordButton.matched) {
                    wordButton.setFillStyle(COLORS.BUTTON_HOVER);
                }
            });
            
            wordButton.on('pointerout', () => {
                if (!wordButton.matched) {
                    wordButton.setFillStyle(COLORS.BUTTON);
                }
            });
            
            wordButton.on('pointerdown', () => {
                if (!wordButton.matched) {
                    this.selectWord(wordButton);
                }
            });
            
            this.wordButtons.push(wordButton);
        });
        
        // Create translation buttons (right side)
        const shuffledTranslations = [...vocabulary].sort(() => Math.random() - 0.5);
        this.translationButtons = [];
        
        shuffledTranslations.forEach((item, index) => {
            const transButton = this.add.rectangle(
                width - 200,
                wordStartY + index * wordSpacing,
                250,
                50,
                COLORS.SECONDARY
            );
            transButton.setStrokeStyle(2, COLORS.PRIMARY);
            transButton.setInteractive({ useHandCursor: true });
            
            // Create simple illustration placeholder (colored circle representing the word)
            const illustration = this.add.circle(
                width - 200 - 80,
                wordStartY + index * wordSpacing,
                20,
                this.getColorForCategory(item.category)
            );
            
            const transText = this.add.text(
                width - 200 + 30,
                wordStartY + index * wordSpacing,
                item.translation,
                {
                    fontSize: '18px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial'
                }
            );
            transText.setOrigin(0.5, 0.5);
            
            transButton.wordData = item;
            transButton.matched = false;
            transButton.illustration = illustration;
            
            transButton.on('pointerover', () => {
                if (!transButton.matched) {
                    transButton.setFillStyle(0x27ae60);
                }
            });
            
            transButton.on('pointerout', () => {
                if (!transButton.matched) {
                    transButton.setFillStyle(COLORS.SECONDARY);
                }
            });
            
            transButton.on('pointerdown', () => {
                if (!transButton.matched && this.selectedWord) {
                    this.attemptMatch(this.selectedWord, transButton);
                }
            });
            
            this.translationButtons.push(transButton);
        });
        
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

    getColorForCategory(category) {
        const colors = {
            animals: 0x8b4513,
            nature: 0x3498db,
            culture: 0xe74c3c
        };
        return colors[category] || 0xffffff;
    }

    selectWord(wordButton) {
        // Deselect previous
        if (this.selectedWord) {
            this.selectedWord.setStrokeStyle(2, COLORS.PRIMARY);
        }
        
        // Select new
        this.selectedWord = wordButton;
        wordButton.setStrokeStyle(4, COLORS.ACCENT);
    }

    attemptMatch(wordButton, transButton) {
        if (wordButton.wordData.word === transButton.wordData.word) {
            // Correct match!
            wordButton.matched = true;
            transButton.matched = true;
            wordButton.setFillStyle(0x2ecc71);
            transButton.setFillStyle(0x2ecc71);
            wordButton.setStrokeStyle(3, 0x27ae60);
            transButton.setStrokeStyle(3, 0x27ae60);
            this.selectedWord = null;
            this.matches++;
            
            // Show success feedback
            const feedback = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                'Correct!',
                {
                    fontSize: '32px',
                    fill: COLORS.SECONDARY,
                    fontFamily: 'Arial'
                }
            );
            feedback.setOrigin(0.5);
            feedback.setAlpha(0);
            
            this.tweens.add({
                targets: feedback,
                alpha: 1,
                duration: 300,
                yoyo: true,
                hold: 500,
                onComplete: () => feedback.destroy()
            });
            
            // Check if puzzle complete
            if (this.matches >= this.totalMatches) {
                this.completeChallenge();
            }
        } else {
            // Wrong match
            const feedback = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                'Try again!',
                {
                    fontSize: '32px',
                    fill: COLORS.ACCENT,
                    fontFamily: 'Arial'
                }
            );
            feedback.setOrigin(0.5);
            feedback.setAlpha(0);
            
            this.tweens.add({
                targets: feedback,
                alpha: 1,
                duration: 300,
                yoyo: true,
                hold: 500,
                onComplete: () => feedback.destroy()
            });
            
            // Deselect
            if (this.selectedWord) {
                this.selectedWord.setStrokeStyle(2, COLORS.PRIMARY);
                this.selectedWord = null;
            }
        }
    }

    completeChallenge() {
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        // Award artifact
        if (progressTracker.addArtifact(ARTIFACTS.RUNEBOMME)) {
            tokenSystem.awardTokens(50, 'Artifact Collected!');
        }
        
        progressTracker.completeChallenge('languagePuzzle');
        
        // Show completion message
        const completion = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            600,
            300,
            COLORS.UI_BG
        );
        completion.setStrokeStyle(4, COLORS.SECONDARY);
        
        const message = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            gameContent.challenges.languagePuzzle.success + '\n\nYou earned the Runebomme Artifact!',
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

