import { ctx } from "./main.js";

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
        ctx.drawImage(this.sprite, this.x, this.y, this.width * this.scale, this.height * this.scale);
    }
}