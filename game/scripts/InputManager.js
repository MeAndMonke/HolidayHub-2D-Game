export class InputManager {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    // check for continuous press
    isKeyDown(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    // check for single click
    isKeyPressed(key) {
        if (this.keys[key.toLowerCase()]) {
            this.keys[key.toLowerCase()] = false;
            return true;
        }
    }
}