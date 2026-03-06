import * as PIXI from 'pixi.js';

export class FadeAnimation {
    private initialScale: number;
    private progress = 1;
    private isActive = false;

    constructor(
        private sprite: PIXI.Sprite,
        private step: number,
        private onComplete: () => void
    ) {
        this.initialScale = sprite.scale.x;
    }

    private animate = (): void => {
        if (!this.isActive) return;
        
        this.progress -= this.step;

        if (this.progress <= 0) {
            this.sprite.visible = false;
            this.isActive = false;
            this.onComplete();
            return;
        }

        this.sprite.scale.set(this.initialScale * this.progress);
        this.sprite.alpha = this.progress;
    };

    start(ticker: PIXI.Ticker): void {
        if (!ticker) {
            console.error('Ticker is undefined');
            return;
        }
        
        this.isActive = true;
        // В PixiJS v8 ticker.add принимает функцию
        ticker.add(this.animate);
    }

    stop(ticker: PIXI.Ticker): void {
        this.isActive = false;
        if (ticker) {
            ticker.remove(this.animate);
        }
    }
}