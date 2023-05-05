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

    window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame)