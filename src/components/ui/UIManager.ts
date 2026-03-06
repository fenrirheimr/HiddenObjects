import * as PIXI from 'pixi.js';
import { VictoryMessage } from './VictoryMessage';
import { DebugInfo, DebugData } from './DebugInfo';
import { LoadingScreen } from './LoadingScreen';
import { AnimationManager } from '../../animation/AnimationManager';

export class UIManager {
    private victoryMessage: VictoryMessage;
    private debugInfo: DebugInfo;
    private loadingScreen: LoadingScreen;
    private helpText: PIXI.Text;

    constructor(
        private uiContainer: PIXI.Container,
        private container: HTMLElement,
        private animationManager: AnimationManager
    ) {
        this.victoryMessage = new VictoryMessage(uiContainer, animationManager);
        this.debugInfo = new DebugInfo(uiContainer);
        this.loadingScreen = new LoadingScreen(container);
        this.helpText = this.createHelpText();
    }

    private createHelpText(): PIXI.Text {
        const text = new PIXI.Text({
            text: 'Можно перетаскивть поле игры мышкой \nили перемещаться при помощи стрелочеки или W.A.S.D.',
            style: {
                fontSize: 13,
                fill: 0xcccccc,
                stroke: { color: 0x000000, width: 2 }
            }
        });
        text.x = 10;
        text.y = 10;
        this.uiContainer.addChild(text);
        return text;
    }

    showVictory(screenWidth: number, screenHeight: number): void {
        this.victoryMessage.show(screenWidth, screenHeight);
    }

    updateDebug(data: DebugData): void {
        this.debugInfo.update(data);
    }

    updateLoadingProgress(percent: number): void {
        this.loadingScreen.updateProgress(percent);
    }

    hideLoading(): void {
        this.loadingScreen.hide();
    }

    updatePositions(screenWidth: number, screenHeight: number): void {
        this.victoryMessage.updatePosition(screenWidth, screenHeight);
    }

    dispose(): void {
        this.victoryMessage.hide();
        this.loadingScreen.hide();
    }
}