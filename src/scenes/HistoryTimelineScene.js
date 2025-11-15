import Phaser from 'phaser';
import { SCENES, COLORS, ARTIFACTS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { getEventsSorted } from '../data/historyEvents.js';
import { gameContent } from '../data/gameContent.js';

export default class HistoryTimelineScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.HISTORY_TIMELINE });
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
        this.add.text(width / 2, 30, gameContent.challenges.history.title, {
            fontSize: '36px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(width / 2, 70, gameContent.challenges.history.instruction, {
            fontSize: '18px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Get events
        const events = getEventsSorted();
        this.events = events;
        this.placedEvents = [];
        this.eventCards = [];
        
        // Create timeline
        const timelineY = height - 150;
        const timelineStartX = 100;
        const timelineEndX = width - 100;
        const timelineLength = timelineEndX - timelineStartX;
        
        // Timeline line
        this.timeline = this.add.line(
            timelineStartX,
            timelineY,
            0, 0,
            timelineLength, 0,
            0xffffff,
            1
        );
        this.timeline.setLineWidth(4);
        
        // Timeline markers (years)
        const years = ['Pre-1000', '1852', '1850-1950', '1970s-1980s', '1989', '2000s-Present'];
        years.forEach((year, index) => {
            const x = timelineStartX + (index / (years.length - 1)) * timelineLength;
            const marker = this.add.circle(x, timelineY, 8, COLORS.PRIMARY);
            const yearText = this.add.text(x, timelineY + 25, year, {
                fontSize: '14px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial'
            });
            yearText.setOrigin(0.5);
        });
        
        // Create event cards (draggable)
        const cardStartY = 150;
        const cardSpacing = 100;
        
        events.forEach((event, index) => {
            const card = this.add.rectangle(
                150 + (index % 3) * 350,
                cardStartY + Math.floor(index / 3) * cardSpacing,
                300,
                80,
                COLORS.BUTTON
            );
            card.setStrokeStyle(2, COLORS.PRIMARY);
            card.setInteractive({ draggable: true });
            
            const titleText = this.add.text(
                card.x,
                card.y - 15,
                event.title,
                {
                    fontSize: '16px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial',
                    wordWrap: { width: 280 },
                    align: 'center'
                }
            );
            titleText.setOrigin(0.5);
            
            const yearText = this.add.text(
                card.x,
                card.y + 15,
                event.year,
                {
                    fontSize: '14px',
                    fill: COLORS.SECONDARY,
                    fontFamily: 'Arial'
                }
            );
            yearText.setOrigin(0.5);
            
            card.eventData = event;
            card.titleText = titleText;
            card.yearText = yearText;
            card.placed = false;
            card.originalX = card.x;
            card.originalY = card.y;
            
            this.input.setDraggable(card);
            this.eventCards.push(card);
        });
        
        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.placed) {
                // Remove from timeline
                const index = this.placedEvents.findIndex(e => e.card === gameObject);
                if (index !== -1) {
                    this.placedEvents.splice(index, 1);
                }
                gameObject.placed = false;
            }
            gameObject.setTint(0xcccccc);
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.titleText.x = dragX;
            gameObject.titleText.y = dragY - 15;
            gameObject.yearText.x = dragX;
            gameObject.yearText.y = dragY + 15;
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
            
            // Check if dropped near timeline
            const distToTimeline = Math.abs(gameObject.y - timelineY);
            
            if (distToTimeline < 60 && gameObject.x >= timelineStartX && gameObject.x <= timelineEndX) {
                // Place on timeline
                gameObject.y = timelineY;
                gameObject.titleText.y = timelineY - 15;
                gameObject.yearText.y = timelineY + 15;
                gameObject.setFillStyle(COLORS.SECONDARY);
                gameObject.placed = true;
                
                // Calculate position on timeline
                const timelinePos = (gameObject.x - timelineStartX) / timelineLength;
                this.placedEvents.push({
                    card: gameObject,
                    event: gameObject.eventData,
                    position: timelinePos
                });
                
                // Check if all events placed
                if (this.placedEvents.length === events.length) {
                    this.checkTimeline();
                }
            } else {
                // Return to original position
                this.tweens.add({
                    targets: [gameObject, gameObject.titleText, gameObject.yearText],
                    x: gameObject.originalX,
                    y: gameObject.originalY,
                    duration: 300
                });
                gameObject.titleText.y = gameObject.originalY - 15;
                gameObject.yearText.y = gameObject.originalY + 15;
            }
        });
        
        // Check button
        const checkButton = this.add.rectangle(
            width / 2,
            height - 50,
            250,
            50,
            COLORS.SECONDARY
        );
        checkButton.setStrokeStyle(2, COLORS.PRIMARY);
        checkButton.setInteractive({ useHandCursor: true });
        
        const checkText = this.add.text(width / 2, height - 50, 'Check Timeline', {
            fontSize: '20px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial'
        });
        checkText.setOrigin(0.5);
        
        checkButton.on('pointerdown', () => {
            if (this.placedEvents.length === events.length) {
                this.checkTimeline();
            } else {
                const feedback = this.add.text(
                    width / 2,
                    height - 120,
                    'Place all events on the timeline first!',
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

    checkTimeline() {
        // Sort placed events by position
        this.placedEvents.sort((a, b) => a.position - b.position);
        
        // Check if order is correct
        let correct = true;
        for (let i = 0; i < this.placedEvents.length; i++) {
            if (this.placedEvents[i].event.position !== i) {
                correct = false;
                break;
            }
        }
        
        if (correct) {
            this.completeChallenge();
        } else {
            const feedback = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                'Not quite right. Try to place events in chronological order!',
                {
                    fontSize: '20px',
                    fill: COLORS.ACCENT,
                    fontFamily: 'Arial',
                    backgroundColor: '#000',
                    padding: { x: 15, y: 8 }
                }
            );
            feedback.setOrigin(0.5);
            feedback.setAlpha(0);
            
            this.tweens.add({
                targets: feedback,
                alpha: 1,
                duration: 300,
                yoyo: true,
                hold: 3000,
                onComplete: () => feedback.destroy()
            });
        }
    }

    completeChallenge() {
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        if (progressTracker.addArtifact(ARTIFACTS.HISTORY_SCROLL)) {
            tokenSystem.awardTokens(50, 'Artifact Collected!');
        }
        progressTracker.completeChallenge('historyTimeline');
        
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
            gameContent.challenges.history.success + '\n\nYou earned the History Scroll Artifact!',
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

