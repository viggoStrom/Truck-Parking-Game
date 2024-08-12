/** @type {HTMLCanvasElement} */

class parkingSpot {
    constructor(exits, trailer, x = 1 / 2, y = 1 / 2, direction) {
        this.ctx = canvas.getContext("2d")

        this.trailer = trailer
        this.exits = exits

        this.spineLength = this.trailer.spineLength + 120
        this.halfSpineLength = this.spineLength / 2
        this.color = this.trailer.color

        this.direction = direction

        this.centerX = x * canvas.width
        this.centerY = y * canvas.height

        this.hasTrailer = false
    }

    update() {
        this.northX = this.centerX + Math.sin(this.direction) * this.halfSpineLength
        this.northY = this.centerY - Math.cos(this.direction) * this.halfSpineLength

        this.southX = this.centerX - Math.sin(this.direction) * this.halfSpineLength
        this.southY = this.centerY + Math.cos(this.direction) * this.halfSpineLength


        let tcx = this.trailer.centerX, tcy = this.trailer.centerY
        let tax = this.trailer.attachPointX, tay = this.trailer.attachPointY
        let nx = this.northX, ny = this.northY
        let sx = this.southX, sy = this.southY

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
            this.trailer.isParked = true
            this.ctx.strokeStyle = "lightGreen"

            this.exits.forEach(exit => {
                exit.levelFinished = true
            })
        } else {
            this.ctx.strokeStyle = this.color
            this.trailer.isParked = false

            this.exits.forEach(exit => {
                exit.levelFinished = false
            })
        }

    }

    render() {
        let x, y, w, h


        // Parking Space
        this.ctx.lineWidth = 30
        this.ctx.globalAlpha = 0.6
        w = this.trailer.width * 1.3 + Math.sin(Date.now() / 700) * 5
        h = this.trailer.length * 1.01 + Math.sin(Date.now() / 700) * 5
        x = w / -2
        y = h / -2
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(this.centerX, this.centerY)
        this.ctx.rotate(this.direction)
        this.ctx.roundRect(x, y, w, h, 25)
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.restore()
        this.ctx.globalAlpha = 1
    }

    debug() {
        // DEBUG Parking Center
        this.ctx.fillStyle = "lightGreen"
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.fill()

        // DEBUG North Point
        this.ctx.fillStyle = "red"
        this.ctx.beginPath()
        this.ctx.arc(this.northX, this.northY, 20, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.fill()

        // DEBUG South Point
        this.ctx.fillStyle = "blue"
        this.ctx.beginPath()
        this.ctx.arc(this.southX, this.southY, 20, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.fill()
    }
}