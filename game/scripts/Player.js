import { getContext, getCanvas } from "./Canvas.js";
import { spritesheets, addPlayerBullet } from "./main.js";
import { Bullet } from "./Bullet.js";
import { LoadImage } from "./Utils.js";

const BulletSprite = LoadImage("assets/effects/snowball.png");

export class Player {

    constructor() {
        this.maxHealth = 100;
        this.health = this.maxHealth;

        const c = getCanvas();
        this.x = 100;
        this.y = c.height - 215;
        this.width = 26 * 3;
        this.height = 37 * 3;

        this.scale = 1;
        this.moveSpeed = 10;
        this.movementMultiplier = 1;

        this.fireRate = 0.5;
        this.critChance = 0.0;
        this.dodgeChance = 0.0;
        this.damage = 10;
        
        // animations n stuff
        this.curFrame = 0;
        this.curAnimation = 2; // 0: down, 1: left, 2: right, 3: up
        this.sprite = spritesheets?.player;
    }

    move(xDir, yDir) {
        const c = getCanvas();
        if (this.x < 0) this.x = 0;
        if (this.x > c.width - this.width * this.scale) this.x = c.width - this.width * this.scale;

        this.x += xDir * this.moveSpeed * this.movementMultiplier;
        this.y += yDir * this.moveSpeed * this.movementMultiplier;
    }

    shoot() {
        const bullet = new Bullet(this.x + (this.width * this.scale) / 2, this.y + (this.height * this.scale) / 2 - 4, BulletSprite, -1);
        addPlayerBullet(bullet);
    }

    upgrade(upgradeType, value) {
        switch (upgradeType) {
            case "Speed":
                console.log("Upgrading Speed by", value);
                this.movementMultiplier += value;
                break;

            case "Max Health":
                console.log("Upgrading Max Health by", value);
                this.maxHealth += value;
                this.health += value;
                break;

            case "Dodge":
                console.log("Upgrading Dodge Chance by", value);
                this.dodgeChance += value;
                break;

            case "Crit Chance":
                console.log("Upgrading Crit Chance by", value);
                this.critChance = (this.critChance || 0) + value;
                break;

            case "Fire Rate":
                console.log("Upgrading Fire Rate by", value);
                this.fireRate = (this.fireRate || 0) + value;
                break;
            
            case "Damage":
                console.log("Upgrading Damage by", value);
                this.damage += value;
                break;

            default:
                break;
        }
    }

    draw() {
        const ctx = getContext();
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