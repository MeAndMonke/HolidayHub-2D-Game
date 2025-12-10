import { getCanvas, getContext } from "./Canvas.js";

export class ScreenRenderer {
    constructor(Icons) {
        this.Icons = Icons;
    }

    drawHomeScreen() {
        const c = getCanvas();
        const ctx = getContext();
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.roundRect(c.width / 4, c.height / 4, c.width / 2, c.height / 2, 20);
        ctx.fill();

        ctx.textAlign = "left";

        ctx.fillStyle = "white";
        ctx.font = "bold 40px 'Retro Blocky', sans-serif";
        ctx.fillText("Holiday Hub Shooter", c.width / 2 - 250, c.height / 2 - 80);

        ctx.font = "bold 15px 'Retro Blocky', sans-serif";
        ctx.fillText("Movement: A/D or Arrow Keys", c.width / 2 - 250, c.height / 2 - 35);
        ctx.fillText("Shoot: Spacebar", c.width / 2 - 250, c.height / 2 - 10);
        ctx.fillText("Toggle Shoot: T", c.width / 2 - 250, c.height / 2 + 15);
        ctx.fillText("Pause: Escape", c.width / 2 - 250, c.height / 2 + 40);

        ctx.font = "bold 30px 'Retro Blocky', sans-serif";
        ctx.fillText("Press Enter to Start", c.width / 2 - 250, c.height / 2 + 90);
    }

    drawFinalScreen(score) {
        const c = getCanvas();
        const ctx = getContext();
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.roundRect(c.width / 4, c.height / 4, c.width / 2, c.height / 2, 20);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 30px 'Retro Blocky', sans-serif";
        ctx.textAlign = "center";

        ctx.drawImage(this.Icons.trophy, c.width / 2 - 65, c.height / 2 - 125, 60, 60);
        ctx.drawImage(this.Icons.trophy, c.width / 2 + 5, c.height / 2 - 125, 60, 60);
        ctx.drawImage(this.Icons.trophy, c.width / 2 - 40, c.height / 2 - 145, 80, 80);

        ctx.fillText("Congratulations!", c.width / 2, c.height / 2 - 40);
        ctx.fillText("You've completed all waves!", c.width / 2, c.height / 2);
        ctx.fillText(`Final Score: ${score}`, c.width / 2, c.height / 2 + 40);
        ctx.fillText("Press Enter to Restart", c.width / 2, c.height / 2 + 85);
    }

    drawLostScreen(score) {
        const c = getCanvas();
        const ctx = getContext();
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.roundRect(c.width / 4, c.height / 4, c.width / 2, c.height / 2, 20);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 30px 'Retro Blocky', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", c.width / 2, c.height / 2 - 40);
        ctx.fillText(`Final Score: ${score}`, c.width / 2, c.height / 2);
        ctx.fillText("Press Enter to Restart", c.width / 2, c.height / 2 + 60);
    }

    drawHud(score, wave) {
        const c = getCanvas();
        const ctx = getContext();
        ctx.fillStyle = "white";
        ctx.font = "bold 23px 'Retro Blocky', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`Score: ${score}`, 10, 20);

        ctx.textAlign = "center";
        ctx.fillText(`Wave: ${wave}`, c.width / 2, 50);
    }
}
