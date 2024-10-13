/** @type {HTMLCanvasElement} */

class parkingSpot {
    constructor(exits, trailer, x = 1 / 2, y = 1 / 2, direction) {
        this.trailer = trailer;
        this.exits = exits;

        this.spineLength = this.trailer.spineLength + 120;
        this.halfSpineLength = this.spineLength / 2;
        this.color = this.trailer.color;

        this.direction = direction;

        this.centerX = x * canvas.width;
        this.centerY = y * canvas.height;

        this.hasTrailer = false;
    }

    update() {
        this.northX = this.centerX + Math.sin(this.direction) * this.halfSpineLength;
        this.northY = this.centerY - Math.cos(this.direction) * this.halfSpineLength;

        this.southX = this.centerX - Math.sin(this.direction) * this.halfSpineLength;
        this.southY = this.centerY + Math.cos(this.direction) * this.halfSpineLength;


        let tcx = this.trailer.centerX, tcy = this.trailer.centerY;
        let tax = this.trailer.attachPointX, tay = this.trailer.attachPointY;
        let nx = this.northX, ny = this.northY;
        let sx = this.southX, sy = this.southY;

        if (
            // X Component of Check
            ((tcx > sx - 15 && tcx < nx + 15) || (tcx < sx + 15 && tcx > nx - 15)) &&
            ((tax > sx - 15 && tax < nx + 15) || (tax < sx + 15 && tax > nx - 15)) &&
            // Y Component of Check
            ((tcy > sy && tcy < ny) || (tcy < sy && tcy > ny)) &&
            ((tay > sy && tay < ny) || (tay < sy && tay > ny)) &&
            // Rotational Component of Check
            (Math.abs(this.direction - this.trailer.direction) < 0.1)
        ) {
            this.trailer.isParked = true;
            ctx.strokeStyle = "lightGreen";

            this.exits.forEach(exit => {
                exit.levelFinished = true;
            });
        } else {
            ctx.strokeStyle = this.color;
            this.trailer.isParked = false;

            this.exits.forEach(exit => {
                exit.levelFinished = false;
            });
        }
    }

    render() {
        let x, y, w, h;

        // Parking Space
        ctx.lineWidth = 30;
        ctx.globalAlpha = 0.6;
        w = this.trailer.width * 1.3 + Math.sin(Date.now() / 700) * 5;
        h = this.trailer.length * 1.01 + Math.sin(Date.now() / 700) * 5;
        x = w / -2;
        y = h / -2;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.direction);
        ctx.roundRect(x, y, w, h, 25);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    debug() {
        // DEBUG Parking Center
        ctx.fillStyle = "lightGreen";
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // DEBUG North Point
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.northX, this.northY, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // DEBUG South Point
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.southX, this.southY, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}