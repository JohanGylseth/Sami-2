// Character representation for NPCs
export class Character {
    constructor(scene, x, y, characterData) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.data = characterData;
        this.sprite = null;
        this.dialogActive = false;
    }

    create() {
        // Create placeholder character sprite
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(this.data.color || 0x3498db, 1);
        graphics.fillCircle(0, 0, 40);
        graphics.fillStyle(0xffdbac, 1); // Skin color
        graphics.fillCircle(0, -10, 15);
        
        const texture = graphics.generateTexture('character_' + this.data.id);
        graphics.destroy();
        
        this.sprite = this.scene.add.image(this.x, this.y, 'character_' + this.data.id);
        this.sprite.setInteractive({ useHandCursor: true });
        
        // Add name label
        this.nameLabel = this.scene.add.text(this.x, this.y - 60, this.data.name, {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        this.nameLabel.setOrigin(0.5);
        this.nameLabel.setAlpha(0);
        
        // Hover effects
        this.sprite.on('pointerover', () => {
            this.nameLabel.setAlpha(1);
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200
            });
        });
        
        this.sprite.on('pointerout', () => {
            this.nameLabel.setAlpha(0);
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 1,
                scaleY: 1,
                duration: 200
            });
        });
        
        this.sprite.on('pointerdown', () => {
            this.showDialog();
        });
        
        return this.sprite;
    }

    showDialog() {
        if (this.dialogActive) return;
        
        this.dialogActive = true;
        const dialogBox = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            600,
            300,
            0x000000,
            0.9
        );
        dialogBox.setStrokeStyle(4, 0xffffff);
        
        const dialogText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 50,
            this.data.dialog || this.data.greeting || 'Hello!',
            {
                fontSize: '20px',
                fill: '#fff',
                fontFamily: 'Arial',
                wordWrap: { width: 550 },
                align: 'center'
            }
        );
        dialogText.setOrigin(0.5);
        
        const closeButton = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 100,
            'Close',
            {
                fontSize: '24px',
                fill: '#3498db',
                fontFamily: 'Arial',
                backgroundColor: '#fff',
                padding: { x: 20, y: 10 }
            }
        );
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        closeButton.on('pointerdown', () => {
            dialogBox.destroy();
            dialogText.destroy();
            closeButton.destroy();
            this.dialogActive = false;
        });
    }

    getDialog() {
        return this.data.dialog || this.data.greeting || 'Hello!';
    }
}

