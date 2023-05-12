/** @type {HTMLCanvasElement} */

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.height = 1080
canvas.width = 1920


// DEBUG
const velocityStat = document.getElementById("velocity")
const accelerationStat = document.getElementById("acceleration")
const frictionStat = document.getElementById("friction")
const directionDeltaStat = document.getElementById("directionDelta")
const directionStat = document.getElementById("direction")
const fpsStat = document.getElementById("fps")
const hookedStat = document.getElementById("hooked")
const breakingStat = document.getElementById("breaking")
const hasTrailerStat = document.getElementById("hasTrailer")

const velocityTrailerStat = document.getElementById("velocityTrailer")
const frictionTrailerStat = document.getElementById("frictionTrailer")
const directionTrailerStat = document.getElementById("directionTrailer")
const hookedTrailerStat = document.getElementById("hookedTrailer")
const canHookStat = document.getElementById("canHook")
const breakingTrailerStat = document.getElementById("breakingTrailer")
const deltaAngleStat = document.getElementById("deltaAngle")
const cosStat = document.getElementById("cos")
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
            directionStat.innerText = "Dir: " + truck.direction.toFixed(3)
            fpsStat.innerText = "FPS: " + fps
            hookedStat.innerText = "Hooked: " + truck.hooked
            breakingStat.innerText = "Breaking: " + truck.break
            hasTrailerStat.innerText = "Has Trailer: " + truck.hasTrailer

            velocityTrailerStat.innerText = "Vel: " + trailer.velocity.toFixed(1)
            frictionTrailerStat.innerText = "Fri: " + trailer.friction.toFixed(1)
            directionTrailerStat.innerText = "Dir: " + trailer.direction.toFixed(3)
            hookedTrailerStat.innerText = "Hooked: " + trailer.hooked
            canHookStat.innerText = "Can Hook: " + trailer.canHook
            breakingTrailerStat.innerText = "Breaking: " + trailer.break
            deltaAngleStat.innerHTML = "Δ°: " + trailer.deltaAngle.toFixed(2)
            cosStat.innerText = "cos(Δ°): " + Math.cos(trailer.deltaAngle).toFixed(3)
        } catch (error) {

        }

        i = 0
    }
    i++
}
// DEBUG

const debug = false

let level = new levelOne()

const frame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    
    level.draw()


    if (debug) {
        document.querySelectorAll("#stats p").forEach(stat => {
            stat.style.display = "block"
        })
        DEBUG_frameInfo(whiteTruck, whiteTrailer)
        whiteTrailersSpot.debug()
        whiteTrailer.debug()
        whiteTruck.debug()
    } else {
        document.querySelectorAll("#stats p").forEach(stat => {
            stat.style.display = "none"
        })
    }
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

// window.onbeforeunload = function (event) {
//     return "string"
// };

// welcomePrompt()
// document.addEventListener("click", start)


// DEBUG
window.requestAnimationFrame(frame)