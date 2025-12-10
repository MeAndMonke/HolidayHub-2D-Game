import { Player } from "./Player.js";
import { InputManager } from "./InputManager.js";
import { MapHandler } from "./MapHandler.js";
import { createUFO } from "./UFO.js";
import { checkCollision, LoadImage, LoadJson } from "./Utils.js";

// canvas
export var c = document.getElementById("gameWindow");
export var ctx = c.getContext("2d");

// assets
export const spritesheets = {
    player: LoadImage("assets/characters/player.png")
};

export const waves = await LoadJson("data/waves.json");

// game objects
const inputManager = new InputManager();
const mapHandler = new MapHandler("data/map.json");
const player = new Player();

// bullet arrays
const EnemyBullets = [];
const PlayerBullets = [];

const Icons = {
    trophy: LoadImage("assets/icons/trophy.png")
}

// buttons
const upgradeButtons = [
    { x: c.width / 2 - 210, y: c.height / 2 - 30, width: 120, height: 120 },
    { x: c.width / 2 - 50, y: c.height / 2 - 30, width: 120, height: 120 },
    { x: c.width / 2 + 110, y: c.height / 2 - 30, width: 120, height: 120 }
];

// game state
let score = 0;
let wave = 0;
let ufos = [];

let lost = false;
let outOfWaves = false;
let homeScreenActive = true;
let endOfWave = false;

// Utility functions
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// bullet management
export function addEnemyBullet(bullet) {
    EnemyBullets.push(bullet);
}

export function addPlayerBullet(bullet) {
    PlayerBullets.push(bullet);
}

export function getScreenActive() {
    return homeScreenActive || lost || outOfWaves || endOfWave;
}

function drawUpgradeScreen(upgrade1 = {icon: Icons.trophy, name:"Speed", bgColor: "lightblue"}, upgrade2={icon: Icons.trophy, name:"Max Health", bgColor: "lightcoral"}, upgrade3={icon: Icons.trophy, name:"Dodge", bgColor: "lightgreen"}) {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, c.width, c.height);


    ctx.fillStyle = "white";
    ctx.font = "bold 30px 'Retro Blocky', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Wave Complete!", c.width / 2, c.height / 2 - 60);

    ctx.font = "bold 20px 'Retro Blocky', sans-serif";

    // upgrade 1
    ctx.fillStyle = upgrade1.bgColor || "white";
    ctx.fillRect(upgradeButtons[0].x, upgradeButtons[0].y, upgradeButtons[0].width, upgradeButtons[0].height);

    ctx.drawImage(upgrade1.icon, c.width / 2 - 180, c.height / 2 - 20, 60, 60);

    ctx.fillStyle = upgrade1.textColor || "black";
    ctx.fillText(upgrade1.name, c.width / 2 - 150, c.height / 2 + 80);

    // upgrade 2
    ctx.fillStyle = upgrade2.bgColor || "white";
    ctx.fillRect(upgradeButtons[1].x, upgradeButtons[1].y, upgradeButtons[1].width, upgradeButtons[1].height);


    ctx.drawImage(upgrade2.icon, c.width / 2 - 20, c.height / 2 - 20, 60, 60);

    ctx.fillStyle = upgrade2.textColor || "black";
    ctx.fillText(upgrade2.name, c.width / 2 + 10, c.height / 2 + 80);

    // upgrade 3
    ctx.fillStyle = upgrade3.bgColor || "white";
    ctx.fillRect(upgradeButtons[2].x, upgradeButtons[2].y, upgradeButtons[2].width, upgradeButtons[2].height);

    ctx.drawImage(upgrade3.icon, c.width / 2 + 140, c.height / 2 - 20, 60, 60);

    ctx.fillStyle = upgrade3.textColor || "black";
    ctx.fillText(upgrade3.name, c.width / 2 + 170, c.height / 2 + 80);
}

// screen rendering
function drawFinalScreen() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.roundRect(c.width / 4, c.height / 4, c.width / 2, c.height / 2, 20);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 30px 'Retro Blocky', sans-serif"
    ctx.textAlign = "center";

    ctx.drawImage(Icons.trophy, c.width / 2 - 65, c.height / 2 - 125, 60, 60);
    ctx.drawImage(Icons.trophy, c.width / 2 + 5, c.height / 2 - 125, 60, 60);
    ctx.drawImage(Icons.trophy, c.width / 2 - 40, c.height / 2 - 145, 80, 80);

    ctx.fillText("Congratulations!", c.width / 2, c.height / 2 - 40);
    ctx.fillText("You've completed all waves!", c.width / 2, c.height / 2);
    ctx.fillText(`Final Score: ${score}`, c.width / 2, c.height / 2 + 40);
    ctx.fillText("Press Enter to Restart", c.width / 2, c.height / 2 + 85);
}

function drawHomeScreen() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.roundRect(c.width / 4, c.height / 4, c.width / 2, c.height / 2, 20); 
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 40px 'Retro Blocky', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Holiday Hub Shooter", c.width / 2, c.height / 2 - 40);
    ctx.font = "bold 30px 'Retro Blocky', sans-serif";
    ctx.fillText("Press Enter to Start", c.width / 2, c.height / 2 + 40);
}

function drawLostScreen() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.roundRect(c.width / 4, c.height / 4, c.width / 2, c.height / 2, 20); // 20 = corner radius
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 30px 'Retro Blocky', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", c.width / 2, c.height / 2 - 40);
    ctx.fillText(`Final Score: ${score}`, c.width / 2, c.height / 2);
    ctx.fillText("Press Enter to Restart", c.width / 2, c.height / 2 + 60);
}

// game screen
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    // draw score
    ctx.fillStyle = "white";
    ctx.font = "bold 23px 'Retro Blocky', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 20);

    ctx.textAlign = "center";
    ctx.fillText(`Wave: ${wave}`, c.width / 2, 50);

    // draw bullets
    PlayerBullets.forEach(bullet => bullet.draw());
    EnemyBullets.forEach(bullet => bullet.draw());

    // draw map and entities
    mapHandler.render();
    player.draw();
    ufos.forEach(ufo => {
        ufo.update();
        ufo.draw();
    });
}

// input handling
c.addEventListener("click", (e) => {

    if (!endOfWave) return;

    const rect = c.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    upgradeButtons.forEach(btn => {
        if (
            mouseX >= btn.x &&
            mouseX <= btn.x + btn.width &&
            mouseY >= btn.y &&
            mouseY <= btn.y + btn.height
        ) {
            // console.log(`Upgrade clicked: ${btn.name}`);
            // applyUpgrade(btn.name); // call your function to apply the upgrade
            endOfWave = false;
        }
    });
});

function handlePlayerInput() {
    if (inputManager.isKeyDown('A') || inputManager.isKeyDown('ArrowLeft')) {
        player.move(-1, 0);
        player.curAnimation = 1;
    }

    if (inputManager.isKeyDown('D') || inputManager.isKeyDown('ArrowRight')) {
        player.move(1, 0);
        player.curAnimation = 2;
    }

    // restart the game
    if (inputManager.isKeyDown('Enter')) {
        if (lost || outOfWaves) {
            // reset game
            score = 0;
            wave = 0;
            ufos.forEach(ufo => ufo.cleanup());
            ufos = [];
            player.health = player.maxHealth;
            player.x = 100;
            lost = false;
            outOfWaves = false;
            homeScreenActive = false;
        } else if (homeScreenActive) {
            homeScreenActive = false;
        } else if (endOfWave) {
            endOfWave = false;
        }
    }

    if (
        !inputManager.isKeyDown('A') &&
        !inputManager.isKeyDown('D') &&
        !inputManager.isKeyDown('ArrowLeft') &&
        !inputManager.isKeyDown('ArrowRight')
    ) {
        player.curFrame = 0; // idle frame
    }
}

// Wave manager
function spawnWave() {
    if (ufos.length > 0) return;

    // empty lists
    EnemyBullets.length = 0;
    PlayerBullets.length = 0;

    const waveData = waves[wave];

    if (!waveData) {
        outOfWaves = true;
        return;
    }

    waveData.enemies.forEach(enemy => {
        const { level, type, count } = enemy;

        if (type === "UFO") {
            for (let i = 0; i < count; i++) {
                ufos.push(createUFO(level, random(0, c.width - 80)));
            }
        }
    });

    if (wave !== 0) endOfWave = true;

    wave++;
}

// collision
function updatePlayerBullets() {
    PlayerBullets.forEach((bullet, index) => {
        bullet.update();

        // check collisions with UFO
        ufos.forEach((ufo, ufoIndex) => {
            if (checkCollision(bullet, ufo)) {
                ufo.health -= 10;
                PlayerBullets.splice(index, 1);

                if (ufo.health <= 0) {
                    ufo.cleanup();
                    score += ufo.scoreValue;
                    ufos.splice(ufoIndex, 1);
                }
            }
        });

        // remove bullets off-screen
        if (bullet.y < -bullet.height || bullet.y > c.height + bullet.height) {
            PlayerBullets.splice(index, 1);
        }
    });
}

function updateEnemyBullets() {
    EnemyBullets.forEach((bullet, index) => {
        bullet.update();

        // check collision with player
        if (checkCollision(bullet, player)) {
            player.hit(10);
            EnemyBullets.splice(index, 1);
        }

        // remove bullets off-screen
        if (bullet.y < -bullet.height || bullet.y > c.height + bullet.height) {
            EnemyBullets.splice(index, 1);
        }
    });
}

// game loop (20 FPS)
setInterval(() => {
    if (!document.hasFocus()) return;

    handlePlayerInput();
    spawnWave();
    updatePlayerBullets();
    updateEnemyBullets();


    if (endOfWave) {
        drawUpgradeScreen();
        return;
    }

    if (homeScreenActive) {
        drawHomeScreen();
        return
    }

    if (outOfWaves) {
        drawFinalScreen();
        return;
    }

    if (!lost) {
        if (player.health <= 0) {
            lost = true;
            drawLostScreen();
        }
        draw();
        return;
    }
    
    if (lost) {
        drawLostScreen();
        return;
    }
}, 1000 / 20);

// Shooting interval (every 300ms)
setInterval(() => {
    if (!document.hasFocus()) return;

    if (inputManager.isKeyDown(' ') || inputManager.isKeyDown('Space')) {
        player.shoot();
    }
}, 300);