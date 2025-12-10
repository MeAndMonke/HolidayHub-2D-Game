import { Entity } from "./Entity.js";
import { LoadImage, random } from "./Utils.js";
import { getCanvas, getContext } from "./Canvas.js";
import { addEnemyBullet, getScreenActive, isGamePaused } from "./main.js";
import { Bullet } from "./Bullet.js";

const bulletSprite = LoadImage("assets/effects/laser.png");

export class UFO extends Entity {
    constructor(x, y, level) {
        const sprite = LoadImage("assets/characters/spaceShip.png");
        super(x, y, 16, 16, sprite, 5);

        this.maxHealth = Math.floor(10 * (level / 3) + 20);
        this.health = this.maxHealth;

        this.scoreValue = level * 10;

        this.randomMaxSpeed = random(22, 28);

        this.speed = 3;
        this.level = level;
        this.direction = 1; // 1: right, -1: left


        
        this.startShootLoop();
    }

    startShootLoop() {
        const shootLoop = setInterval(() => {

        if (getScreenActive()) return;
        if (isGamePaused()) return;
        if (this.health <= 0) {
            clearInterval(shootLoop);
                return;
            }

            if (!document.hasFocus()) return;
            this.shoot();
        }, this.getShootDelay());
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    update() {
        const c = getCanvas();
        if (this.x > c.width - this.width * this.scale) {
            this.direction = -1;
        } else if (this.x < -this.width) {
            this.direction = 1;
        }
        this.move(Math.min(this.randomMaxSpeed, this.speed * this.level) * this.direction, 0);
    }

    shoot() {
        const bullet = new Bullet(this.x + ((this.width * this.scale) / 2), this.y + (this.height * this.scale) - 2, bulletSprite, 1);
        addEnemyBullet(bullet);
    }

    getShootDelay() {
        return Math.max(random(1000, 1200) - (this.level * 80), 500);
    }
    
    draw() {
        super.draw();

        const ctx = getContext();
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`UFO Lv.${this.level}`, this.x + (this.width * this.scale) / 2, this.y - 5);


        // health bar
        ctx.fillStyle = "red";
        ctx.lineWidth = 4;
        ctx.fillRect(this.x, this.y - 33, (this.width * this.scale), 10);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y - 33, (this.health / this.maxHealth) * (this.width * this.scale), 10);

        }

    cleanup() {
        this.sprite = null;
        this.health = 0;
    }
}

export function createUFO(level, x) {
    const ufo = new UFO(x, 50, level);
    return ufo;
}