import * as PIXI from 'pixi.js';
import { GameItem, SpineAttachment } from '../../core/types';
import { AtlasParser } from '../../utils/AtlasParser';
import { GridPositionCalculator } from '../../utils/GridPositionCalculator';

export class ItemFactory {
    constructor(
        private atlasTexture: PIXI.Texture,
        private atlasData: any,
        private backgroundWidth: number,
        private backgroundHeight: number
    ) {}

    createItem(
        itemData: {
            slot: string;
            attachment: SpineAttachment;
            sourceSkin: string;
        },
        itemIndex: number,
        gridConfig: { columns: number; rows: number; marginFromEdge: number; randomOffsetPercent: number }
    ): GameItem | null {
        try {
            const texture = this.extractTexture(itemData.attachment);
            if (!texture) return null;

            const sprite = new PIXI.Sprite(texture);
            const position = this.calculatePosition(
                sprite.width,
                sprite.height,
                itemIndex,
                gridConfig
            );

            sprite.x = position.x;
            sprite.y = position.y;
            
            this.applyTransformations(sprite, itemData.attachment);
            sprite.anchor.set(0.5);

            const nameLabel = this.createNameLabel(itemData.slot);
            nameLabel.y = -sprite.height / 2 - 10;
            sprite.addChild(nameLabel);

            sprite.eventMode = 'static';
            sprite.cursor = 'pointer';

            return {
                id: `${itemData.slot}_${itemIndex}`,
                sprite,
                slotName: itemData.slot,
                collected: false,
                x: sprite.x,
                y: sprite.y,
                scaleX: sprite.scale.x,
                scaleY: sprite.scale.y,
                rotation: sprite.rotation,
                textureName: itemData.attachment.name
            };

        } catch (error) {
            console.warn(`Failed to create item ${itemData.slot}:`, error);
            return null;
        }
    }

    private extractTexture(attachment: SpineAttachment): PIXI.Texture | null {
        let textureName = attachment.name;
        if (textureName.includes('/')) {
            textureName = textureName.split('/').pop() || textureName;
        }

        let textureRect = this.atlasData[textureName];
        if (!textureRect) {
            const matchedName = Object.keys(this.atlasData).find(key => 
                key.includes(textureName) || textureName.includes(key)
            );
            if (!matchedName) return null;
            textureName = matchedName;
        }

        return AtlasParser.createTextureFromAtlas(
            this.atlasTexture,
            this.atlasData,
            textureName
        );
    }

    private calculatePosition(
        spriteWidth: number,
        spriteHeight: number,
        index: number,
        gridConfig: { columns: number; rows: number; marginFromEdge: number; randomOffsetPercent: number }
    ): { x: number; y: number } {
        const column = index % gridConfig.columns;
        const row = Math.floor(index / gridConfig.columns);

        const cellWidth = (this.backgroundWidth - 2 * gridConfig.marginFromEdge) / gridConfig.columns;
        const cellHeight = (this.backgroundHeight - 2 * gridConfig.marginFromEdge) / gridConfig.rows;

        const baseX = gridConfig.marginFromEdge + (column + 0.5) * cellWidth;
        const baseY = gridConfig.marginFromEdge + (row + 0.5) * cellHeight;

        const maxOffsetX = (cellWidth - spriteWidth) / 2;
        const maxOffsetY = (cellHeight - spriteHeight) / 2;

        const randomOffsetX = (Math.random() * 2 - 1) * maxOffsetX * gridConfig.randomOffsetPercent;
        const randomOffsetY = (Math.random() * 2 - 1) * maxOffsetY * gridConfig.randomOffsetPercent;

        const finalX = baseX + randomOffsetX;
        const finalY = baseY + randomOffsetY;

        return GridPositionCalculator.clampToBounds(
            finalX,
            finalY,
            spriteWidth,
            spriteHeight,
            this.backgroundWidth,
            this.backgroundHeight
        );
    }

    private applyTransformations(sprite: PIXI.Sprite, attachment: SpineAttachment): void {
        if (attachment.scaleX) sprite.scale.x = attachment.scaleX;
        if (attachment.scaleY) sprite.scale.y = attachment.scaleY;
        if (attachment.rotation) {
            sprite.rotation = (attachment.rotation * Math.PI) / 180;
        }
    }

    private createNameLabel(text: string): PIXI.Text {
        return new PIXI.Text({
            text,
            style: {
                fontSize: 10,
                fill: 0xffff00,
                stroke: { color: 0x000000, width: 2 }
            }
        });
    }
}