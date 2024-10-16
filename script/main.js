/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("main-canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

canvas.height = 256;
canvas.width = 256;

const ui = new UI();

let level = new Level1();

const update = () => {
    // Level updates all it's children
    level.update();

    window.requestAnimationFrame(update);
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Level renders all it's children
    // level.render(debug = false);
    level.render(debug=true);

    window.requestAnimationFrame(render);
}

const start = (event) => {
    ui.welcome();

    document.addEventListener("click", () => {
        window.requestAnimationFrame(update);
        window.requestAnimationFrame(render);
    }, { once: true });
}

// start();
window.requestAnimationFrame(update);
window.requestAnimationFrame(render);