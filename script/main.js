/** @type {HTMLCanvasElement} */

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")


canvas.height = 1080
canvas.width = 1920

const whiteTruck = new truck(canvas.width / 2, canvas.height * 1.6 / 4)
const whiteTrailer = new trailer([whiteTruck], canvas.width / 2, canvas.height * 3 / 4, 0)


// DEBUG
const velocityStat = document.getElementById("velocity")
const accelerationStat = document.getElementById("acceleration")
const frictionStat = document.getElementById("friction")
const directionDeltaStat = document.getElementById("directionDelta")
const directionStat = document.getElementById("direction")
const fpsStat = document.getElementById("fps")
const hookedStat = document.getElementById("hooked")
const breakingStat = document.getElementById("breaking")

const velocityTrailerStat = document.getElementById("velocityTrailer")
const frictionTrailerStat = document.getElementById("frictionTrailer")
const directionTrailerStat = document.getElementById("directionTrailer")
const hookedTrailerStat = document.getElementById("hookedTrailer")
const canHookStat = document.getElementById("canHook")
const breakingTrailerStat = document.getElementById("breakingTrailer")
let frameTime = 0
let fps = 0
let i = 0
const DEBUG_frameInfo = (truck, trailer) => {
    fps = Math.floor(1000 / (Date.now() - frameTime))
    frameTime = Date.now()

    if (i > 16) {
        try {
            velocityStat.innerText = "Vel: " + truck.velocity.toFixed(1)
            accelerationStat.innerText = "Acc: " + truck.acceleration.toFixed(1)
            frictionStat.innerText = "Fri: " + truck.friction.toFixed(1)
            directionDeltaStat.innerText = "DirΔ: " + (truck.steerForce).toFixed(5)
            directionStat.innerText = "Dir: " + truck.direction.toFixed(1)
            fpsStat.innerText = "FPS: " + fps
            hookedStat.innerText = "Hooked: " + truck.hooked
            breakingStat.innerText = "Breaking: " + truck.break
            
            velocityTrailerStat.innerText = "Vel: " + trailer.velocity.toFixed(1)
            frictionTrailerStat.innerText = "Fri: " + trailer.friction.toFixed(1)
            directionTrailerStat.innerText = "Dir: " + trailer.direction.toFixed(1)
            hookedTrailerStat.innerText = "Hooked: " + trailer.hooked
            canHookStat.innerText = "Can Hook: " + trailer.canHook
            breakingTrailerStat.innerText = "Breaking: " + trailer.break
        } catch (error) {

        }

        i = 0
    }
    i++
}
// DEBUG

const frame = () => {

    DEBUG_frameInfo(whiteTruck, whiteTrailer)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    whiteTruck.move()
    whiteTruck.draw()

    whiteTrailer.move()
    whiteTrailer.draw()

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