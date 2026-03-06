export class CameraBounds {
    constructor(
        private worldWidth: number,
        private worldHeight: number,
        private screenWidth: number,
        private screenHeight: number
    ) {}

    getMinX(): number {
        return Math.min(0, this.screenWidth - this.worldWidth);
    }

    getMaxX(): number {
        return 0;
    }

    getMinY(): number {
        return Math.min(0, this.screenHeight - this.worldHeight);
    }

    getMaxY(): number {
        return 0;
    }

    clampPosition(x: number, y: number): { x: number; y: number } {
        return {
            x: Math.max(this.getMinX(), Math.min(this.getMaxX(), x)),
            y: Math.max(this.getMinY(), Math.min(this.getMaxY(), y))
        };
    }

    updateScreenSize(width: number, height: number): void {
        this.screenWidth = width;
        this.screenHeight = height;
    }
}