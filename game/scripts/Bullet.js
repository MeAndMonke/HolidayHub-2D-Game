import { Entity } from "./Entity.js";

export class Bullet extends Entity {
    constructor(x, y, bulletSprite, direction) {
        const sprite = bulletSprite;
        super(x, y, 8, 8, sprite, 2);
        this.speed = 15;
        this.direction = direction;
    }

    update() {
        this.move(0, this.speed * this.direction);
    }
}