/** @type {HTMLCanvasElement} */

class Dashboard {
    constructor() {
        this.displays = {
            speed: {
                canvas: document.getElementById("speed"),
                ctx: document.getElementById("speed").getContext("2d"),
                value: 0,
            },
            turnAngle: {
                canvas: document.getElementById("turnAngle"),
                ctx: document.getElementById("turnAngle").getContext("2d"),
                value: 0,
                dialLength: 150
            },
            trailer: {
                canvas: document.getElementById("trailer"),
                ctx: document.getElementById("trailer").getContext("2d")
            },
            gear: {
                canvas: document.getElementById("gear"),
                ctx: document.getElementById("gear").getContext("2d")
            }
        }

        Object.keys(this.displays).forEach(displayName => {
            const display = this.displays[displayName]
            display.canvas.width = 400
            display.canvas.height = 400
        })
    }

    update() {
        this.displays.turnAngle.point = [
            Math.cos(this.displays.turnAngle.value - Math.PI / 2) * this.displays.turnAngle.dialLength,
            Math.sin(this.displays.turnAngle.value - Math.PI / 2) * this.displays.turnAngle.dialLength
        ]
    }

    render() {
        Object.keys(this.displays).forEach(displayName => {
            const display = this.displays[displayName]
            display.ctx.clearRect(0, 0, display.canvas.width, display.canvas.height)

            display.ctx.strokeStyle = "black";
            display.ctx.fillStyle = "gray"
            display.ctx.lineWidth = 15;
            display.ctx.beginPath();
            display.ctx.arc(display.canvas.width / 2, display.canvas.height / 2, 190, 0, 2 * Math.PI);
            display.ctx.stroke();
            display.ctx.fill()
            display.ctx.closePath();

            display.ctx.fillStyle = "black";
            display.ctx.beginPath();
            display.ctx.arc(display.canvas.width / 2, display.canvas.height / 2, 10, 0, 2 * Math.PI);
            display.ctx.fill();
            display.ctx.closePath();


            try {
                display.ctx.strokeStyle = "black"
                display.ctx.lineCap = "round"
                display.ctx.lineWidth = 10
                display.ctx.beginPath()
                display.ctx.moveTo(display.canvas.width / 2, display.canvas.height / 2)
                display.ctx.lineTo(display.canvas.width / 2 + display.point[0], display.canvas.height / 2 + display.point[1])
                console.log(displayName, display.point[0], display.point[1]);
                display.ctx.stroke()
                display.ctx.closePath()
            } catch (_) {

            }
        })
    }
}