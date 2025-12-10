import { createUFO } from "./UFO.js";
import { getCanvas } from "./Canvas.js";

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export class WaveManager {
    constructor(waves) {
        this.waves = waves;
        this.ufos = [];
        this.wave = 0;
        this.outOfWaves = false;
    }

    reset() {
        this.clearUfos();
        this.wave = 0;
        this.outOfWaves = false;
    }

    clearUfos() {
        this.ufos.forEach(ufo => ufo.cleanup());
        this.ufos = [];
    }

    getUfos() {
        return this.ufos;
    }

    getWaveNumber() {
        return this.wave;
    }

    isOutOfWaves() {
        return this.outOfWaves;
    }

    spawnNextWave() {
        if (this.ufos.length > 0 || this.outOfWaves) {
            return { spawned: false, upgradeOffered: false, outOfWaves: this.outOfWaves };
        }

        const waveData = this.waves[this.wave];
        if (!waveData) {
            this.outOfWaves = true;
            return { spawned: false, upgradeOffered: false, outOfWaves: true };
        }

        const c = getCanvas();
        waveData.enemies.forEach(enemy => {
            const { level, type, count } = enemy;
            if (type === "UFO") {
                for (let i = 0; i < count; i++) {
                    this.ufos.push(createUFO(level, random(0, c.width - 80)));
                }
            }
        });

        const upgradeOffered = this.wave !== 0;
        this.wave++;

        return { spawned: true, upgradeOffered, outOfWaves: false };
    }
}
