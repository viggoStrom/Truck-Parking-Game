/** @type {HTMLCanvasElement} */

canvas = document.querySelector("canvas")


class exit {
    constructor(nextLevel, trucks, x = 1, y = 1 / 2, direction = Math.PI) {
        this.ctx = canvas.getContext("2d")

        this.trucks = trucks

        this.centerX = x * canvas.width
        this.centerY = y * canvas.height
        this.direction = direction

        this.gap = 230

        this.levelFinished = false
        this.nextLevel = false

        this.level = nextLevel
    }

    draw() {
        let x, y, w, h


        // Glow
        w = 130
        h = 220
        x = this.centerX - w / 2
        y = this.centerY - h / 2
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(this.centerX, this.centerY)
        this.ctx.rotate(this.direction)
        const gradient = this.ctx.createLinearGradient(-this.centerX + x - w, -this.centerY + y, -this.centerX + x + w, -this.centerY + y)
        if (this.levelFinished) {
            gradient.addColorStop(0, "green")
            gradient.addColorStop(1, "rgba(0,255,0,0.05)")
        } else {
            gradient.addColorStop(0, "red")
            gradient.addColorStop(1, "rgba(255,0,0,0.05)")
        }
        this.ctx.fillStyle = gradient
        this.ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 4)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()


        // Frame
        w = 30
        h = 230
        x = this.centerX - w / 2
        y = this.centerY - h / 2
        this.ctx.fillStyle = "darkGray"
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(this.centerX, this.centerY)
        this.ctx.rotate(this.direction)
        this.ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 5)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()
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
                truck.centerX -= Math.cos(this.direction)
                truck.centerY -= Math.sin(this.direction)

                this.nextLevel = true
            }
        })
    }

    nextLevelCheck() {
        if (this.nextLevel) {
            return this.level
        }
        else {
            return null
        }
    }
}