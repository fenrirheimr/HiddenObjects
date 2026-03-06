import * as PIXI from 'pixi.js';
import { CameraBounds } from './CameraBounds';
import { GAME_CONFIG } from '../../config/GameConfig';

export class CameraController {
    private isDragging = false;
    private lastMousePosition = { x: 0, y: 0 };
    private cameraVelocity = { x: 0, y: 0 };
    private bounds: CameraBounds;

    constructor(
        private worldContainer: PIXI.Container,
        worldWidth: number,
        worldHeight: number,
        screenWidth: number,
        screenHeight: number
    ) {
        this.bounds = new CameraBounds(worldWidth, worldHeight, screenWidth, screenHeight);
        this.centerCamera(screenWidth, screenHeight);
    }

    centerCamera(screenWidth: number, screenHeight: number): void {
        this.worldContainer.x = (screenWidth - this.bounds['worldWidth']) / 2;
        this.worldContainer.y = (screenHeight - this.bounds['worldHeight']) / 2;
    }

    startDrag(x: number, y: number): void {
        this.isDragging = true;
        this.lastMousePosition = { x, y };
        this.cameraVelocity = { x: 0, y: 0 };
    }

    updateDrag(x: number, y: number): void {
        if (!this.isDragging) return;

        const deltaX = x - this.lastMousePosition.x;
        const deltaY = y - this.lastMousePosition.y;

        this.move(deltaX, deltaY);
        this.cameraVelocity = { x: deltaX, y: deltaY };
        this.lastMousePosition = { x, y };
    }

    endDrag(): void {
        this.isDragging = false;
    }

    move(deltaX: number, deltaY: number): void {
        const newX = this.worldContainer.x + deltaX;
        const newY = this.worldContainer.y + deltaY;

        const clamped = this.bounds.clampPosition(newX, newY);
        this.worldContainer.x = clamped.x;
        this.worldContainer.y = clamped.y;
    }

    moveWithKeys(horizontal: number, vertical: number): void {
        if (horizontal !== 0 || vertical !== 0) {
            this.move(horizontal, vertical);
            this.cameraVelocity = { x: horizontal, y: vertical };
        }
    }

    updateInertia(): void {
        if (this.isDragging) return;

        this.cameraVelocity.x *= GAME_CONFIG.camera.dampingFactor;
        this.cameraVelocity.y *= GAME_CONFIG.camera.dampingFactor;

        if (Math.abs(this.cameraVelocity.x) < GAME_CONFIG.camera.inertiaThreshold) {
            this.cameraVelocity.x = 0;
        }
        if (Math.abs(this.cameraVelocity.y) < GAME_CONFIG.camera.inertiaThreshold) {
            this.cameraVelocity.y = 0;
        }

        if (this.cameraVelocity.x !== 0 || this.cameraVelocity.y !== 0) {
            this.move(this.cameraVelocity.x, this.cameraVelocity.y);
        }
    }

    updateScreenSize(width: number, height: number): void {
        this.bounds.updateScreenSize(width, height);
        const clamped = this.bounds.clampPosition(this.worldContainer.x, this.worldContainer.y);
        this.worldContainer.x = clamped.x;
        this.worldContainer.y = clamped.y;
    }

    getBounds(): CameraBounds {
        return this.bounds;
    }
}