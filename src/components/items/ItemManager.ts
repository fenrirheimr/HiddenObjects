import * as PIXI from 'pixi.js';
import { GameItem, GameState } from '../../core/types';
import { ItemPool } from './ItemPool';
import { ItemFactory } from './ItemFactory';
import { GAME_CONFIG } from '../../config/GameConfig';
import { AnimationManager } from '../../animation/AnimationManager';

export class ItemManager {
    private itemPool: ItemPool;
    private itemFactory: ItemFactory;
    private animationManager: AnimationManager;
    private gameState: GameState;
    private onItemCollected: (item: GameItem) => void;

    constructor(
        container: PIXI.Container,
        atlasTexture: PIXI.Texture,
        atlasData: any,
        backgroundWidth: number,
        backgroundHeight: number,
        animationManager: AnimationManager,
        gameState: GameState,
        onItemCollected: (item: GameItem) => void
    ) {
        this.itemPool = new ItemPool(container);
        this.itemFactory = new ItemFactory(
            atlasTexture,
            atlasData,
            backgroundWidth,
            backgroundHeight
        );
        this.animationManager = animationManager;
        this.gameState = gameState;
        this.onItemCollected = onItemCollected;
    }

    spawnItems(spineData: any): void {
        const itemPool = this.collectItemsFromAllSkins(spineData);
        const selectedItems = this.selectRandomItems(itemPool, GAME_CONFIG.items.totalCount);

        selectedItems.forEach((item, index) => {
            const gameItem = this.itemFactory.createItem(
                item,
                index,
                GAME_CONFIG.grid
            );

            if (gameItem) {
                gameItem.sprite.on('pointertap', () => this.handleItemClick(gameItem));
                this.itemPool.addItem(gameItem);
            }
        });
    }

    private collectItemsFromAllSkins(spineData: any): any[] {
        const itemPool: any[] = [];

        spineData.skins.forEach((skin: any) => {
            GAME_CONFIG.items.targetSlots.forEach(slotName => {
                if (skin.attachments[slotName]) {
                    const attachmentName = Object.keys(skin.attachments[slotName])[0];
                    itemPool.push({
                        slot: slotName,
                        attachment: skin.attachments[slotName][attachmentName],
                        sourceSkin: skin.name
                    });
                }
            });
        });

        return this.shuffleArray(itemPool);
    }

    private selectRandomItems(itemPool: any[], count: number): any[] {
        const shuffled = this.shuffleArray([...itemPool]);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private handleItemClick(item: GameItem): void {
        if (item.collected || this.gameState.isGameCompleted) return;

        item.collected = true;
        item.sprite.eventMode = 'none';
        item.sprite.cursor = 'default';
        
        // Сохраняем ссылку на sprite до того, как он будет удален
        const sprite = item.sprite;
        
        this.animationManager.fadeOut(sprite, () => {
            this.itemPool.removeItem(item.id);
            this.onItemCollected(item);
        });
    }

    getActiveItems(): GameItem[] {
        return this.itemPool.getActiveItems();
    }

    getActiveCount(): number {
        return this.itemPool.getActiveCount();
    }

    dispose(): void {
        this.itemPool.clear();
    }
}