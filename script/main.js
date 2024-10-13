/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");

canvas.height = 1080;
canvas.width = 1080;

let level = new Level1();

const update = () => {
    // Level updates all it's children
    level.update();

    window.requestAnimationFrame(update);
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Level renders all it's children
    level.render();

    window.requestAnimationFrame(render);
}

const start = (event) => {
    document.removeEventListener("click", start);
    document.removeEventListener("keydown", start);

    window.requestAnimationFrame(update);
    window.requestAnimationFrame(render);
}

start();