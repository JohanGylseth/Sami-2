import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { Character } from '../components/Character.js';
import { getCharacter } from '../data/characters.js';
import { gameContent } from '../data/gameContent.js';

export default class DuodjiCraftingScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.DUODJI_CRAFTING });
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
        this.add.text(width / 2, 30, gameContent.challenges.duodjiCrafting.title, {
            fontSize: '36px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(width / 2, 70, gameContent.challenges.duodjiCrafting.instruction, {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Create craftsperson character
        const craftspersonData = getCharacter('craftsperson');
        const craftsperson = new Character(this, 150, height - 150, craftspersonData);
        craftsperson.create();
        
        // Pattern pieces (traditional Sámi colors: red, blue, yellow, green)
        const patternPieces = [];
        const colors = [
            { color: 0xe74c3c, name: 'Red' },
            { color: 0x3498db, name: 'Blue' },
            { color: 0xf1c40f, name: 'Yellow' },
            { color: 0x2ecc71, name: 'Green' }
        ];
        
        const shapes = ['circle', 'square', 'triangle', 'diamond'];
        const pieceSize = 40;
        const startX = 100;
        const startY = 150;
        
        // Create draggable pattern pieces
        colors.forEach((colorData, colorIndex) => {
            shapes.forEach((shape, shapeIndex) => {
                const x = startX + (colorIndex * 120);
                const y = startY + (shapeIndex * 80);
                
                let piece;
                if (shape === 'circle') {
                    piece = this.add.circle(x, y, pieceSize / 2, colorData.color);
                } else if (shape === 'square') {
                    piece = this.add.rectangle(x, y, pieceSize, pieceSize, colorData.color);
                } else if (shape === 'triangle') {
                    piece = this.add.triangle(x, y, 0, pieceSize / 2, -pieceSize / 2, -pieceSize / 2, pieceSize / 2, -pieceSize / 2, colorData.color);
                } else if (shape === 'diamond') {
                    piece = this.add.triangle(x, y, 0, -pieceSize / 2, pieceSize / 2, 0, 0, pieceSize / 2, -pieceSize / 2, 0, colorData.color);
                }
                
                piece.setStrokeStyle(2, 0x000000);
                piece.setInteractive({ draggable: true });
                piece.setData('originalX', x);
                piece.setData('originalY', y);
                piece.setData('color', colorData.color);
                piece.setData('shape', shape);
                
                this.input.setDraggable(piece);
                patternPieces.push(piece);
            });
        });
        
        // Create crafting area (workbench)
        const workbenchX = width / 2 + 100;
        const workbenchY = height / 2;
        const workbench = this.add.rectangle(
            workbenchX,
            workbenchY,
            400,
            300,
            0x8b4513,
            0.3
        );
        workbench.setStrokeStyle(4, 0x654321);
        this.add.text(workbenchX, workbenchY - 160, 'Crafting Area', {
            fontSize: '20px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Placed pieces
        this.placedPieces = [];
        
        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xcccccc);
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
            
            // Check if dropped in workbench area
            const distX = Math.abs(gameObject.x - workbenchX);
            const distY = Math.abs(gameObject.y - workbenchY);
            
            if (distX < 200 && distY < 150) {
                // Place in workbench
                gameObject.x = gameObject.x;
                gameObject.y = gameObject.y;
                this.placedPieces.push({
                    sprite: gameObject,
                    x: gameObject.x,
                    y: gameObject.y,
                    color: gameObject.getData('color'),
                    shape: gameObject.getData('shape')
                });
                
                // Check if pattern is complete (at least 6 pieces placed)
                if (this.placedPieces.length >= 6) {
                    this.checkPattern();
                }
            } else {
                // Return to original position
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.getData('originalX'),
                    y: gameObject.getData('originalY'),
                    duration: 300
                });
            }
        });
        
        // Clear button
        const clearButton = this.add.text(workbenchX, workbenchY + 180, 'Clear Pattern', {
            fontSize: '20px',
            fill: COLORS.ACCENT,
            fontFamily: 'Arial',
            backgroundColor: COLORS.BUTTON,
            padding: { x: 15, y: 8 }
        });
        clearButton.setOrigin(0.5);
        clearButton.setInteractive({ useHandCursor: true });
        clearButton.on('pointerdown', () => {
            this.placedPieces.forEach(p => {
                this.tweens.add({
                    targets: p.sprite,
                    x: p.sprite.getData('originalX'),
                    y: p.sprite.getData('originalY'),
                    duration: 300
                });
            });
            this.placedPieces = [];
        });
        
        // Submit button
        const submitButton = this.add.text(workbenchX, workbenchY + 220, 'Complete Pattern', {
            fontSize: '20px',
            fill: COLORS.SECONDARY,
            fontFamily: 'Arial',
            backgroundColor: COLORS.BUTTON,
            padding: { x: 15, y: 8 }
        });
        submitButton.setOrigin(0.5);
        submitButton.setInteractive({ useHandCursor: true });
        submitButton.on('pointerdown', () => {
            if (this.placedPieces.length >= 4) {
                this.completeChallenge();
            } else {
                const feedback = this.add.text(
                    workbenchX,
                    workbenchY - 200,
                    'Place at least 4 pieces to complete!',
                    {
                        fontSize: '18px',
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
                    hold: 2000,
                    onComplete: () => feedback.destroy()
                });
            }
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

    checkPattern() {
        // Check if pattern uses traditional Sámi colors
        const colors = this.placedPieces.map(p => p.color);
        const traditionalColors = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71];
        const usesTraditionalColors = colors.some(c => traditionalColors.includes(c));
        
        if (usesTraditionalColors) {
            // Good pattern!
            const feedback = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 200,
                'Beautiful traditional pattern!',
                {
                    fontSize: '24px',
                    fill: COLORS.SECONDARY,
                    fontFamily: 'Arial'
                }
            );
            feedback.setOrigin(0.5);
            feedback.setAlpha(0);
            
            this.tweens.add({
                targets: feedback,
                alpha: 1,
                duration: 500,
                yoyo: true,
                hold: 1500,
                onComplete: () => feedback.destroy()
            });
        }
    }

    completeChallenge() {
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        if (progressTracker.addArtifact(ARTIFACTS.DUODJI_PATTERN)) {
            tokenSystem.awardTokens(50, 'Artifact Collected!');
        }
        progressTracker.completeChallenge('duodjiCrafting');
        
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
            gameContent.challenges.duodjiCrafting.success + '\n\nYou earned the Duodji Pattern Artifact!',
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

