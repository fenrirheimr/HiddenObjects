import { GameConfig } from '../core/types';

export const GAME_CONFIG: GameConfig = {
    grid: {
        columns: 3,
        rows: 2,
        marginFromEdge: 100,
        randomOffsetPercent: 0.7
    },
    camera: {
        speed: 10,
        dampingFactor: 0.95,
        inertiaThreshold: 0.1
    },
    animation: {
        fadeStep: 0.05,
        victoryGrowStep: 0.02,
        victoryPulseStep: 0.005,
        victoryMaxScale: 1.1,
        victoryMinScale: 0.9
    },
    items: {
        totalCount: 6,
        targetSlots: [
            'hogItem1', 'hogItem2', 'hogItem3', 'hogItem4', 'hogItem5',
            'hogItem6', 'hogItem7', 'hogItem8', 'hogItem9', 'hogItem10'
        ],
        availableSkins: [
            'mode1/skin_mode1_v1',
            'mode1/skin_mode1_v2',
            'mode1/skin_mode1_v3',
            'mode1/skin_mode1_v4',
            'mode1/skin_mode1_v5'
        ]
    },
    assets: {
        basePath: '/assets/level0',
        files: [
            { id: 'background', path: 'back_lv0.webp', type: 'texture' },
            { id: 'spineData', path: 'level0.json', type: 'json' },
            { id: 'atlasTexture', path: 'level0.webp', type: 'texture' },
            { id: 'atlasData', path: 'level0.atlas', type: 'atlas' }
        ]
    }
};