// Cultural Knowledge Tokens system
import { getProgressTracker } from './ProgressTracker.js';

export class TokenSystem {
    constructor(scene) {
        this.scene = scene;
        this.progressTracker = getProgressTracker();
        this.tokenDisplay = null;
    }

    createDisplay(x = 50, y = 50) {
        // Create token display in top-left corner
        const style = {
            fontSize: '24px',
            fill: '#f39c12',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 3
        };

        this.tokenDisplay = this.scene.add.text(x, y, '', style);
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.tokenDisplay) {
            const tokens = this.progressTracker.getTokenCount();
            this.tokenDisplay.setText(`🌟 ${tokens} Tokens`);
        }
    }

    awardTokens(amount, reason = '') {
        this.progressTracker.addTokens(amount);
        this.updateDisplay();
        
        // Show notification
        if (this.scene) {
            this.showTokenNotification(amount, reason);
        }
    }

    showTokenNotification(amount, reason) {
        const notification = this.scene.add.text(
            this.scene.cameras.main.centerX,
            150,
            `+${amount} Tokens${reason ? ': ' + reason : ''}`,
            {
                fontSize: '32px',
                fill: '#f39c12',
                fontFamily: 'Arial',
                stroke: '#000',
                strokeThickness: 4
            }
        );
        notification.setOrigin(0.5);
        notification.setAlpha(0);

        // Animate in and out
        this.scene.tweens.add({
            targets: notification,
            alpha: 1,
            y: notification.y - 20,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: notification,
                    alpha: 0,
                    y: notification.y - 40,
                    duration: 500,
                    delay: 1500,
                    ease: 'Power2',
                    onComplete: () => notification.destroy()
                });
            }
        });
    }
}

