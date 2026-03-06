import { Game } from './core/Game';
import './style.css';

window.addEventListener('load', () => {
    const container = document.getElementById('game-container');
    if (!container) {
        console.error('Game container not found');
        return;
    }

    try {
        const game = new Game(container);
        (window as any).game = game; // For debugging
    } catch (error) {
        console.error('Failed to start game:', error);
        container.innerHTML = `
            <div style="color: white; text-align: center; padding: 20px;">
                <h1>Failed to start game</h1>
                <p>Please check the console for details</p>
                <button onclick="location.reload()">Reload</button>
            </div>
        `;
    }
});