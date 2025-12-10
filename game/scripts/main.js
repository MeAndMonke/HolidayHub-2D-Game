import { Player } from "./Player.js";
import { InputManager } from "./InputManager.js";
import { MapHandler } from "./MapHandler.js";
import { checkCollision, LoadImage, LoadJson } from "./Utils.js";
import { getCanvas, getContext } from "./Canvas.js";
import { ScreenRenderer } from "./ScreenRenderer.js";
import { WaveManager } from "./WaveManager.js";
import { UpgradeManager } from "./UpgradeManager.js";

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

// Icons for UI
const Icons = {
    trophy: LoadImage("assets/icons/trophy.png"),
    death: LoadImage("assets/icons/death.png"),
    speed: LoadImage("assets/icons/speed.png"),
    health: LoadImage("assets/icons/health.png"),
    dodge: LoadImage("assets/icons/dodge.png"),
    crit: LoadImage("assets/icons/crit.png"),
    fireRate: LoadImage("assets/icons/fireRate.png"),
    damage: LoadImage("assets/icons/damage.png")
};

const possibleUpgrades = [
    {icon: Icons.speed, name:"Speed", value: 0.4, bgColor: "lightblue"}, 
    {icon: Icons.health, name:"Max Health", value: 30, bgColor: "lightcoral"}, 
    {icon: Icons.dodge, name:"Dodge", value: 0.05, bgColor: "lightgreen"},
    {icon: Icons.crit, name:"Crit Chance", value: 0.05, bgColor: "lightyellow"},
    {icon: Icons.fireRate, name:"Fire Rate", value: 0.2, bgColor: "lightpink"},
    {icon: Icons.damage, name:"Damage", value: 5, bgColor: "lightgray"}
];

// initialize managers
const screenRenderer = new ScreenRenderer(Icons);
const waveManager = new WaveManager(waves);
const upgradeManager = new UpgradeManager(possibleUpgrades);

// game state
let score = 0;
let lost = false;
let homeScreenActive = true;
let gamePaused = false;
let toggleShooting = false;


export function addEnemyBullet(bullet) {
    EnemyBullets.push(bullet);
}

export function addPlayerBullet(bullet) {
    PlayerBullets.push(bullet);
}

export function getScreenActive() {
    return homeScreenActive || lost || waveManager.isOutOfWaves() || upgradeManager.isActive();
}

export function isGamePaused() {
    return gamePaused;
}

function resetGame() {
    score = 0;
    waveManager.reset();
    player.maxHealth = 100;
    player.health = player.maxHealth;
    player.speedMultiplier = 1;
    player.dodgeChance = 0.0;
    player.fireRate = 0.5;
    player.critChance = 0.0;
    player.damage = 10;

    player.x = 100;
    lost = false;
    homeScreenActive = false;
    EnemyBullets.length = 0;
    PlayerBullets.length = 0;
}


// game screen rendering
function draw() {
    const c = getCanvas();
    const ctx = getContext();
    ctx.clearRect(0, 0, c.width, c.height);

    // draw HUD
    screenRenderer.drawHud(score, waveManager.getWaveNumber());

    // draw bullets
    PlayerBullets.forEach(bullet => bullet.draw());
    EnemyBullets.forEach(bullet => bullet.draw());

    // draw map and entities
    mapHandler.render();
    player.draw();
    waveManager.getUfos().forEach(ufo => {
        ufo.update();
        ufo.draw();
    });
}


// input handling
getCanvas().addEventListener("click", (e) => {
    if (!upgradeManager.isActive()) return;

    const c = getCanvas();
    const rect = c.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    upgradeManager.handleClick(mouseX, mouseY, player);
});

function handlePlayerInput() {
    if (inputManager.isKeyPressed('Escape')) {
        gamePaused = !gamePaused;
    }

    if (gamePaused) return;

    if (inputManager.isKeyPressed('T')) {
        toggleShooting = !toggleShooting;
    }

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
        if (lost || waveManager.isOutOfWaves()) {
            resetGame();
        } else if (homeScreenActive) {
            homeScreenActive = false;
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

// collision handling
function updatePlayerBullets() {
    const c = getCanvas();
    PlayerBullets.forEach((bullet, index) => {
        bullet.update();

        // check collisions with UFO
        waveManager.getUfos().forEach((ufo, ufoIndex) => {
            if (checkCollision(bullet, ufo)) {
                if (player.critChance > Math.random()) {
                    ufo.health -= player.damage * 2; // critical hit
                } else {
                    ufo.health -= player.damage;
                }
                PlayerBullets.splice(index, 1);

                if (ufo.health <= 0) {
                    ufo.cleanup();
                    score += ufo.scoreValue;
                    waveManager.getUfos().splice(ufoIndex, 1);
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
    const c = getCanvas();
    EnemyBullets.forEach((bullet, index) => {
        bullet.update();

        // check collision with player
        if (checkCollision(bullet, player)) {
            player.dodgeChance = Math.min(player.dodgeChance, 0.9);
            if (Math.random() < player.dodgeChance) {
                // dodged
                EnemyBullets.splice(index, 1);
                return;
            }
            player.hit(10);
            EnemyBullets.splice(index, 1);
        }

        // remove bullets off-screen
        if (bullet.y < -bullet.height || bullet.y > c.height + bullet.height) {
            EnemyBullets.splice(index, 1);
        }
    });
}


// main game loop (20 FPS)
setInterval(() => {
    if (!document.hasFocus()) return;

    handlePlayerInput();
    
    // render home screen first
    if (homeScreenActive) {
        screenRenderer.drawHomeScreen();
        return;
    }

    if (gamePaused) {
        return;
    }

    // render based on game state
    if (upgradeManager.isActive()) {
        upgradeManager.draw();
        return;
    }

    if (waveManager.isOutOfWaves()) {
        screenRenderer.drawFinalScreen(score);
        return;
    }

    if (player.health <= 0) {
        lost = true;
        screenRenderer.drawLostScreen(score);
        return;
    }

    if (lost) {
        screenRenderer.drawLostScreen(score);
        return;
    }
    
    // spawn wave and handle upgrades
    const waveResult = waveManager.spawnNextWave();
    if (waveResult.upgradeOffered) {
        upgradeManager.startSelection();
    }

    updatePlayerBullets();
    updateEnemyBullets();

    draw();
}, 1000 / 20);

function fireLoop() {
    if (document.hasFocus() &&
        !gamePaused &&
        !homeScreenActive &&
        !waveManager.isOutOfWaves() &&
        !upgradeManager.isActive() &&
        !lost &&
        ((inputManager.isKeyDown(" ") || inputManager.isKeyDown("Space")) || toggleShooting)) {
        player.shoot();
    }
    setTimeout(fireLoop, Math.max(100, 300 / player.fireRate));
}
fireLoop();