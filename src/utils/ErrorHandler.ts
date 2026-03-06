export class ErrorHandler {
    static handle(error: any, context: string, container?: HTMLElement): void {
        console.error(`[${context}]`, error);

        if (container) {
            this.showUserError(error, container);
        }
    }

    private static showUserError(error: any, container: HTMLElement): void {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: red;
            background: rgba(0,0,0,0.8);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid red;
            z-index: 2000;
            text-align: center;
            max-width: 80%;
        `;

        const message = error?.message || 'Unknown error';
        const userMessage = this.getUserFriendlyMessage(message);

        errorDiv.innerHTML = `
            <h2>⚠️ Oops!</h2>
            <p>${userMessage}</p>
            <button onclick="location.reload()" style="padding:8px 20px;margin-top:10px;cursor:pointer">
                Try Again
            </button>
        `;

        container.appendChild(errorDiv);
    }

    private static getUserFriendlyMessage(errorMessage: string): string {
        if (errorMessage.includes('404')) {
            return 'Game files not found. Please check the assets folder.';
        }
        if (errorMessage.includes('Failed to fetch')) {
            return 'Network error. Please check your connection.';
        }
        return 'Something went wrong. Please try again.';
    }
}