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
        this.spineLength = this.length - 150

        this.centerX = x
        this.centerY = y
        this.attachPointX = this.centerX
        this.attachPointY = this.centerY - this.length + 150
        this.direction = direction
        this.velocity = 0
        this.break = false

        this.hooked = false
        this.hookedBy = ""
        this.canHook = true

        this.breakForce = 80
        this.friction = 10
        this.cargoMass = 0
        this.dryMass = 2000

        const inputDownKeys = document.addEventListener("keydown", event => {
            let key = event.key.toLowerCase()
            trucks.forEach(truck => {
                if (key == " " && truck.id == this.hookedBy) { this.break = true; event.preventDefault() }
            })
        })
        const inputUpKeys = document.addEventListener("keyup", event => {
            let key = event.key.toLowerCase()
            trucks.forEach(truck => {
                if (key == " ") { this.break = false; event.preventDefault() }
            })
        })

        // window.onbeforeunload = function (event) {
        //     this.save()
        // };
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

        // Parking Space
        // this.ctx.strokeStyle = "green"
        // // this.ctx.strokeStyle = this.color
        // this.ctx.lineWidth = 100
        // this.ctx.globalAlpha = 0.8
        // x = 100
        // y = 100
        // w = this.width * 1.2
        // h = this.height * 1.2
        // this.ctx.beginPath()
        // this.ctx.roundRect(x, y, w, h)
        // this.ctx.closePath()
        // this.ctx.stroke()
        // this.ctx.globalAlpha = 1


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


        // Can Hook Prompt
        if (this.canHook == true) {
            ctx.fillStyle = "rgba(0,0,0,0.5)"
            ctx.beginPath()
            ctx.roundRect(this.attachPointX - 70, this.attachPointY - 70, 140, 140, 20)
            ctx.closePath()
            ctx.fill()

            this.ctx.fillStyle = "white"
            this.ctx.textAlign = "center"
            this.ctx.font = "bold 60px sans-serif"
            this.ctx.fillText("H", this.attachPointX, this.attachPointY + 20)
        }
    }

    move() {
        // Update Attach Points 
        this.spineLength = this.length - 150
        this.attachPointX = this.centerX + Math.sin(this.direction) * this.spineLength
        this.attachPointY = this.centerY - Math.cos(this.direction) * this.spineLength


        // Wall collision
        if (this.centerX > canvas.width - 45) { this.centerX = canvas.width - 45; this.velocity = -this.velocity * 0.2 }
        if (this.centerX < 0 + 45) { this.centerX = 0 + 45; this.velocity = -this.velocity * 0.2 }
        if (this.centerY > canvas.height - 45) { this.centerY = canvas.height - 45; this.velocity = -this.velocity * 0.2 }
        if (this.centerY < 0 + 45) { this.centerY = 0 + 45; this.velocity = -this.velocity * 0.2 }

        if (this.attachPointX > canvas.width - 45) { this.velocity = -this.velocity * 0.2 }
        if (this.attachPointX < 0 + 45) { this.velocity = -this.velocity * 0.2 }
        if (this.attachPointY > canvas.height - 45) { this.velocity = -this.velocity * 0.2 }
        if (this.attachPointY < 0 + 45) { this.velocity = -this.velocity * 0.2 }


        // Update Friction
        this.trucks.forEach(truck => {
            if (this.hooked && truck.id == this.hookedBy) {
                this.friction = truck.friction
            }
            else {
                this.friction = 5 + Math.abs(this.velocity) / 2
            }
        })


        // Near 0 Velocity Sets Velocity To 0
        if (Math.abs(this.velocity).toFixed(2) == 0) { this.velocity = 0 }


        // Apply Friction
        else if (this.velocity < 0) { this.velocity += this.friction / (this.cargoMass + this.dryMass) }
        else if (this.velocity > 0) { this.velocity -= this.friction / (this.cargoMass + this.dryMass) }


        // Apply Velocity to Truck Position
        this.centerX += this.velocity * Math.sin(this.direction)
        this.centerY -= this.velocity * Math.cos(this.direction)


        // Calculate Velocity
        this.trucks.forEach(truck => {
            if (this.hooked && truck.id == this.hookedBy) {
                const deltaX = truck.centerX - this.centerX
                const deltaY = truck.centerY - this.centerY
                const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
                const deltaAngle = this.direction - truck.direction
                const deadZone = 0.05

                if (Math.abs(distance - this.spineLength) < deadZone) {
                    this.velocity = truck.velocity * Math.cos(deltaAngle)
                }
                if (distance > this.spineLength && (truck.velocity > deadZone || truck.velocity < deadZone)) {
                    // this.velocity += 0.02 + (truck.velocity / 70) * Math.cos(deltaAngle)
                    this.velocity += 0.07 + (truck.velocity / 70) * Math.cos(deltaAngle)
                }
                if (distance < this.spineLength && (truck.velocity > deadZone || truck.velocity < deadZone)) {
                    // this.velocity -= 0.04 - (truck.velocity / 70) * Math.cos(deltaAngle)
                    this.velocity -= 0.07 + (truck.velocity / 70) * Math.cos(deltaAngle)
                }
                if (Math.abs(distance - this.spineLength) > 50) {
                    this.hookOff(truck)
                }
            }
        })


        // Breaking
        this.trucks.forEach(truck => {
            if (truck.id == this.hookedBy && truck.break && this.velocity > 0) { this.velocity -= this.breakForce / (this.cargoMass + this.dryMass); }
            if (truck.id == this.hookedBy && truck.break && this.velocity < 0) { this.velocity += this.breakForce / (this.cargoMass + this.dryMass); }
        })


        // Hook on Trailer
        this.trucks.forEach(truck => {
            let r = 20
            this.canHook = false
            if (
                truck.hooked == false &&
                this.hooked == false &&
                // !(this.direction + (Math.PI / 2 - truck.direction) > 3.6 ||
                //     this.direction + (Math.PI / 2 - truck.direction) < -0.5) &&
                truck.centerX < this.attachPointX + r &&
                truck.centerX > this.attachPointX - r &&
                truck.centerY < this.attachPointY + r &&
                truck.centerY > this.attachPointY - r
            ) {
                // Prompt to Hook up Trailer
                this.canHook = true
            }
            else if (
                truck.id == this.hookedBy &&
                truck.hooked == false &&
                this.hooked == true &&
                truck.centerX < this.attachPointX + r &&
                truck.centerX > this.attachPointX - r &&
                truck.centerY < this.attachPointY + r &&
                truck.centerY > this.attachPointY - r
            ) {
                this.hookOff(truck)
            }
            else if (
                truck.id != this.hookedBy &&
                truck.hooked == true &&
                this.hooked == false &&
                truck.centerX < this.attachPointX + r &&
                truck.centerX > this.attachPointX - r &&
                truck.centerY < this.attachPointY + r &&
                truck.centerY > this.attachPointY - r
            ) {
                // Hooks Trailer
                this.hookOn(truck)
            }

            truck.checkIfHooked()
        })


        // Turn to Truck
        this.trucks.forEach(truck => {
            if (this.hooked && truck.id == this.hookedBy) {
                const deltaX = truck.centerX - this.centerX
                const deltaY = this.centerY - truck.centerY
                const c = Math.sqrt(deltaX ** 2 + deltaY ** 2)

                if (truck.centerX > this.centerX) {
                    this.direction = -Math.asin(deltaY / c) + Math.PI / 2
                } else {
                    this.direction = Math.asin(deltaY / c) - Math.PI / 2
                }

                // Unhook if Angle is too Sharp
                const deltaAngle = this.direction + (Math.PI / 2 - truck.direction)
                if (deltaAngle > 3.6 || deltaAngle < -0.5) {
                    this.hookOff(truck)
                }
            }
        })
    }

    hookOn(truck) {
        this.hooked = true
        this.hookedBy = truck.id
        truck.mass += (this.cargoMass + this.dryMass)
        truck.hasTrailer = true
    }

    hookOff(truck) {
        this.hooked = false
        this.hookedBy = ""
        truck.mass -= (this.cargoMass + this.dryMass)
        truck.hasTrailer = false
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