/** @type {HTMLCanvasElement} */

canvas = document.querySelector("canvas")

class truck {
    constructor(x = canvas.width / 2, y = canvas.height * 3 / 4, direction = 0) {
        this.ctx = canvas.getContext("2d")

        this.id = Date.now()

        this.color = "white"
        this.cabWidth = 100
        this.cabLength = 85
        this.width = 95
        this.length = 220
        this.widthDelta = (this.cabWidth - this.width) / 2

        this.centerX = x
        this.centerY = y
        this.direction = direction
        this.velocity = 0

        this.acceleration = 60
        this.breakForce = 80
        this.steerForce = 0.0002
        this.friction = 10
        this.mass = 2000
        this.hooked = false
        this.hasTrailer = false


        const inputDownKeys = document.addEventListener("keydown", event => {
            let key = event.key.toLowerCase()
            if (event.ctrlKey && key != "r") { event.preventDefault() }
            if (key == "w") { this.forward = true }
            if (key == "s") { this.backward = true }
            if (key == "d") { this.rightTurn = true }
            if (key == "a") { this.leftTurn = true }
            if (key == "h") { this.hooked = !this.hooked }
            if (key == " ") { this.break = true; event.preventDefault() }
        })
        const inputUpKeys = document.addEventListener("keyup", event => {
            let key = event.key.toLowerCase()
            if (key == "w") { this.forward = false }
            if (key == "s") { this.backward = false }
            if (key == "d") { this.rightTurn = false }
            if (key == "a") { this.leftTurn = false }
            if (key == " ") { this.break = false; event.preventDefault() }
        })

        // window.onbeforeunload = function (event) {
        //     this.save()
        // };
    }

    steerForceEq = (x) => {
        x = Math.abs(x)
        if (x < 35) {
            return 0.00765927 * x ** 1 - 0.0025005 * x ** 2 + 0.00037747 * x ** 3 - 0.0000321652 * x ** 4 + 0.00000167361 * x ** 5 - 5.4962 * 10 ** -8 * x ** 6 + 1.1467 * 10 ** -9 * x ** 7 - 1.4986 * 10 ** -11 * x ** 8 + 1.1869 * 10 ** -13 * x ** 9 - 5.402 * 10 ** -16 * x ** 10 + 1.2831 * 10 ** -18 * x ** 11 - 1.2244 * 10 ** -21 * x ** 12
        } else {
            return 0.003 + 1 / (50 * x)
        }
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

    wheel(x, y, w, h) {
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(this.centerX, this.centerY)
        this.ctx.rotate(this.direction)
        // this.ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 5)
        this.ctx.restore()
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.rotate(this.direction * 1.3)
        this.ctx.roundRect(this.centerX - x - 58, this.centerY - y - 150, w, h, 5)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()
    }

    draw() {
        let x, y, w, h

        // Wheels
        x = this.centerX - this.cabWidth / 2 - 8
        y = this.centerY - 130 - 20
        w = 20
        h = 30
        this.ctx.fillStyle = "black"
        this.roundRect(x, y, w, h)
        x = this.centerX + this.cabWidth / 2 - 12
        y = this.centerY - 130 - 20
        this.roundRect(x, y, w, h)
        x = this.centerX - this.cabWidth / 2 - 6
        y = this.centerY - 10 - 20
        this.roundRect(x, y, w, h)
        x = this.centerX + this.cabWidth / 2 - 14
        y = this.centerY - 10 - 20
        this.roundRect(x, y, w, h)
        x = this.centerX - this.cabWidth / 2 - 6
        y = this.centerY + 30 - 20
        this.roundRect(x, y, w, h)
        x = this.centerX + this.cabWidth / 2 - 14
        y = this.centerY + 30 - 20
        this.roundRect(x, y, w, h)


        // Tractor Unit
        x = this.centerX - this.cabWidth / 2 + this.widthDelta
        y = this.centerY - this.length / 2 - 65
        w = this.width
        h = this.length
        this.ctx.fillStyle = "#505050"
        this.roundRect(x, y, w, h)


        // Cab
        x = this.centerX - (this.cabWidth / 2)
        y = this.centerY - this.length / 2 - 65
        w = this.cabWidth
        h = this.cabLength
        this.ctx.fillStyle = this.color
        this.roundRect(x, y, w, h)


        // DEBUG Center Point
        this.ctx.fillStyle = "lightGreen"
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.fill()
    }

    move() {
        // Update Front Collider  
        this.spineLength = this.length - 150
        this.frontColliderX = this.centerX + Math.sin(this.direction) * this.spineLength
        this.frontColliderY = this.centerY - Math.cos(this.direction) * this.spineLength


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

    checkIfHooked() {
        if (!this.hasTrailer) { this.hooked = false }
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