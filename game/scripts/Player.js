import { ctx, c, spritesheets, addPlayerBullet } from "./main.js";
import { Bullet } from "./Bullet.js";
import { LoadImage } from "./Utils.js";

const BulletSprite = LoadImage("assets/effects/snowball.png");

export class Player {

    constructor() {
        this.maxHealth = 100;
        this.health = this.maxHealth;

        this.x = 100;
        this.y = c.height - 215;
        this.width = 26 * 3;
        this.height = 37 * 3;

        this.scale = 1;
        this.movementMultiplier = 15;
        
        // animations n stuff
        this.curFrame = 0;
        this.curAnimation = 2; // 0: down, 1: left, 2: right, 3: up
        this.sprite = spritesheets?.player;
    }

    move(xDir, yDir) {

        if (this.x < 0) this.x = 0;
        if (this.x > c.width - this.width * this.scale) this.x = c.width - this.width * this.scale;

        this.x += xDir * this.movementMultiplier;
        this.y += yDir * this.movementMultiplier;
    }

    shoot() {
        const bullet = new Bullet(this.x + (this.width * this.scale) / 2, this.y + (this.height * this.scale) / 2 - 4, BulletSprite, -1);
        addPlayerBullet(bullet);
    }

    draw() {

        this.curFrame++;
        if (this.curFrame > 2) {
            this.curFrame = 0;
        }

        ctx.drawImage(
            this.sprite,
            this.curFrame * this.width,
            this.curAnimation * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale
        );

        // health bar
        ctx.fillStyle = "red";
        ctx.lineWidth = 4;
        ctx.fillRect(this.x, this.y - 20, (this.width * this.scale), 10);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y - 20, (this.health / this.maxHealth) * (this.width * this.scale), 10);
    }

    hit(damage) {
        this.health -= damage;
        if (this.health < 0) this.health = 0;
    }
}