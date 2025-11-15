import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { gameContent } from '../data/gameContent.js';

export default class MoralChoiceScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.MORAL_CHOICE });
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
        this.add.text(width / 2, 30, gameContent.challenges.moralChoice.title, {
            fontSize: '36px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(width / 2, 70, gameContent.challenges.moralChoice.instruction, {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Get a random moral choice scenario
        const scenarios = gameContent.moralChoices;
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        this.currentScenario = randomScenario;
        
        // Check if already completed this scenario
        const choiceId = randomScenario.id;
        const previousChoice = progressTracker.getMoralChoice(choiceId);
        
        // Scenario text
        const scenarioText = this.add.text(
            width / 2,
            150,
            randomScenario.scenario,
            {
                fontSize: '22px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial',
                wordWrap: { width: width - 200 },
                align: 'center',
                backgroundColor: COLORS.UI_BG,
                padding: { x: 20, y: 15 }
            }
        );
        scenarioText.setOrigin(0.5);
        
        // Create option buttons
        const optionStartY = 300;
        const optionSpacing = 80;
        this.optionButtons = [];
        
        randomScenario.options.forEach((option, index) => {
            const y = optionStartY + index * optionSpacing;
            
            const button = this.add.rectangle(
                width / 2,
                y,
                700,
                60,
                COLORS.BUTTON
            );
            button.setStrokeStyle(2, COLORS.PRIMARY);
            button.setInteractive({ useHandCursor: true });
            
            const buttonText = this.add.text(
                width / 2,
                y,
                option.text,
                {
                    fontSize: '18px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial',
                    wordWrap: { width: 650 },
                    align: 'center'
                }
            );
            buttonText.setOrigin(0.5);
            
            button.optionData = option;
            
            button.on('pointerover', () => {
                button.setFillStyle(COLORS.BUTTON_HOVER);
            });
            
            button.on('pointerout', () => {
                button.setFillStyle(COLORS.BUTTON);
            });
            
            button.on('pointerdown', () => {
                this.selectOption(option, button);
            });
            
            this.optionButtons.push(button);
        });
        
        // Show previous choice if exists
        if (previousChoice) {
            const previousText = this.add.text(
                width / 2,
                height - 150,
                `Previous choice: ${previousChoice}`,
                {
                    fontSize: '16px',
                    fill: COLORS.SECONDARY,
                    fontFamily: 'Arial',
                    fontStyle: 'italic'
                }
            );
            previousText.setOrigin(0.5);
        }
        
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

    selectOption(option, button) {
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        // Record choice
        progressTracker.recordMoralChoice(this.currentScenario.id, option.text);
        
        // Show result
        const resultPanel = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            700,
            400,
            COLORS.UI_BG
        );
        resultPanel.setStrokeStyle(4, option.correct ? COLORS.SECONDARY : COLORS.ACCENT);
        
        const resultText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            option.correct ? '✓ Good Choice!' : 'Consider this...',
            {
                fontSize: '28px',
                fill: option.correct ? COLORS.SECONDARY : COLORS.ACCENT,
                fontFamily: 'Arial'
            }
        );
        resultText.setOrigin(0.5);
        
        const explanationText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            option.explanation,
            {
                fontSize: '20px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial',
                wordWrap: { width: 650 },
                align: 'center'
            }
        );
        explanationText.setOrigin(0.5);
        
        // Award tokens for correct choices
        if (option.correct) {
            tokenSystem.awardTokens(20, 'Wise Decision');
        }
        
        // Check if all scenarios completed
        const allScenarios = gameContent.moralChoices;
        const completedScenarios = allScenarios.filter(s => 
            progressTracker.getMoralChoice(s.id)
        );
        
        if (completedScenarios.length >= allScenarios.length) {
            // Award artifact
            if (progressTracker.addArtifact(ARTIFACTS.WISDOM_TOKEN)) {
                tokenSystem.awardTokens(50, 'Artifact Collected!');
            }
            progressTracker.completeChallenge('moralChoice');
        }
        
        const continueButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
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

