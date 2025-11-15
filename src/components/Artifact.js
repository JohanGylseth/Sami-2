// Artifact representation
export class Artifact {
    constructor(scene, x, y, type, name, description) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type;
        this.name = name;
        this.description = description;
        this.collected = false;
        this.sprite = null;
    }

    create() {
        // Create placeholder artifact sprite
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x8b4513, 1);
        graphics.fillCircle(0, 0, 30);
        graphics.fillStyle(0xffd700, 1);
        graphics.fillCircle(0, 0, 20);
        
        const texture = graphics.generateTexture('artifact_' + this.type);
        graphics.destroy();
        
        this.sprite = this.scene.add.image(this.x, this.y, 'artifact_' + this.type);
        this.sprite.setInteractive({ useHandCursor: true });
        
        // Add glow effect
        this.sprite.setTint(0xffffff);
        
        // Add hover effect
        this.sprite.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200
            });
        });
        
        this.sprite.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 1,
                scaleY: 1,
                duration: 200
            });
        });
        
        return this.sprite;
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            // Animation
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 500,
                onComplete: () => {
                    if (this.sprite) {
                        this.sprite.destroy();
                    }
                }
            });
            return true;
        }
        return false;
    }

    isCollected() {
        return this.collected;
    }
}

