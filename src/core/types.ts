import * as PIXI from 'pixi.js';

export interface GameItem {
    id: string;
    sprite: PIXI.Sprite;
    slotName: string;
    collected: boolean;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    textureName: string;
}

export interface GameState {
    collectedCount: number;
    totalItems: number;
    isGameCompleted: boolean;
    currentSkin: string;
}

export interface SpineAttachment {
    name: string;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    width?: number;
    height?: number;
    color?: string;
}

export interface GameConfig {
    grid: {
        columns: number;
        rows: number;
        marginFromEdge: number;
        randomOffsetPercent: number;
    };
    camera: {
        speed: number;
        dampingFactor: number;
        inertiaThreshold: number;
    };
    animation: {
        fadeStep: number;
        victoryGrowStep: number;
        victoryPulseStep: number;
        victoryMaxScale: number;
        victoryMinScale: number;
    };
    items: {
        totalCount: number;
        targetSlots: string[];
        availableSkins: string[];
    };
    assets: {
        basePath: string;
        files: Array<{
            id: string;
            path: string;
            type: 'texture' | 'json' | 'atlas';
        }>;
    };
}

export interface AssetResources {
    background: PIXI.Texture;
    spineData: any;
    atlasTexture: PIXI.Texture;
    atlasData: any;
}