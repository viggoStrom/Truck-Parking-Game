/** @type {HTMLCanvasElement} */

canvas = document.querySelector("canvas")

class truck {
    constructor() {
        this.ctx = canvas.getContext("2d")

        this.color = "white"
        this.cabWidth = 100
        this.cabLength = 75
        this.width = 95
        this.length = 220
        this.widthDelta = (this.cabWidth - this.width) / 2

        this.centerX = canvas.width / 2
        this.centerY = canvas.height * 5 / 6
        this.direction = 0
        this.velocity = 0
        this.steerVelocity = 0

        this.acceleration = 30
        this.breakForce = 40
        this.steerForce = 0.0002
        this.friction = 5
        this.mass = 2000

        this.steerForceEq = (x) => {
            x = Math.abs(x)
            if (x < 35) {
                return 0.00765927 * x ** 1 - 0.0025005 * x ** 2 + 0.00037747 * x ** 3 - 0.0000321652 * x ** 4 + 0.00000167361 * x ** 5 - 5.4962 * 10 ** -8 * x ** 6 + 1.1467 * 10 ** -9 * x ** 7 - 1.4986 * 10 ** -11 * x ** 8 + 1.1869 * 10 ** -13 * x ** 9 - 5.402 * 10 ** -16 * x ** 10 + 1.2831 * 10 ** -18 * x ** 11 - 1.2244 * 10 ** -21 * x ** 12
            } else {
                return 0.003 + 1 / (50 * x)
            }
        }

        const inputDownKeys = document.addEventListener("keydown", key => {
            if (key.key == "w") { this.forward = true }
            if (key.key == "s") { this.backward = true }
            if (key.key == "d") { this.rightTurn = true }
            if (key.key == "a") { this.leftTurn = true }
            if (key.key == " ") { this.break = true; key.preventDefault() }
        })
        const inputUpKeys = document.addEventListener("keyup", key => {
            if (key.key == "w") { this.forward = false }
            if (key.key == "s") { this.backward = false }
            if (key.key == "d") { this.rightTurn = false }
            if (key.key == "a") { this.leftTurn = false }
            if (key.key == " ") { this.break = false; key.preventDefault() }
        })
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
        let x, y, w, h

        // Wheels



        // Tractor Unit
        this.ctx.fillStyle = "#505050"
        x = this.centerX - this.cabWidth / 2 + this.widthDelta
        y = this.centerY - this.length / 2 - 45
        w = this.width
        h = this.length
        this.roundRect(x, y, w, h)


        // Cab
        this.ctx.fillStyle = this.color
        x = this.centerX - (this.cabWidth / 2)
        y = this.centerY - this.length / 2 - 45
        w = this.cabWidth
        h = this.cabLength
        this.roundRect(x, y, w, h)


        // Center Point for Debug
        this.ctx.fillStyle = "lightGreen"
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.fill()
    }

    move() {
        // Wall collision
        if (this.centerX > canvas.width) { this.centerX = canvas.width; this.velocity = 0 }
        if (this.centerX < 0) { this.centerX = 0; this.velocity = 0 }
        if (this.centerY > canvas.height) { this.centerY = canvas.height; this.velocity = 0 }
        if (this.centerY < 0) { this.centerY = 0; this.velocity = 0 }

        // Update Friction
        this.friction = 5 + Math.abs(this.velocity) / 2

        // Near 0 Velocity Sets Velocity To 0
        if (Math.abs(this.velocity).toFixed(2) == 0) { this.velocity = 0 }

        // Apply Friction
        else if (this.velocity < 0) { this.velocity += this.friction / this.mass }
        else if (this.velocity > 0) { this.velocity -= this.friction / this.mass }

        // Apply Acceleration
        if (this.forward) { this.velocity += this.acceleration / this.mass }
        if (this.backward) { this.velocity -= this.acceleration / this.mass / 2 }

        // Apply Velocity to Truck Position
        this.centerX += this.velocity * Math.sin(this.direction)
        this.centerY -= this.velocity * Math.cos(this.direction)

        // Breaking
        if (this.break && this.velocity > 0) { this.velocity -= this.breakForce / this.mass }
        if (this.break && this.velocity < 0) { this.velocity += this.breakForce / this.mass }

        // Steering
        this.steerForce = this.steerForceEq(this.velocity)
        if (this.rightTurn && this.velocity > 0) { this.direction += this.steerForce }
        if (this.rightTurn && this.velocity < 0) { this.direction -= this.steerForce }
        if (this.leftTurn && this.velocity > 0) { this.direction -= this.steerForce }
        if (this.leftTurn && this.velocity < 0) { this.direction += this.steerForce }
    }
}