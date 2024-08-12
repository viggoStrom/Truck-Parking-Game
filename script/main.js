/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("main")
const ctx = canvas.getContext("2d")

canvas.height = 1080
canvas.width = 1920

const dashboard = new Dashboard()

// let level = new finish()
let level = new levelOne()

const update = () => {
    level.update()

    dashboard.update()

    window.requestAnimationFrame(update)
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    level.render()
    // if (!(level instanceof finish) && level.exit.nextLevelCheck() != null) {
    //     level = level.exit.nextLevelCheck()
    // }
    dashboard.render()

    window.requestAnimationFrame(render)
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
    document.removeEventListener("keydown", start)

    window.requestAnimationFrame(update)
    window.requestAnimationFrame(render)
}

// window.onbeforeunload = function (event) {
//     return "string"
// };

// welcomePrompt()
// document.addEventListener("click", start)
// document.addEventListener("keydown", start)
start()


// // DEBUG
// window.requestAnimationFrame(frame)