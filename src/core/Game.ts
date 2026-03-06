import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { CameraController } from '../components/camera/CameraController';
import { ItemManager } from '../components/items/ItemManager';
import { UIManager } from '../components/ui/UIManager';
import { AnimationManager } from '../animation/AnimationManager';
import { ErrorHandler } from '../utils/ErrorHandler';
import { GAME_CONFIG } from '../config/GameConfig';
import { GameState } from './types';

export class Game {
    private application: PIXI.Application;
    private worldContainer: PIXI.Container;
    private uiContainer: PIXI.Container;
    
    private assetLoader: AssetLoader;
    private cameraController!: CameraController;
    private itemManager!: ItemManager;
    private uiManager!: UIManager;
    private animationManager!: AnimationManager;
    
    private gameState: GameState;
    private pressedKeys: Record<string, boolean> = {};

    constructor(private container: HTMLElement) {
        this.application = new PIXI.Application();
        this.worldContainer = new PIXI.Container();
        this.uiContainer = new PIXI.Container();
        this.assetLoader = new AssetLoader();
        
        this.gameState = {
            collectedCount: 0,
            totalItems: GAME_CONFIG.items.totalCount,
            isGameCompleted: false,
            currentSkin: ''
        };

        this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            await this.application.init({
                resizeTo: this.container,
                backgroundColor: 0x000000,
                antialias: true,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true
            });

            this.container.appendChild(this.application.canvas);
            this.application.stage.addChild(this.worldContainer);
            this.application.stage.addChild(this.uiContainer);

            this.animationManager = new AnimationManager(this.application.ticker);

            await this.loadAssets();
            this.setupGame();
            this.attachEventListeners();
            
            this.application.ticker.add(this.gameLoop.bind(this));

        } catch (error) {
            ErrorHandler.handle(error, 'Game Initialization', this.container);
        }
    }

    private async loadAssets(): Promise<void> {
        this.uiManager = new UIManager(
            this.uiContainer,
            this.container,
            this.animationManager
        );

        const resources = await this.assetLoader.loadAll((progress) => {
            this.uiManager.updateLoadingProgress(progress);
        });

        this.uiManager.hideLoading();

        this.cameraController = new CameraController(
            this.worldContainer,
            resources.background.width,
            resources.background.height,
            this.application.screen.width,
            this.application.screen.height
        );

        this.worldContainer.addChild(new PIXI.Sprite(resources.background));

        this.selectRandomSkin();

        this.itemManager = new ItemManager(
            this.worldContainer,
            resources.atlasTexture,
            resources.atlasData,
            resources.background.width,
            resources.background.height,
            this.animationManager,
            this.gameState,
            this.handleItemCollected.bind(this)
        );

        this.itemManager.spawnItems(resources.spineData);
    }

    private setupGame(): void {
        this.cameraController.centerCamera(
            this.application.screen.width,
            this.application.screen.height
        );
    }

    private selectRandomSkin(): void {
        const randomIndex = Math.floor(Math.random() * GAME_CONFIG.items.availableSkins.length);
        this.gameState.currentSkin = GAME_CONFIG.items.availableSkins[randomIndex];
    }

    private handleItemCollected(item: any): void {
        this.gameState.collectedCount++;

        if (this.gameState.collectedCount === this.gameState.totalItems) {
            this.completeGame();
        }
    }

    private completeGame(): void {
        this.gameState.isGameCompleted = true;
        this.uiManager.showVictory(
            this.application.screen.width,
            this.application.screen.height
        );
    }

    private attachEventListeners(): void {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        this.application.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.application.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.application.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.application.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        this.application.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.application.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.application.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        window.addEventListener('resize', this.handleResize.bind(this));
        this.application.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.code;
        if (key.startsWith('Arrow') || ['KeyA', 'KeyD', 'KeyW', 'KeyS'].includes(key)) {
            event.preventDefault();
            this.pressedKeys[key] = true;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.code;
        if (key.startsWith('Arrow') || ['KeyA', 'KeyD', 'KeyW', 'KeyS'].includes(key)) {
            event.preventDefault();
            delete this.pressedKeys[key];
        }
    }

    private handleMouseDown(event: MouseEvent): void {
        this.cameraController.startDrag(event.clientX, event.clientY);
        this.application.canvas.style.cursor = 'grabbing';
    }

    private handleMouseMove(event: MouseEvent): void {
        this.cameraController.updateDrag(event.clientX, event.clientY);
    }

    private handleMouseUp(): void {
        this.cameraController.endDrag();
        this.application.canvas.style.cursor = 'default';
    }

    private handleTouchStart(event: TouchEvent): void {
        event.preventDefault();
        if (event.touches.length === 1) {
            this.cameraController.startDrag(
                event.touches[0].clientX,
                event.touches[0].clientY
            );
        }
    }

    private handleTouchMove(event: TouchEvent): void {
        event.preventDefault();
        if (event.touches.length === 1) {
            this.cameraController.updateDrag(
                event.touches[0].clientX,
                event.touches[0].clientY
            );
        }
    }

    private handleTouchEnd(event: TouchEvent): void {
        event.preventDefault();
        this.cameraController.endDrag();
    }

    private handleResize(): void {
        this.cameraController.updateScreenSize(
            this.application.screen.width,
            this.application.screen.height
        );
        this.uiManager.updatePositions(
            this.application.screen.width,
            this.application.screen.height
        );
    }

    private gameLoop(): void {
        this.handleKeyboardInput();
        this.cameraController.updateInertia();
        
        this.uiManager.updateDebug({
            collectedCount: this.gameState.collectedCount,
            totalItems: this.gameState.totalItems,
            cameraX: this.worldContainer.x,
            cameraY: this.worldContainer.y
        });
    }

    private handleKeyboardInput(): void {
        let moveX = 0, moveY = 0;
        
        if (this.pressedKeys['ArrowLeft'] || this.pressedKeys['KeyA']) moveX = GAME_CONFIG.camera.speed;
        if (this.pressedKeys['ArrowRight'] || this.pressedKeys['KeyD']) moveX = -GAME_CONFIG.camera.speed;
        if (this.pressedKeys['ArrowUp'] || this.pressedKeys['KeyW']) moveY = GAME_CONFIG.camera.speed;
        if (this.pressedKeys['ArrowDown'] || this.pressedKeys['KeyS']) moveY = -GAME_CONFIG.camera.speed;

        this.cameraController.moveWithKeys(moveX, moveY);
    }

    dispose(): void {
        this.animationManager.dispose();
        this.itemManager.dispose();
        this.uiManager.dispose();
        this.assetLoader.dispose();
        this.application.destroy(true);
    }
}