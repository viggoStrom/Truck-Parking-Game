/** @type {HTMLCanvasElement} */

canvas = document.querySelector("canvas")


class finish {
    constructor() {
        this.ctx = canvas.getContext("2d")

        this.whiteTruck = new truck(1 / 2, 1 / 4)
        this.whiteTrailer = new trailer([this.whiteTruck], 1 / 2.5, 4 / 6, Math.PI / 2, "white")
        this.whiteTrailersSpot = new parkingSpot([this.exit], this.whiteTrailer, 1 / 2, 2.8 / 4, 0)
    }

    draw() {
        this.ctx.fillStyle = "white"
        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 5
        this.ctx.font = "bold 170px arial"
        this.ctx.fillText("Congrats!", canvas.width / 2, canvas.height / 2)
        this.ctx.strokeText("Congrats!", canvas.width / 2, canvas.height / 2)

        this.whiteTruck.move()
        this.whiteTruck.draw()

        this.whiteTrailer.move()
        this.whiteTrailer.draw()
    }
}