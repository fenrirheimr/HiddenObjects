import * as PIXI from 'pixi.js';
import { FadeAnimation } from './FadeAnimation';
import { GAME_CONFIG } from '../config/GameConfig';

export class AnimationManager {
    private fadeAnimations: Map<PIXI.Sprite, FadeAnimation> = new Map();
    private ticker: PIXI.Ticker;

    constructor(ticker: PIXI.Ticker) {
        this.ticker = ticker;
    }

    fadeOut(sprite: PIXI.Sprite, onComplete?: () => void): void {
        if (!this.ticker) {
            console.error('Ticker is not available');
            if (onComplete) onComplete();
            return;
        }

        // Останавливаем предыдущую анимацию если есть
        if (this.fadeAnimations.has(sprite)) {
            const existing = this.fadeAnimations.get(sprite);
            if (existing) {
                existing.stop(this.ticker);
            }
        }

        const animation = new FadeAnimation(
            sprite,
            GAME_CONFIG.animation.fadeStep,
            () => {
                this.fadeAnimations.delete(sprite);
                if (onComplete) onComplete();
            }
        );

        this.fadeAnimations.set(sprite, animation);
        animation.start(this.ticker);
    }

    pulse(
        text: PIXI.Text,
        minScale: number = GAME_CONFIG.animation.victoryMinScale,
        maxScale: number = GAME_CONFIG.animation.victoryMaxScale,
        step: number = GAME_CONFIG.animation.victoryPulseStep
    ): () => void {
        if (!this.ticker) return () => {};

        let direction = 1;

        const animate = (): void => {
            if (!text || !text.scale) return;
            
            const currentScale = text.scale.x;
            if (currentScale >= maxScale) direction = -1;
            if (currentScale <= minScale) direction = 1;
            text.scale.set(currentScale + direction * step);
        };

        this.ticker.add(animate);
        
        // Возвращаем функцию для остановки анимации
        return () => {
            this.ticker.remove(animate);
        };
    }

    grow(
        text: PIXI.Text,
        targetScale: number = 1,
        step: number = GAME_CONFIG.animation.victoryGrowStep,
        onComplete?: () => void
    ): void {
        if (!this.ticker) return;

        let progress = 0;

        const animate = (): void => {
            progress += step;
            
            if (progress < 1) {
                text.scale.set(progress * targetScale * 1.2);
                text.alpha = progress;
            } else {
                text.scale.set(targetScale);
                text.alpha = 1;
                this.ticker.remove(animate);
                if (onComplete) onComplete();
            }
        };

        this.ticker.add(animate);
    }

    stopAllFades(): void {
        this.fadeAnimations.forEach((animation, _sprite) => {
            animation.stop(this.ticker);
        });
        this.fadeAnimations.clear();
    }

    dispose(): void {
        this.stopAllFades();
    }
}