import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { gameContent } from '../data/gameContent.js';

export default class EnvironmentalChallengeScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.ENVIRONMENTAL_CHALLENGE });
    }

    init(data) {
        this.challengeData = data.challengeData || {};
    }

    create() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        
        // Background - nature scene
        this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb); // Sky
        this.add.rectangle(width / 2, height - 100, width, 300, 0x90ee90); // Ground
        
        // Title
        this.add.text(width / 2, 30, gameContent.challenges.environmental.title, {
            fontSize: '36px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(width / 2, 70, gameContent.challenges.environmental.instruction, {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Resource levels
        this.resources = {
            reindeer: 50,
            fish: 50,
            plants: 50,
            balance: 50
        };
        
        // Create resource displays
        const resourceX = 150;
        const resourceStartY = 150;
        const resourceSpacing = 60;
        
        this.resourceBars = {};
        Object.keys(this.resources).forEach((key, index) => {
            const y = resourceStartY + index * resourceSpacing;
            
            // Label
            this.add.text(resourceX - 100, y, this.getResourceLabel(key), {
                fontSize: '18px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial'
            }).setOrigin(1, 0.5);
            
            // Bar background
            const barBg = this.add.rectangle(resourceX, y, 200, 30, 0x333333);
            
            // Bar fill
            const barFill = this.add.rectangle(
                resourceX - 100 + (this.resources[key] * 2),
                y,
                this.resources[key] * 2,
                30,
                this.getResourceColor(key)
            );
            barFill.setOrigin(0, 0.5);
            
            // Value text
            const valueText = this.add.text(resourceX + 120, y, `${this.resources[key]}%`, {
                fontSize: '18px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial'
            });
            
            this.resourceBars[key] = { bg: barBg, fill: barFill, text: valueText };
        });
        
        // Action buttons
        const actionX = width - 200;
        const actionStartY = 200;
        const actions = [
            { name: 'Increase Reindeer', key: 'reindeer', change: 10 },
            { name: 'Increase Fishing', key: 'fish', change: 10 },
            { name: 'Harvest Plants', key: 'plants', change: 10 },
            { name: 'Restore Balance', key: 'balance', change: 5 }
        ];
        
        this.actionButtons = [];
        actions.forEach((action, index) => {
            const y = actionStartY + index * 70;
            const button = this.add.rectangle(
                actionX,
                y,
                250,
                50,
                COLORS.BUTTON
            );
            button.setStrokeStyle(2, COLORS.PRIMARY);
            button.setInteractive({ useHandCursor: true });
            
            const buttonText = this.add.text(actionX, y, action.name, {
                fontSize: '16px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial'
            });
            buttonText.setOrigin(0.5);
            
            button.action = action;
            
            button.on('pointerover', () => {
                button.setFillStyle(COLORS.BUTTON_HOVER);
            });
            
            button.on('pointerout', () => {
                button.setFillStyle(COLORS.BUTTON);
            });
            
            button.on('pointerdown', () => {
                this.performAction(action);
            });
            
            this.actionButtons.push(button);
        });
        
        // Balance indicator
        this.balanceIndicator = this.add.text(
            width / 2,
            height - 150,
            'Ecosystem Status: Balanced',
            {
                fontSize: '24px',
                fill: COLORS.SECONDARY,
                fontFamily: 'Arial',
                backgroundColor: '#000',
                padding: { x: 20, y: 10 }
            }
        );
        this.balanceIndicator.setOrigin(0.5);
        
        // Turns counter
        this.turns = 0;
        this.maxTurns = 10;
        this.turnsText = this.add.text(width / 2, height - 100, `Turns: ${this.turns}/${this.maxTurns}`, {
            fontSize: '20px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 15, y: 8 }
        });
        this.turnsText.setOrigin(0.5);
        
        // Update balance
        this.updateBalance();
        
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

    getResourceLabel(key) {
        const labels = {
            reindeer: 'Reindeer Grazing',
            fish: 'Fish Population',
            plants: 'Plant Resources',
            balance: 'Ecosystem Balance'
        };
        return labels[key] || key;
    }

    getResourceColor(key) {
        const colors = {
            reindeer: 0x8b4513,
            fish: 0x3498db,
            plants: 0x2ecc71,
            balance: 0xf39c12
        };
        return colors[key] || 0xffffff;
    }

    performAction(action) {
        if (this.turns >= this.maxTurns) {
            return;
        }
        
        this.turns++;
        this.turnsText.setText(`Turns: ${this.turns}/${this.maxTurns}`);
        
        // Apply action
        if (action.key === 'balance') {
            // Restore balance - bring all resources closer to 50
            Object.keys(this.resources).forEach(key => {
                if (key !== 'balance') {
                    if (this.resources[key] > 50) {
                        this.resources[key] = Math.max(50, this.resources[key] - action.change);
                    } else {
                        this.resources[key] = Math.min(50, this.resources[key] + action.change);
                    }
                }
            });
        } else {
            // Increase specific resource
            this.resources[action.key] = Math.min(100, this.resources[action.key] + action.change);
            
            // Decrease other resources (ecosystem impact)
            Object.keys(this.resources).forEach(key => {
                if (key !== action.key && key !== 'balance') {
                    this.resources[key] = Math.max(0, this.resources[key] - action.change / 2);
                }
            });
        }
        
        // Update displays
        this.updateResourceBars();
        this.updateBalance();
        
        // Check win/lose conditions
        if (this.turns >= this.maxTurns) {
            this.endGame();
        }
    }

    updateResourceBars() {
        Object.keys(this.resources).forEach(key => {
            const bar = this.resourceBars[key];
            const value = this.resources[key];
            
            bar.fill.width = value * 2;
            bar.fill.x = bar.bg.x - 100 + (value * 2);
            bar.text.setText(`${value}%`);
        });
    }

    updateBalance() {
        // Calculate balance based on how close all resources are to 50
        let totalDeviation = 0;
        Object.keys(this.resources).forEach(key => {
            if (key !== 'balance') {
                totalDeviation += Math.abs(this.resources[key] - 50);
            }
        });
        
        this.resources.balance = Math.max(0, 100 - totalDeviation);
        this.updateResourceBars();
        
        // Update indicator
        let status = 'Balanced';
        let color = COLORS.SECONDARY;
        
        if (this.resources.balance < 30) {
            status = 'Unbalanced - Needs Attention!';
            color = COLORS.ACCENT;
        } else if (this.resources.balance < 60) {
            status = 'Somewhat Balanced';
            color = 0xf39c12;
        }
        
        this.balanceIndicator.setText(`Ecosystem Status: ${status}`);
        this.balanceIndicator.setStyle({ fill: color });
    }

    endGame() {
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        const success = this.resources.balance >= 60;
        
        if (success) {
            if (progressTracker.addArtifact(ARTIFACTS.ENVIRONMENTAL_STONE)) {
                tokenSystem.awardTokens(50, 'Artifact Collected!');
            }
            progressTracker.completeChallenge('environmental');
        }
        
        const message = success
            ? gameContent.challenges.environmental.success
            : gameContent.challenges.environmental.failure;
        
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
        panel.setStrokeStyle(4, success ? COLORS.SECONDARY : COLORS.ACCENT);
        
        const resultText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            message + (success ? '\n\nYou earned the Environmental Stone!' : ''),
            {
                fontSize: '24px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: 550 }
            }
        );
        resultText.setOrigin(0.5);
        
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

