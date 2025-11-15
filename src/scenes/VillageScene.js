import Phaser from 'phaser';
import { SCENES, COLORS } from '../config.js';
import { getProgressTracker } from '../components/ProgressTracker.js';
import { TokenSystem } from '../components/TokenSystem.js';
import { villageItems, getVillageItem } from '../data/villageItems.js';

export default class VillageScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.VILLAGE });
    }

    create() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        
        // Background - village scene
        this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb); // Sky
        this.add.rectangle(width / 2, height - 100, width, 300, 0x90ee90); // Ground
        
        // Title
        this.add.text(width / 2, 30, 'Your Sámi Village 🏘️', {
            fontSize: '42px',
            fill: COLORS.PRIMARY,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 5
        }).setOrigin(0.5);
        
        // Token system
        const tokenSystem = new TokenSystem(this);
        tokenSystem.createDisplay();
        
        // Display owned items
        this.ownedItems = progressTracker.getVillageItems();
        this.placedItems = [];
        
        // Create village area
        this.villageArea = this.add.rectangle(
            width / 2,
            height / 2 + 50,
            width - 200,
            height - 200,
            0xd4a574,
            0.3
        );
        this.villageArea.setStrokeStyle(3, 0x8b6914);
        
        // Place owned items
        this.ownedItems.forEach(itemId => {
            const itemData = getVillageItem(itemId);
            if (itemData) {
                this.placeItem(itemData, false);
            }
        });
        
        // Shop button
        const shopButton = this.add.rectangle(
            width - 150,
            100,
            200,
            60,
            COLORS.BUTTON
        );
        shopButton.setStrokeStyle(3, COLORS.PRIMARY);
        shopButton.setInteractive({ useHandCursor: true });
        
        const shopText = this.add.text(width - 150, 100, '🛒 Shop', {
            fontSize: '24px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial'
        });
        shopText.setOrigin(0.5);
        
        shopButton.on('pointerover', () => {
            shopButton.setFillStyle(COLORS.BUTTON_HOVER);
        });
        
        shopButton.on('pointerout', () => {
            shopButton.setFillStyle(COLORS.BUTTON);
        });
        
        shopButton.on('pointerdown', () => {
            this.showShop();
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
        
        // Instructions
        this.add.text(width / 2, height - 30, 'Click Shop to buy decorations for your village!', {
            fontSize: '16px',
            fill: COLORS.TEXT,
            fontFamily: 'Arial',
            fontStyle: 'italic'
        }).setOrigin(0.5);
    }

    placeItem(itemData, animate = true) {
        const sprite = this.add.text(
            itemData.position.x,
            itemData.position.y,
            itemData.icon,
            {
                fontSize: '48px',
                fontFamily: 'Arial'
            }
        );
        sprite.setOrigin(0.5);
        sprite.setInteractive({ useHandCursor: true });
        
        // Add label
        const label = this.add.text(
            itemData.position.x,
            itemData.position.y + 35,
            itemData.name,
            {
                fontSize: '14px',
                fill: COLORS.TEXT,
                fontFamily: 'Arial',
                backgroundColor: '#000',
                padding: { x: 5, y: 3 }
            }
        );
        label.setOrigin(0.5);
        
        sprite.itemData = itemData;
        sprite.label = label;
        
        if (animate) {
            sprite.setScale(0);
            this.tweens.add({
                targets: sprite,
                scale: 1,
                duration: 500,
                ease: 'Back.easeOut'
            });
        }
        
        this.placedItems.push(sprite);
        
        // Hover effect
        sprite.on('pointerover', () => {
            sprite.setScale(1.2);
            label.setStyle({ backgroundColor: COLORS.PRIMARY });
        });
        
        sprite.on('pointerout', () => {
            sprite.setScale(1);
            label.setStyle({ backgroundColor: '#000' });
        });
    }

    showShop() {
        const { width, height } = this.cameras.main;
        const progressTracker = getProgressTracker();
        const tokenSystem = new TokenSystem(this);
        
        // Overlay
        const overlay = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.8
        );
        overlay.setInteractive();
        
        // Shop panel
        const panel = this.add.rectangle(
            width / 2,
            height / 2,
            900,
            600,
            COLORS.UI_BG
        );
        panel.setStrokeStyle(4, COLORS.PRIMARY);
        
        // Title
        const title = this.add.text(
            width / 2,
            height / 2 - 250,
            '🛒 Village Shop',
            {
                fontSize: '36px',
                fill: COLORS.PRIMARY,
                fontFamily: 'Arial',
                stroke: '#000',
                strokeThickness: 4
            }
        );
        title.setOrigin(0.5);
        
        // Token display
        const tokens = progressTracker.getTokenCount();
        const tokenDisplay = this.add.text(
            width / 2,
            height / 2 - 200,
            `Your Tokens: ${tokens} 🌟`,
            {
                fontSize: '24px',
                fill: 0xf39c12,
                fontFamily: 'Arial'
            }
        );
        tokenDisplay.setOrigin(0.5);
        
        // Item list
        const itemStartY = height / 2 - 100;
        const itemSpacing = 70;
        let itemIndex = 0;
        
        villageItems.forEach((item, index) => {
            const y = itemStartY + itemIndex * itemSpacing;
            if (y > height / 2 + 200) return; // Skip if off screen
            
            const owned = progressTracker.hasVillageItem(item.id);
            
            // Item row
            const rowBg = this.add.rectangle(
                width / 2,
                y,
                800,
                60,
                owned ? 0x2ecc71 : COLORS.BUTTON,
                owned ? 0.3 : 0.5
            );
            rowBg.setStrokeStyle(2, owned ? COLORS.SECONDARY : COLORS.PRIMARY);
            rowBg.shopItem = true;
            
            // Icon
            const icon = this.add.text(
                width / 2 - 350,
                y,
                item.icon,
                {
                    fontSize: '32px',
                    fontFamily: 'Arial'
                }
            );
            icon.setOrigin(0.5);
            icon.shopItem = true;
            
            // Name and description
            const nameText = this.add.text(
                width / 2 - 200,
                y - 10,
                item.name,
                {
                    fontSize: '18px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial'
                }
            );
            nameText.setOrigin(0, 0.5);
            nameText.shopItem = true;
            
            const descText = this.add.text(
                width / 2 - 200,
                y + 15,
                item.description,
                {
                    fontSize: '14px',
                    fill: COLORS.TEXT,
                    fontFamily: 'Arial',
                    fontStyle: 'italic'
                }
            );
            descText.setOrigin(0, 0.5);
            descText.shopItem = true;
            
            // Price or owned
            if (owned) {
                const ownedText = this.add.text(
                    width / 2 + 300,
                    y,
                    '✓ Owned',
                    {
                        fontSize: '18px',
                        fill: COLORS.SECONDARY,
                        fontFamily: 'Arial'
                    }
                );
                ownedText.setOrigin(0.5);
                ownedText.shopItem = true;
            } else {
                const priceText = this.add.text(
                    width / 2 + 300,
                    y,
                    `${item.cost} 🌟`,
                    {
                        fontSize: '20px',
                        fill: 0xf39c12,
                        fontFamily: 'Arial'
                    }
                );
                priceText.setOrigin(0.5);
                priceText.shopItem = true;
                
                // Buy button
                const buyButton = this.add.rectangle(
                    width / 2 + 350,
                    y,
                    80,
                    40,
                    tokens >= item.cost ? COLORS.SECONDARY : 0x666666
                );
                buyButton.setStrokeStyle(2, COLORS.PRIMARY);
                buyButton.setInteractive({ useHandCursor: tokens >= item.cost });
                buyButton.itemData = item;
                buyButton.shopItem = true;
                
                const buyText = this.add.text(
                    width / 2 + 350,
                    y,
                    'Buy',
                    {
                        fontSize: '16px',
                        fill: COLORS.TEXT,
                        fontFamily: 'Arial'
                    }
                );
                buyText.setOrigin(0.5);
                buyText.shopItem = true;
                
                if (tokens >= item.cost) {
                    buyButton.on('pointerover', () => {
                        buyButton.setFillStyle(0x27ae60);
                    });
                    
                    buyButton.on('pointerout', () => {
                        buyButton.setFillStyle(COLORS.SECONDARY);
                    });
                    
                    buyButton.on('pointerdown', () => {
                        if (progressTracker.getTokenCount() >= item.cost) {
                            progressTracker.addTokens(-item.cost);
                            progressTracker.addVillageItem(item.id);
                            tokenSystem.updateDisplay();
                            tokenDisplay.setText(`Your Tokens: ${progressTracker.getTokenCount()} 🌟`);
                            
                            // Update UI
                            rowBg.setFillStyle(0x2ecc71, 0.3);
                            rowBg.setStrokeStyle(2, COLORS.SECONDARY);
                            priceText.destroy();
                            buyButton.destroy();
                            buyText.destroy();
                            
                            const ownedText = this.add.text(
                                width / 2 + 300,
                                y,
                                '✓ Owned',
                                {
                                    fontSize: '18px',
                                    fill: COLORS.SECONDARY,
                                    fontFamily: 'Arial'
                                }
                            );
                            ownedText.setOrigin(0.5);
                            
                            // Place item in village
                            this.placeItem(item, true);
                            
                            // Success message
                            const success = this.add.text(
                                width / 2,
                                height / 2 + 250,
                                `You bought ${item.name}! 🎉`,
                                {
                                    fontSize: '20px',
                                    fill: COLORS.SECONDARY,
                                    fontFamily: 'Arial'
                                }
                            );
                            success.setOrigin(0.5);
                            success.setAlpha(0);
                            
                            this.tweens.add({
                                targets: success,
                                alpha: 1,
                                duration: 300,
                                yoyo: true,
                                hold: 2000,
                                onComplete: () => success.destroy()
                            });
                        }
                    });
                }
            }
            
            itemIndex++;
        });
        
        // Close button
        const closeButton = this.add.text(
            width / 2,
            height / 2 + 280,
            'Close Shop',
            {
                fontSize: '24px',
                fill: COLORS.PRIMARY,
                fontFamily: 'Arial',
                backgroundColor: COLORS.BUTTON,
                padding: { x: 20, y: 10 }
            }
        );
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        const shopElements = [overlay, panel, title, tokenDisplay, closeButton];
        
        closeButton.on('pointerdown', () => {
            // Destroy all shop elements
            shopElements.forEach(el => {
                if (el && el.active) el.destroy();
            });
            
            // Destroy shop items (rows, buttons, texts)
            this.children.list.forEach(child => {
                if (child && child.active && (child.itemData || child.shopItem)) {
                    child.destroy();
                }
            });
        });
    }
}

