import * as PIXI from 'pixi.js';
import { AnimationManager } from '../../animation/AnimationManager';

export class VictoryMessage {
    private message: PIXI.Text;
    private stopPulse: (() => void) | null = null;

    constructor(
        private uiContainer: PIXI.Container,
        private animationManager: AnimationManager
    ) {
        this.message = this.create();
    }

    private create(): PIXI.Text {
        const text = new PIXI.Text({
            text: '🎉 VICTORY! 🎉',
            style: {
                fontSize: 42,
                fill: 0xffaa00,
                align: 'center',
                stroke: { color: 0x000000, width: 6 }
            }
        });

        text.anchor.set(0.5);
        text.visible = false;
        this.uiContainer.addChild(text);
        
        return text;
    }

    show(screenWidth: number, screenHeight: number): void {
        this.message.x = screenWidth / 2;
        this.message.y = screenHeight / 2;
        this.message.visible = true;
        this.message.scale.set(0);
        this.message.alpha = 0;

        this.animationManager.grow(this.message, 1, undefined, () => {
            // Останавливаем предыдущую пульсацию если есть
            if (this.stopPulse) {
                this.stopPulse();
            }
            this.stopPulse = this.animationManager.pulse(this.message);
        });
    }

    updatePosition(screenWidth: number, screenHeight: number): void {
        this.message.x = screenWidth / 2;
        this.message.y = screenHeight / 2;
    }

    hide(): void {
        if (this.stopPulse) {
            this.stopPulse();
            this.stopPulse = null;
        }
        this.message.visible = false;
    }
}