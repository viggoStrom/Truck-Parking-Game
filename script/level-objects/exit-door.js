/** @type {HTMLCanvasElement} */

class exit {
    constructor(nextLevel, trucks, x = 1, y = 1 / 2, direction = Math.PI) {
        this.trucks = trucks;

        this.centerX = x * canvas.width;
        this.centerY = y * canvas.height;
        this.direction = direction;

        this.gap = 230;

        this.levelFinished = false;
        this.nextLevel = false;

        this.level = nextLevel;
    }

    render() {
        let x, y, w, h;

        // Glow
        w = 130;
        h = 220;
        x = this.centerX - w / 2;
        y = this.centerY - h / 2;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.direction);
        const gradient = ctx.createLinearGradient(-this.centerX + x - w, -this.centerY + y, -this.centerX + x + w, -this.centerY + y);
        if (this.levelFinished) {
            gradient.addColorStop(0, "green");
            gradient.addColorStop(1, "rgba(0,255,0,0.05)");
        } else {
            gradient.addColorStop(0, "red");
            gradient.addColorStop(1, "rgba(255,0,0,0.05)");
        }
        ctx.fillStyle = gradient;
        ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Frame
        w = 30;
        h = 230;
        x = this.centerX - w / 2;
        y = this.centerY - h / 2;
        ctx.fillStyle = "darkGray";
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.direction);
        ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    check() {
        this.trucks.forEach(truck => {
            if (
                this.levelFinished &&
                truck.centerX > this.centerX - this.gap &&
                truck.centerX < this.centerX + this.gap &&
                truck.centerY > this.centerY - this.gap &&
                truck.centerY < this.centerY + this.gap
            ) {
                truck.centerX -= Math.cos(this.direction);
                truck.centerY -= Math.sin(this.direction);

                this.nextLevel = true;
            }
        });
    }

    nextLevelCheck() {
        if (this.nextLevel) {
            return this.level;
        }
        else {
            return null;
        }
    }
}