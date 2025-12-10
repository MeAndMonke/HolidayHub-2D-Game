import { getCanvas, getContext } from "./Canvas.js";

export class UpgradeManager {
    constructor(possibleUpgrades) {
        this.possibleUpgrades = possibleUpgrades;
        this.currentUpgradeOptions = [];
        this.active = false;
        const c = getCanvas();
        this.upgradeButtons = [
            { x: c.width / 2 - 210, y: c.height / 2 - 30, width: 120, height: 120 },
            { x: c.width / 2 - 50, y: c.height / 2 - 30, width: 120, height: 120 },
            { x: c.width / 2 + 110, y: c.height / 2 - 30, width: 120, height: 120 }
        ];
    }

    isActive() {
        return this.active;
    }

    startSelection() {
        this.currentUpgradeOptions = this.getRandomUpgrades();
        this.active = true;
    }

    handleClick(mouseX, mouseY, player) {
        if (!this.active) return false;

        let applied = false;
        this.upgradeButtons.forEach((btn, idx) => {
            if (
                mouseX >= btn.x &&
                mouseX <= btn.x + btn.width &&
                mouseY >= btn.y &&
                mouseY <= btn.y + btn.height
            ) {
                const selectedUpgrade = this.currentUpgradeOptions[idx];
                if (selectedUpgrade) {
                    player.upgrade(selectedUpgrade.name, selectedUpgrade.value);
                    applied = true;
                }
            }
        });

        if (applied) {
            this.active = false;
        }

        return applied;
    }

    draw() {
        if (!this.active) return;

        const c = getCanvas();
        const ctx = getContext();
        const [upgrade1, upgrade2, upgrade3] = this.currentUpgradeOptions;

        ctx.clearRect(0, 0, c.width, c.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 30px 'Retro Blocky', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Wave Complete!", c.width / 2, c.height / 2 - 60);

        ctx.font = "bold 20px 'Retro Blocky', sans-serif";

        this.drawUpgradeOption(this.upgradeButtons[0], upgrade1, -180);
        this.drawUpgradeOption(this.upgradeButtons[1], upgrade2, -20);
        this.drawUpgradeOption(this.upgradeButtons[2], upgrade3, 140);
    }

    drawUpgradeOption(button, upgrade, offsetX) {
        if (!upgrade) return;

        const c = getCanvas();
        const ctx = getContext();

        ctx.fillStyle = upgrade.bgColor || "white";
        ctx.fillRect(button.x, button.y, button.width, button.height);

        ctx.drawImage(upgrade.icon, c.width / 2 + offsetX, c.height / 2 - 20, 60, 60);

        ctx.fillStyle = upgrade.textColor || "black";
        ctx.fillText(upgrade.name, c.width / 2 + offsetX + 30, c.height / 2 + 80);
    }

    getRandomUpgrades() {
        const shuffled = [...this.possibleUpgrades].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }
}
