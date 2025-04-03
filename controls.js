class Controls{
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(type) {
            case "PLAYER":
                this.#addKeyboardListeners();
                break;
            case "AI":
                // AI controls are set programmatically, no listeners needed
                // We might still want default values or specific logic here?
                // For now, just initialize flags to false.
                break;
            case "DUMMY":
                // Dummy cars don't have controls, but setting forward might be useful if needed
                this.forward = true; // Dummies always try to move forward
                break;
        }
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
            // Optional: console.table(this);
        }

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
            // Optional: console.table(this);
        }
    }
}