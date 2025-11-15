import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { Artifact } from '../components/Artifact.js';

export default class WorldMapScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.WORLD_MAP });
    }

    create() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        
        // Background - Sápmi map
        this.add.rectangle(width / 2, height / 2, width, height, 0x34495e);
        this.add.text(width / 2, 50, 'Sápmi - The Sámi Homeland', {
            fontSize: '36px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Add token display
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Define challenge locations on the map
        const challenges = [
            {
                name: 'Language Puzzle',
                scene: SCENES.LANGUAGE_PUZZLE,
                artifact: ARTIFACTS.RUNEBOMME,
                x: 200,
                y: 200,
                description: 'Learn Sámi words with the elder',
                unlocked: true
            },
            {
                name: 'Reindeer Herding',
                scene: SCENES.REINDEER_HERDING,
                artifact: ARTIFACTS.REINDEER_AMULET,
                x: 400,
                y: 300,
                description: 'Guide the reindeer herd',
                unlocked: progressTracker.hasArtifact(ARTIFACTS.RUNEBOMME)
            },
            {
                name: 'Duodji Crafting',
                scene: SCENES.DUODJI_CRAFTING,
                artifact: ARTIFACTS.DUODJI_PATTERN,
                x: 600,
                y: 250,
                description: 'Create traditional patterns',
                unlocked: progressTracker.hasArtifact(ARTIFACTS.REINDEER_AMULET)
            },
            {
                name: 'Environmental Challenge',
                scene: SCENES.ENVIRONMENTAL_CHALLENGE,
                artifact: ARTIFACTS.ENVIRONMENTAL_STONE,
                x: 800,
                y: 350,
                description: 'Balance the ecosystem',
                unlocked: progressTracker.hasArtifact(ARTIFACTS.DUODJI_PATTERN)
            },
            {
                name: 'Yoik Puzzle',
                scene: SCENES.YOIK_PUZZLE,
                artifact: ARTIFACTS.YOIK_CRYSTAL,
                x: 300,
                y: 450,
                description: 'Learn about joik music',
                unlocked: progressTracker.hasArtifact(ARTIFACTS.ENVIRONMENTAL_STONE)
            },
            {
                name: 'History Timeline',
                scene: SCENES.HISTORY_TIMELINE,
                artifact: ARTIFACTS.HISTORY_SCROLL,
                x: 700,
                y: 500,
                description: 'Explore Sámi history',
                unlocked: progressTracker.hasArtifact(ARTIFACTS.YOIK_CRYSTAL)
            },
            {
                name: 'Moral Choices',
                scene: SCENES.MORAL_CHOICE,
                artifact: ARTIFACTS.WISDOM_TOKEN,
                x: 500,
                y: 600,
                description: 'Make important decisions',
                unlocked: progressTracker.hasArtifact(ARTIFACTS.HISTORY_SCROLL)
            }
        ];
        
        // Create challenge markers
        challenges.forEach((challenge, index) => {
            const marker = this.add.circle(challenge.x, challenge.y, 30, 
                challenge.unlocked ? COLORS.PRIMARY : 0x666666);
            marker.setStrokeStyle(3, challenge.unlocked ? COLORS.SECONDARY : 0x333333);
            marker.setInteractive({ useHandCursor: challenge.unlocked });
            
            const label = this.add.text(challenge.x, challenge.y - 50, challenge.name, {
                fontSize: '16px',
                fill: challenge.unlocked ? COLORS.TEXT : 0x999999,
                fontFamily: 'Arial',
                backgroundColor: '#000',
                padding: { x: 5, y: 3 }
            });
            label.setOrigin(0.5);
            
            if (challenge.unlocked) {
                marker.on('pointerover', () => {
                    marker.setScale(1.2);
                    this.showTooltip(challenge.x, challenge.y, challenge.description);
                });
                
                marker.on('pointerout', () => {
                    marker.setScale(1);
                    if (this.tooltip) {
                        this.tooltip.destroy();
                    }
                });
                
                marker.on('pointerdown', () => {
                    this.scene.start(challenge.scene, { challengeData: challenge });
                });
            } else {
                // Show lock icon
                const lock = this.add.text(challenge.x, challenge.y, '🔒', {
                    fontSize: '20px'
                });
                lock.setOrigin(0.5);
            }
            
            // Check if artifact already collected
            if (progressTracker.hasArtifact(challenge.artifact)) {
                const checkmark = this.add.text(challenge.x, challenge.y, '✓', {
                    fontSize: '30px',
                    fill: COLORS.SECONDARY
                });
                checkmark.setOrigin(0.5);
            }
        });
        
        // Check if all artifacts collected - show final mission
        if (progressTracker.getAllArtifacts().length >= 7) {
            const finalMission = this.add.rectangle(
                width / 2,
                height - 100,
                400,
                80,
                COLORS.ACCENT
            );
            finalMission.setStrokeStyle(4, COLORS.PRIMARY);
            finalMission.setInteractive({ useHandCursor: true });
            
            const finalText = this.add.text(width / 2, height - 100, 'Final Mission: Restore the Runebomme', {
                fontSize: '24px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial'
            });
            finalText.setOrigin(0.5);
            
            finalMission.on('pointerdown', () => {
                this.scene.start(SCENES.FINAL_MISSION);
            });
        }
        
        // Menu button
        const menuButton = this.add.text(50, height - 50, 'Menu', {
            fontSize: '20px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            backgroundColor: COLORS.BUTTON,
            padding: { x: 15, y: 8 }
        });
        menuButton.setInteractive({ useHandCursor: true });
        menuButton.on('pointerdown', () => {
            this.scene.start(SCENES.MENU);
        });
    }

    showTooltip(x, y, text) {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
        
        this.tooltip = this.add.text(x, y + 60, text, {
            fontSize: '14px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        this.tooltip.setOrigin(0.5);
    }
}

