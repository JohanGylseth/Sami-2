import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { gameContent } from '../data/gameContent.js';

export default class ReindeerHerdingScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.REINDEER_HERDING });
    }

    init(data) {
        this.challengeData = data.challengeData || {};
    }

    create() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        
        // Background - winter landscape
        this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb); // Sky
        this.add.rectangle(width / 2, height - 50, width, 200, 0xffffff); // Snow ground
        
        // Title
        this.add.text(width / 2, 30, gameContent.challenges.reindeerHerding.title, {
            fontSize: '32px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(width / 2, 70, gameContent.challenges.reindeerHerding.instruction, {
            fontSize: '16px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Game variables
        this.herd = [];
        this.hazards = [];
        this.targetArea = null;
        this.score = 0;
        this.herdSize = 5;
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create target grazing area
        this.targetArea = this.add.ellipse(
            width - 200,
            height - 150,
            150,
            100,
            0x90ee90,
            0.5
        );
        this.targetArea.setStrokeStyle(3, 0x228b22);
        this.add.text(width - 200, height - 150, 'Safe\nGrazing\nArea', {
            fontSize: '16px',
            fill: '#000',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
        
        // Create reindeer herd with better graphics
        const startX = 200;
        const startY = height / 2;
        
        for (let i = 0; i < this.herdSize; i++) {
            // Create more realistic reindeer shape
            const reindeer = this.add.container(
                startX + i * 30,
                startY + (Math.random() - 0.5) * 40
            );
            
            // Body (ellipse)
            const body = this.add.ellipse(0, 0, 30, 20, 0x8b4513);
            body.setStrokeStyle(2, 0x654321);
            
            // Head
            const head = this.add.circle(-15, -5, 10, 0x8b4513);
            head.setStrokeStyle(2, 0x654321);
            
            // Antlers (simple)
            const antler1 = this.add.line(0, -15, -5, -10, -8, -18, 0x654321, 1);
            antler1.setLineWidth(2);
            const antler2 = this.add.line(0, -15, 5, -10, 8, -18, 0x654321, 1);
            antler2.setLineWidth(2);
            
            reindeer.add([body, head, antler1, antler2]);
            reindeer.safe = false;
            reindeer.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains);
            this.herd.push(reindeer);
        }
        
        // Create hazards
        this.createHazards();
        
        // Score display
        this.scoreText = this.add.text(width - 150, 100, 'Score: 0', {
            fontSize: '20px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        // Timer
        this.timeRemaining = 60; // 60 seconds
        this.timerText = this.add.text(width - 150, 140, `Time: ${this.timeRemaining}`, {
            fontSize: '20px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        // Timer countdown
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeRemaining--;
                this.timerText.setText(`Time: ${this.timeRemaining}`);
                if (this.timeRemaining <= 0) {
                    this.endGame(false);
                }
            },
            repeat: this.timeRemaining - 1
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

    createHazards() {
        const { width, height } = this.cameras.main;
        
        // Create predator (wolf) with better graphics
        const wolfX = Phaser.Math.Between(400, 800);
        const wolfY = Phaser.Math.Between(200, 500);
        const wolf = this.add.container(wolfX, wolfY);
        
        // Wolf body
        const wolfBody = this.add.ellipse(0, 0, 40, 25, 0x696969);
        wolfBody.setStrokeStyle(2, 0x000000);
        
        // Wolf head
        const wolfHead = this.add.circle(-15, -5, 12, 0x696969);
        wolfHead.setStrokeStyle(2, 0x000000);
        
        // Eyes (scary!)
        const eye1 = this.add.circle(-18, -7, 2, 0xff0000);
        const eye2 = this.add.circle(-12, -7, 2, 0xff0000);
        
        wolf.add([wolfBody, wolfHead, eye1, eye2]);
        wolf.speed = 50;
        wolf.direction = Phaser.Math.Between(0, 360);
        this.hazards.push({ type: 'predator', sprite: wolf });
        
        // Create weather hazard (storm area)
        const storm = this.add.circle(
            Phaser.Math.Between(300, 700),
            Phaser.Math.Between(150, 550),
            80,
            0x708090,
            0.4
        );
        storm.setStrokeStyle(2, 0x2f4f4f);
        this.hazards.push({ type: 'weather', sprite: storm });
        
        // Animate hazards
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.moveHazards();
            },
            repeat: -1
        });
    }

    moveHazards() {
        this.hazards.forEach(hazard => {
            if (hazard.type === 'predator') {
                // Move predator towards nearest reindeer
                let nearestReindeer = null;
                let nearestDist = Infinity;
                
                this.herd.forEach(reindeer => {
                    if (!reindeer.safe) {
                        const dist = Phaser.Math.Distance.Between(
                            hazard.sprite.x,
                            hazard.sprite.y,
                            reindeer.x,
                            reindeer.y
                        );
                        if (dist < nearestDist) {
                            nearestDist = dist;
                            nearestReindeer = reindeer;
                        }
                    }
                });
                
                if (nearestReindeer) {
                    // Move towards nearest reindeer
                    const dx = nearestReindeer.x - hazard.sprite.x;
                    const dy = nearestReindeer.y - hazard.sprite.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        const speed = 1.5;
                        hazard.sprite.x += (dx / distance) * speed;
                        hazard.sprite.y += (dy / distance) * speed;
                    }
                } else {
                    // No reindeer to chase, move randomly
                    const angle = Phaser.Math.Between(0, 360);
                    const distance = 20;
                    hazard.sprite.x += Math.cos(Phaser.Math.DegToRad(angle)) * distance;
                    hazard.sprite.y += Math.sin(Phaser.Math.DegToRad(angle)) * distance;
                }
                
                // Keep in bounds
                hazard.sprite.x = Phaser.Math.Clamp(hazard.sprite.x, 100, this.cameras.main.width - 100);
                hazard.sprite.y = Phaser.Math.Clamp(hazard.sprite.y, 100, this.cameras.main.height - 100);
            }
        });
    }

    update() {
        // Move herd based on arrow keys
        let moveX = 0;
        let moveY = 0;
        
        if (this.cursors.left.isDown) {
            moveX = -2;
        } else if (this.cursors.right.isDown) {
            moveX = 2;
        }
        
        if (this.cursors.up.isDown) {
            moveY = -2;
        } else if (this.cursors.down.isDown) {
            moveY = 2;
        }
        
        // Move herd (follow leader behavior)
        this.herd.forEach((reindeer, index) => {
            // Only move if not safe
            if (!reindeer.safe) {
                // Leader follows input, others follow previous
                if (index === 0) {
                    reindeer.x += moveX;
                    reindeer.y += moveY;
                } else {
                    // Find the closest non-safe reindeer ahead to follow
                    let leader = null;
                    for (let i = index - 1; i >= 0; i--) {
                        if (!this.herd[i].safe) {
                            leader = this.herd[i];
                            break;
                        }
                    }
                    // If no leader ahead, follow the first one (even if safe)
                    if (!leader) {
                        leader = this.herd[0];
                    }
                    
                    const dx = leader.x - reindeer.x;
                    const dy = leader.y - reindeer.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 40) {
                        reindeer.x += (dx / distance) * 1.5;
                        reindeer.y += (dy / distance) * 1.5;
                    }
                }
                
                // Keep in bounds
                reindeer.x = Phaser.Math.Clamp(reindeer.x, 20, this.cameras.main.width - 20);
                reindeer.y = Phaser.Math.Clamp(reindeer.y, 100, this.cameras.main.height - 20);
                
                // Check if reached target area
                const distToTarget = Phaser.Math.Distance.Between(
                    reindeer.x,
                    reindeer.y,
                    this.targetArea.x,
                    this.targetArea.y
                );
                
                if (distToTarget < 75) {
                    if (!reindeer.safe) {
                        reindeer.safe = true;
                        // Change color of body to green
                        reindeer.list[0].setFillStyle(0x90ee90);
                        this.score += 20;
                        this.scoreText.setText(`Score: ${this.score}`);
                        
                        // Funny feedback
                        const messages = ['Safe! 🦌', 'One down!', 'Good job!', 'Keep going!'];
                        const msg = messages[Math.floor(Math.random() * messages.length)];
                        const feedback = this.add.text(reindeer.x, reindeer.y - 30, msg, {
                            fontSize: '16px',
                            fill: COLORS.SECONDARY,
                            fontFamily: 'Arial'
                        });
                        this.tweens.add({
                            targets: feedback,
                            alpha: 0,
                            y: feedback.y - 20,
                            duration: 1000,
                            onComplete: () => feedback.destroy()
                        });
                    }
                }
                
                // Check collision with hazards
                this.hazards.forEach(hazard => {
                    const dist = Phaser.Math.Distance.Between(
                        reindeer.x,
                        reindeer.y,
                        hazard.sprite.x,
                        hazard.sprite.y
                    );
                    
                    if (hazard.type === 'predator' && dist < 35) {
                        // Wolf caught reindeer - stop it and lose points
                        reindeer.safe = false;
                        // Change color of body to red
                        reindeer.list[0].setFillStyle(0xe74c3c);
                        this.score = Math.max(0, this.score - 15);
                        this.scoreText.setText(`Score: ${this.score}`);
                        
                        // Show warning
                        const warning = this.add.text(reindeer.x, reindeer.y - 30, 'Oh no! 🐺', {
                            fontSize: '18px',
                            fill: COLORS.ACCENT,
                            fontFamily: 'Arial',
                            stroke: '#000',
                            strokeThickness: 3
                        });
                        this.tweens.add({
                            targets: warning,
                            alpha: 0,
                            duration: 1500,
                            onComplete: () => warning.destroy()
                        });
                        
                        // Reset reindeer after a moment
                        this.time.delayedCall(1000, () => {
                            if (reindeer && !reindeer.safe) {
                                reindeer.list[0].setFillStyle(0x8b4513);
                            }
                        });
                    } else if (hazard.type === 'weather' && dist < 80) {
                        // Weather slows down reindeer
                        reindeer.x -= moveX * 0.5;
                        reindeer.y -= moveY * 0.5;
                    }
                });
            }
        });
        
        // Check win condition
        const allSafe = this.herd.every(r => r.safe);
        if (allSafe) {
            this.endGame(true);
        }
    }

    endGame(success) {
        this.scene.pause();
        
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        const message = success 
            ? gameContent.challenges.reindeerHerding.success
            : gameContent.challenges.reindeerHerding.failure;
        
        if (success) {
            if (progressTracker.addArtifact(ARTIFACTS.REINDEER_AMULET)) {
                tokenSystem.awardTokens(50, 'Artifact Collected!');
            }
            progressTracker.completeChallenge('reindeerHerding');
        }
        
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
            message + (success ? '\n\nYou earned the Reindeer Amulet!' : ''),
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
            this.scene.resume();
            this.scene.start(SCENES.WORLD_MAP);
        });
    }
}

