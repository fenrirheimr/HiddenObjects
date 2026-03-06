import * as PIXI from 'pixi.js';
import { GameItem } from '../../core/types';

export class ItemPool {
    private availableItems: GameItem[] = [];
    private activeItems: GameItem[] = [];
    private container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    addItem(item: GameItem): void {
        this.activeItems.push(item);
        this.container.addChild(item.sprite);
    }

    removeItem(itemId: string): GameItem | null {
        const index = this.activeItems.findIndex(i => i.id === itemId);
        if (index === -1) return null;

        const [item] = this.activeItems.splice(index, 1);
        this.container.removeChild(item.sprite);
        
        // Очищаем спрайт для повторного использования
        item.sprite.removeAllListeners();
        item.sprite.visible = false;
        
        this.availableItems.push(item);
        return item;
    }

    getActiveItems(): GameItem[] {
        return [...this.activeItems];
    }

    getActiveCount(): number {
        return this.activeItems.length;
    }

    clear(): void {
        this.activeItems.forEach(item => {
            this.container.removeChild(item.sprite);
            item.sprite.destroy();
        });
        
        this.availableItems.forEach(item => {
            item.sprite.destroy();
        });
        
        this.activeItems = [];
        this.availableItems = [];
    }
}