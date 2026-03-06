export class LoadingScreen {
    private element: HTMLDivElement;

    constructor(private container: HTMLElement) {
        this.element = this.create();
    }

    private create(): HTMLDivElement {
        const div = document.createElement('div');
        div.className = 'loader';
        div.textContent = '0%';
        div.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 24px;
            background: rgba(0,0,0,0.7);
            padding: 20px 40px;
            border-radius: 10px;
            z-index: 1000;
            transition: opacity 0.3s;
        `;
        this.container.appendChild(div);
        return div;
    }

    updateProgress(percent: number): void {
        this.element.textContent = `${Math.round(percent)}%`;
    }

    hide(): void {
        this.element.style.opacity = '0';
        setTimeout(() => {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
    }

    show(): void {
        this.element.style.opacity = '1';
    }
}