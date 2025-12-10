import { getContext } from "./Canvas.js";

export class Entity {
    constructor(x, y, width, height, sprite, scale=1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.direction = 1;

        this.scale = scale;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    draw() {
        const ctx = getContext();
        ctx.drawImage(this.sprite, this.x, this.y, this.width * this.scale, this.height * this.scale);
    }
}