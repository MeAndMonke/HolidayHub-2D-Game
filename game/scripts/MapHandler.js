import { ctx, c } from "./main.js";

import { LoadImage } from "./Utils.js";

export var MapSprites = {};

export class MapHandler {
    constructor(mapPath) {
        this.tileSize = 128;
        this.scale = 1;

        this.map = [];
        fetch(mapPath)
        .then(response => response.json())
        .then(data => {
            this.map = data;
        });

        this.load();
    }

    load() {
        for (let y = 0; y < 18; y++) {
            MapSprites[y+1] = LoadImage(`assets/tiles/${y+1}.png`);
        }
    }

    render() {
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                const tileId = this.map[row][col];
                const tileImage = MapSprites[tileId];
                if (tileImage) {
                    ctx.drawImage(
                        tileImage,
                        (col * this.tileSize * this.scale),
                        c.height - ((row + 1) * this.tileSize * this.scale),
                        this.tileSize * this.scale,
                        this.tileSize * this.scale
                    );
                }
            }        
        }   
    }
}