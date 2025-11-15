import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';

export default class FinalMissionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalMissionScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        
        // Background - magical scene
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
        
        // Title
        this.add.text(width / 2, 100, 'Final Mission: Restore the Runebomme', {
            fontSize: '48px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Check all artifacts collected
        const allArtifacts = progressTracker.getAllArtifacts();
        const requiredArtifacts = [
            ARTIFACTS.RUNEBOMME,
            ARTIFACTS.REINDEER_AMULET,
            ARTIFACTS.DUODJI_PATTERN,
            ARTIFACTS.YOIK_CRYSTAL,
            ARTIFACTS.HISTORY_SCROLL,
            ARTIFACTS.ENVIRONMENTAL_STONE,
            ARTIFACTS.WISDOM_TOKEN
        ];
        
        const hasAllArtifacts = requiredArtifacts.every(artifact => 
            allArtifacts.includes(artifact)
        );
        
        if (!hasAllArtifacts) {
            // Show message that all artifacts are needed
            const message = this.add.text(
                width / 2,
                height / 2,
                'You need to collect all 7 artifacts before you can restore the Runebomme!\n\nReturn to the map to complete all challenges.',
                {
                    fontSize: '24px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial',
                    align: 'center',
                    wordWrap: { width: width - 100 },
                    backgroundColor: COLORS.UI_BG,
                    padding: { x: 30, y: 20 }
                }
            );
            message.setOrigin(0.5);
            
            const backButton = this.add.text(
                width / 2,
                height - 100,
                'Return to Map',
                {
                    fontSize: '24px',
                    fill: COLORS.PRIMARY,
                    fontFamily: 'Arial',
                    backgroundColor: COLORS.BUTTON,
                    padding: { x: 20, y: 10 }
                }
            );
            backButton.setOrigin(0.5);
            backButton.setInteractive({ useHandCursor: true });
            backButton.on('pointerdown', () => {
                this.scene.start(SCENES.WORLD_MAP);
            });
            return;
        }
        
        // Final mission - restoration ceremony
        const storyText = this.add.text(
            width / 2,
            height / 2 - 100,
            'You have collected all the artifacts!\n\nNow, place each artifact in its correct position\nto restore the magical Runebomme.',
            {
                fontSize: '24px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: width - 100 }
            }
        );
        storyText.setOrigin(0.5);
        
        // Create runebomme (drum) in center
        const runebommeX = width / 2;
        const runebommeY = height / 2 + 50;
        
        // Drum base
        const drum = this.add.ellipse(runebommeX, runebommeY, 200, 150, 0x8b4513);
        drum.setStrokeStyle(4, 0x654321);
        
        // Artifact slots around the drum
        const slotRadius = 150;
        const slotCount = 7;
        this.artifactSlots = [];
        this.placedArtifacts = [];
        
        requiredArtifacts.forEach((artifact, index) => {
            const angle = (index / slotCount) * Math.PI * 2;
            const x = runebommeX + Math.cos(angle) * slotRadius;
            const y = runebommeY + Math.sin(angle) * slotRadius;
            
            const slot = this.add.circle(x, y, 30, 0x333333, 0.5);
            slot.setStrokeStyle(2, COLORS.PRIMARY);
            slot.artifactType = artifact;
            slot.filled = false;
            
            this.artifactSlots.push(slot);
            
            // Create draggable artifact
            const artifactSprite = this.add.circle(x - 200, y, 25, this.getArtifactColor(artifact));
            artifactSprite.setStrokeStyle(2, 0x000000);
            artifactSprite.setInteractive({ draggable: true });
            artifactSprite.artifactType = artifact;
            artifactSprite.slot = null;
            
            this.input.setDraggable(artifactSprite);
        });
        
        // Drag events
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            // Check if dropped on a slot
            let placed = false;
            this.artifactSlots.forEach(slot => {
                if (!slot.filled && slot.artifactType === gameObject.artifactType) {
                    const dist = Phaser.Math.Distance.Between(
                        gameObject.x,
                        gameObject.y,
                        slot.x,
                        slot.y
                    );
                    
                    if (dist < 50) {
                        // Place artifact
                        gameObject.x = slot.x;
                        gameObject.y = slot.y;
                        slot.filled = true;
                        gameObject.slot = slot;
                        placed = true;
                        this.placedArtifacts.push(gameObject);
                        
                        // Visual feedback
                        slot.setFillStyle(COLORS.SECONDARY, 0.8);
                        gameObject.setTint(0xffffff);
                        
                        // Check if all placed
                        if (this.placedArtifacts.length === requiredArtifacts.length) {
                            this.completeRestoration();
                        }
                    }
                }
            });
            
            if (!placed && gameObject.slot) {
                // Return to slot if already placed
                gameObject.x = gameObject.slot.x;
                gameObject.y = gameObject.slot.y;
            } else if (!placed) {
                // Return to original position
                const angle = requiredArtifacts.indexOf(gameObject.artifactType) / slotCount * Math.PI * 2;
                gameObject.x = runebommeX + Math.cos(angle) * slotRadius - 200;
                gameObject.y = runebommeY + Math.sin(angle) * slotRadius;
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

    getArtifactColor(artifactType) {
        const colors = {
            [ARTIFACTS.RUNEBOMME]: 0x8b4513,
            [ARTIFACTS.REINDEER_AMULET]: 0x8b4513,
            [ARTIFACTS.DUODJI_PATTERN]: 0xe74c3c,
            [ARTIFACTS.YOIK_CRYSTAL]: 0x9b59b6,
            [ARTIFACTS.HISTORY_SCROLL]: 0x34495e,
            [ARTIFACTS.ENVIRONMENTAL_STONE]: 0x2ecc71,
            [ARTIFACTS.WISDOM_TOKEN]: 0xf39c12
        };
        return colors[artifactType] || 0xffffff;
    }

    completeRestoration() {
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        // Award bonus tokens
        tokenSystem.awardTokens(100, 'Runebomme Restored!');
        
        // Show completion celebration
        this.time.delayedCall(500, () => {
            const overlay = this.add.rectangle(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.8
            );
            
            // Celebration text
            const celebration = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 100,
                '🎉 Congratulations! 🎉',
                {
                    fontSize: '56px',
                    fill: COLORS.SECONDARY,
                    fontFamily: 'Arial',
                    stroke: '#000',
                    strokeThickness: 6
                }
            );
            celebration.setOrigin(0.5);
            
            const message = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                'You have successfully restored the Runebomme!\n\n' +
                'Through your journey, you have learned about:\n' +
                '• Sámi language and vocabulary\n' +
                '• Traditional reindeer herding\n' +
                '• Duodji crafts and patterns\n' +
                '• Environmental stewardship\n' +
                '• Joik and musical traditions\n' +
                '• Sámi history and rights\n' +
                '• Cultural values and respect\n\n' +
                'You are now a true Guardian of Sápmi!',
                {
                    fontSize: '22px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial',
                    align: 'center',
                    wordWrap: { width: this.cameras.main.width - 200 },
                    backgroundColor: COLORS.UI_BG,
                    padding: { x: 30, y: 20 }
                }
            );
            message.setOrigin(0.5);
            
            // Progress summary
            const progress = progressTracker.getProgressPercentage();
            const tokens = progressTracker.getTokenCount();
            const summary = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 250,
                `Final Score: ${tokens} Cultural Knowledge Tokens\nProgress: ${progress}% Complete`,
                {
                    fontSize: '20px',
                    fill: COLORS.SECONDARY,
                    fontFamily: 'Arial',
                    align: 'center'
                }
            );
            summary.setOrigin(0.5);
            
            // Menu button
            const menuButton = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 320,
                'Return to Menu',
                {
                    fontSize: '24px',
                    fill: COLORS.PRIMARY,
                    fontFamily: 'Arial',
                    backgroundColor: COLORS.BUTTON,
                    padding: { x: 20, y: 10 }
                }
            );
            menuButton.setOrigin(0.5);
            menuButton.setInteractive({ useHandCursor: true });
            menuButton.on('pointerdown', () => {
                this.scene.start(SCENES.MENU);
            });
            
            // Add sparkle effects
            for (let i = 0; i < 20; i++) {
                const sparkle = this.add.circle(
                    Phaser.Math.Between(0, this.cameras.main.width),
                    Phaser.Math.Between(0, this.cameras.main.height),
                    5,
                    0xffd700
                );
                sparkle.setAlpha(0);
                
                this.tweens.add({
                    targets: sparkle,
                    alpha: { from: 0, to: 1 },
                    scale: { from: 0.5, to: 1.5 },
                    duration: 1000,
                    repeat: -1,
                    yoyo: true
                });
            }
        });
    }
}

