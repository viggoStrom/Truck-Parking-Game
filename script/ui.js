class UI {
    constructor() {

    }

    welcome() {
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.roundRect(canvas.width / 8, canvas.height / 4, canvas.width * 6 / 8, canvas.height * 4 / 8, 90);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        ctx.font = "bold 70px sans-serif";
        ctx.fillText("Park Your Trailer!", canvas.width / 2, canvas.height / 2);

        ctx.font = "bold 40px sans-serif";
        ctx.fillText("Click to Continue", canvas.width / 2, canvas.height / 2 + 60);
    }

    finish() {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.font = "bold 170px arial";
        ctx.fillText("Congrats!", canvas.width / 2, canvas.height / 2);
        ctx.strokeText("Congrats!", canvas.width / 2, canvas.height / 2);
    }

    hookOn(x, y) {
        ctx.globalAlpha = 0.7;

        // Background
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.roundRect(x - 20, y - 20, 40, 40, 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("H", x, y + 8);

        ctx.globalAlpha = 1;
    }
}