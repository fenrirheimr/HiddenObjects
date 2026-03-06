import * as PIXI from 'pixi.js';

export interface DebugData {
    currentSkin: string;
    collectedCount: number;
    totalItems: number;
    cameraX: number;
    cameraY: number;
}

export class DebugInfo {
    private text: PIXI.Text;

    constructor(private uiContainer: PIXI.Container) {
        this.text = this.create();
    }

    private create(): PIXI.Text {
        const text = new PIXI.Text({
            text: '',
            style: {
                fontSize: 12,
                fill: 0x00ff00,
                stroke: { color: 0x000000, width: 2 }
            }
        });
        text.x = 10;
        text.y = 30;
        this.uiContainer.addChild(text);
        return text;
    }

    update(data: DebugData): void {
        this.text.text = 
            `Skin: ${data.currentSkin.split('/').pop()}\n` +
            `Found: ${data.collectedCount}/${data.totalItems}\n` +
            `Camera: (${Math.round(data.cameraX)},${Math.round(data.cameraY)})`;
    }

    setVisible(visible: boolean): void {
        this.text.visible = visible;
    }
}