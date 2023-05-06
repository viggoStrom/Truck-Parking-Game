/** @type {HTMLCanvasElement} */

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const velocityStat = document.getElementById("velocity")
const accelerationStat = document.getElementById("acceleration")
const frictionStat = document.getElementById("friction")
const directionDeltaStat = document.getElementById("directionDelta")
const directionStat = document.getElementById("direction")
const fpsStat = document.getElementById("fps")

canvas.height = 1080
canvas.width = 1920

const whiteTruck = new truck()
const blueTrailer = new trailer([whiteTruck])

// DEBUG
let frameTime = 0
let fps = 0
let i = 0
const DEBUG_frameInfo = (truck) => {
    fps = Math.floor(1000 / (Date.now() - frameTime))
    frameTime = Date.now()

    if (i > 20) {
        velocityStat.innerText = "Vel: " + truck.velocity.toFixed(1)
        accelerationStat.innerText = "Acc: " + truck.acceleration.toFixed(1)
        frictionStat.innerText = "Fri: " + truck.friction.toFixed(1)
        directionDeltaStat.innerText = "DirΔ: " + (truck.steerForce).toFixed(5)
        directionStat.innerText = "Dir: " + truck.direction.toFixed(1)
        fpsStat.innerText = "FPS: " + fps

        i = 0
    }
    i++
}
// DEBUG

const frame = () => {

    DEBUG_frameInfo(whiteTruck)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    whiteTruck.move()
    whiteTruck.draw()

    blueTrailer.move()
    blueTrailer.draw()

    window.requestAnimationFrame(frame)
}

const welcomePrompt = () => {
    ctx.fillStyle = "black"
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.roundRect(canvas.width / 4, canvas.height / 4, canvas.width * 2 / 4, canvas.height * 2 / 4, 90)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.textAlign = "center"
    ctx.fillStyle = "white"

    ctx.font = "bold 70px sans-serif"
    ctx.fillText("Park Your Trailer!", canvas.width / 2, canvas.height / 2)

    ctx.font = "bold 40px sans-serif"
    ctx.fillText("Click to Continue", canvas.width / 2, canvas.height / 2 + 60)
}

const start = (event) => {
    document.removeEventListener("click", start)

    window.requestAnimationFrame(frame)
}

// welcomePrompt()
// document.addEventListener("click", start)


// DEBUG
window.requestAnimationFrame(frame)