/** @type {HTMLCanvasElement} */

canvas = document.querySelector("canvas")

class trailer {
    constructor(trucks = [], x = canvas.width / 5, y = canvas.height * 3 / 4, direction = 0.5, color = "white") {
        this.ctx = canvas.getContext("2d")

        this.id = Date.now()
        this.trucks = trucks

        this.color = color
        this.width = 115
        this.length = 500

        this.centerX = x
        this.centerY = y
        this.attachPointX = this.centerX
        this.attachPointY = this.centerY - this.length + 150
        this.direction = direction
        this.velocity = 0

        this.breakForce = 80
        this.friction = 10
        this.cargoMass = 0
        this.dryMass = 2000
    }

    roundRect(x, y, w, h) {
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(this.centerX, this.centerY)
        this.ctx.rotate(this.direction)
        this.ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 5)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()
    }


    draw() {
        // DEBUG
        this.direction = this.trucks[0].direction
        // DEBUG

        this.attachPointX = this.centerX + Math.sin(this.direction) * (this.length - 150)
        this.attachPointY = this.centerY - Math.cos(this.direction) * (this.length - 150)

        let x, y, w, h

        // Parking Space
        this.ctx.strokeStyle = "green"
        // this.ctx.strokeStyle = this.color
        this.ctx.lineWidth = 100
        this.ctx.globalAlpha = 0.8
        x = 100
        y = 100
        w = this.width * 1.2
        h = this.height * 1.2
        this.ctx.beginPath()
        this.ctx.roundRect(x, y, w, h)
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.globalAlpha = 1


        // Wheels
        this.ctx.fillStyle = "black"
        x = this.centerX - this.width / 2 - 6
        y = this.centerY + 5
        w = 20
        h = 30
        this.roundRect(x, y, w, h)
        x = this.centerX + this.width / 2 - 14
        y = this.centerY + 5
        this.roundRect(x, y, w, h)
        x = this.centerX - this.width / 2 - 6
        y = this.centerY - 35
        this.roundRect(x, y, w, h)
        x = this.centerX + this.width / 2 - 14
        y = this.centerY - 35
        this.roundRect(x, y, w, h)


        // Back Bumper
        x = this.centerX - this.width / 2
        y = this.centerY + 8 + 50
        w = this.width
        h = 40
        this.ctx.fillStyle = "#505050"
        this.roundRect(x, y, w, h)


        // Cargo Space
        x = this.centerX - this.width / 2
        y = this.centerY - this.length + 40 + 50
        w = this.width
        h = this.length
        this.ctx.fillStyle = this.color
        this.roundRect(x, y, w, h)


        // DEBUG Center Point
        this.ctx.fillStyle = "lightGreen"
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.fill()

        // DEBUG Attach Point
        this.ctx.fillStyle = "orange"
        x = this.attachPointX - this.centerX
        y = this.attachPointY - this.centerY
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(this.centerX, this.centerY)
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()


        // Hook on Trailer Prompt
        this.trucks.forEach(truck => {
            let r = 20
            if (
                truck.hooked == false &&
                truck.centerX < this.attachPointX + r &&
                truck.centerX > this.attachPointX - r &&
                truck.centerY < this.attachPointY + r &&
                truck.centerY > this.attachPointY - r
            ) {
                ctx.fillStyle = "rgba(0,0,0,0.5)"
                ctx.beginPath()
                ctx.roundRect(truck.centerX - 70, truck.centerY - 70, 140, 140, 20)
                ctx.closePath()
                ctx.fill()

                this.ctx.fillStyle = "white"
                this.ctx.textAlign = "center"
                this.ctx.font = "bold 60px sans-serif"
                this.ctx.fillText("H", truck.centerX, truck.centerY + 20)
            }
        })
    }

    move() {
        // Wall collision
        if (this.centerX > canvas.width - 45) { this.centerX = canvas.width - 45; this.velocity = -this.velocity * 0.2 }
        if (this.centerX < 0 + 45) { this.centerX = 0 + 45; this.velocity = -this.velocity * 0.2 }
        if (this.centerY > canvas.height - 45) { this.centerY = canvas.height - 45; this.velocity = -this.velocity * 0.2 }
        if (this.centerY < 0 + 45) { this.centerY = 0 + 45; this.velocity = -this.velocity * 0.2 }


        // Update Friction
        this.friction = 5 + Math.abs(this.velocity) / 2


        // Near 0 Velocity Sets Velocity To 0
        if (Math.abs(this.velocity).toFixed(2) == 0) { this.velocity = 0 }


        // Apply Friction
        else if (this.velocity < 0) { this.velocity += this.friction / this.cargoMass }
        else if (this.velocity > 0) { this.velocity -= this.friction / this.cargoMass }


        // Apply Velocity to Truck Position
        this.centerX += this.velocity * Math.sin(this.direction)
        this.centerY -= this.velocity * Math.cos(this.direction)


        // Breaking
        if (this.break && this.velocity > 0) { this.velocity -= this.breakForce / this.cargoMass }
        if (this.break && this.velocity < 0) { this.velocity += this.breakForce / this.cargoMass }
    }

    save() {
        // Save Data to Local Storage in Case of Unintentional Reload
        const data = {
            centerX: this.centerX,
            centerY: this.centerY,
            direction: this.direction,
            velocity: this.velocity,
        }

        window.localStorage.setItem(this.id, JSON.stringify(data))
    }

    load() {
        return JSON.parse(window.localStorage.getItem(this.id))
    }
}