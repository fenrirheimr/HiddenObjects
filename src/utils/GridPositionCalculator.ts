export class GridPositionCalculator {
    static calculateGridPosition(
        index: number,
        columns: number,
        rows: number,
        marginFromEdge: number,
        backgroundWidth: number,
        backgroundHeight: number,
        spriteWidth: number,
        spriteHeight: number,
        randomOffsetPercent: number
    ): { x: number; y: number } {
        const column = index % columns;
        const row = Math.floor(index / columns);

        const cellWidth = (backgroundWidth - 2 * marginFromEdge) / columns;
        const cellHeight = (backgroundHeight - 2 * marginFromEdge) / rows;

        const baseX = marginFromEdge + (column + 0.5) * cellWidth;
        const baseY = marginFromEdge + (row + 0.5) * cellHeight;

        const maxOffsetX = (cellWidth - spriteWidth) / 2;
        const maxOffsetY = (cellHeight - spriteHeight) / 2;

        const randomOffsetX = (Math.random() * 2 - 1) * maxOffsetX * randomOffsetPercent;
        const randomOffsetY = (Math.random() * 2 - 1) * maxOffsetY * randomOffsetPercent;

        const finalX = baseX + randomOffsetX;
        const finalY = baseY + randomOffsetY;

        return this.clampToBounds(
            finalX,
            finalY,
            spriteWidth,
            spriteHeight,
            backgroundWidth,
            backgroundHeight
        );
    }

    static clampToBounds(
        x: number,
        y: number,
        spriteWidth: number,
        spriteHeight: number,
        backgroundWidth: number,
        backgroundHeight: number
    ): { x: number; y: number } {
        const minX = spriteWidth / 2;
        const maxX = backgroundWidth - spriteWidth / 2;
        const minY = spriteHeight / 2;
        const maxY = backgroundHeight - spriteHeight / 2;

        return {
            x: Math.max(minX, Math.min(maxX, x)),
            y: Math.max(minY, Math.min(maxY, y))
        };
    }
}