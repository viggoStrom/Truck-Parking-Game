/** @type {HTMLCanvasElement} */

class Truck {
    constructor(x = 1 / 2, y = 3 / 4, direction = 0) {
        this.id = Date.now() + Math.random();

        this.direction = direction;
        this.steerAngle = 0;

        this.color = "white";
        this.cabWidth = 100;
        this.cabLength = 85;
        this.width = 95;
        this.length = 220;
        this.widthOffset = (this.cabWidth - this.width) / 2;

        this.centerX = x * canvas.width;
        this.centerY = y * canvas.height;

        this.velocity = 0;
        this.acceleration = 60;
        this.breakForce = 80;
        this.steerForce = 0.0002;
        this.friction = 10;
        this.mass = 2000;
        this.originalMass = 2000;

        this.hooked = false;
        this.hasTrailer = false;

        this.initInput();

        // window.onbeforeunload = function (event) {
        //     this.save()
        // };
    }

    initInput() {
        const inputDownKeys = document.addEventListener("keydown", event => {
            let key = event.key.toLowerCase();

            if (event.ctrlKey && key != "r") { event.preventDefault(); }
            if (key == "w" || key == "arrowup") { this.forward = true; event.preventDefault(); }
            if (key == "s" || key == "arrowdown") { this.backward = true; event.preventDefault(); }
            if (key == "d" || key == "arrowright") { this.rightTurn = true; }
            if (key == "a" || key == "arrowleft") { this.leftTurn = true; }
            if (key == "h") { this.hooked = !this.hooked }
            if (key == " ") { this.break = true; event.preventDefault(); }
        });

        const inputUpKeys = document.addEventListener("keyup", event => {
            let key = event.key.toLowerCase();

            if (key == "w" || key == "arrowup") { this.forward = false; event.preventDefault(); }
            if (key == "s" || key == "arrowdown") { this.backward = false; event.preventDefault(); }
            if (key == "d" || key == "arrowright") { this.rightTurn = false; }
            if (key == "a" || key == "arrowleft") { this.leftTurn = false; }
            if (key == " ") { this.break = false; event.preventDefault(); }
        });
    }

    steerForceEq(x) {
        x = Math.abs(x)
        if (x < 35) {
            return 0.00765927 * x ** 1 - 0.0025005 * x ** 2 + 0.00037747 * x ** 3 - 0.0000321652 * x ** 4 + 0.00000167361 * x ** 5 - 5.4962 * 10 ** -8 * x ** 6 + 1.1467 * 10 ** -9 * x ** 7 - 1.4986 * 10 ** -11 * x ** 8 + 1.1869 * 10 ** -13 * x ** 9 - 5.402 * 10 ** -16 * x ** 10 + 1.2831 * 10 ** -18 * x ** 11 - 1.2244 * 10 ** -21 * x ** 12;
        } else {
            return 0.003 + 1 / (50 * x);
        }
    }

    roundRect(x, y, w, h) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.direction);
        ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    wheel(x, y, w, h) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.direction);
        // ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 5);
        ctx.restore();
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.direction * 1.3);
        ctx.roundRect(this.centerX - x - 58, this.centerY - y - 150, w, h, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }


    update() {

    }

    render() {
        let x, y, w, h;

        // Wheels
        x = this.centerX - this.cabWidth / 2 - 8;
        y = this.centerY - 130 - 20;
        w = 20;
        h = 30;
        ctx.fillStyle = "black";
        this.roundRect(x, y, w, h);
        x = this.centerX + this.cabWidth / 2 - 12;
        y = this.centerY - 130 - 20;
        this.roundRect(x, y, w, h);
        x = this.centerX - this.cabWidth / 2 - 6;
        y = this.centerY - 10 - 20;
        this.roundRect(x, y, w, h);
        x = this.centerX + this.cabWidth / 2 - 14;
        y = this.centerY - 10 - 20;
        this.roundRect(x, y, w, h);
        x = this.centerX - this.cabWidth / 2 - 6;
        y = this.centerY + 30 - 20;
        this.roundRect(x, y, w, h);
        x = this.centerX + this.cabWidth / 2 - 14;
        y = this.centerY + 10;
        this.roundRect(x, y, w, h);


        // Tractor Unit
        x = this.centerX - this.cabWidth / 2 + this.widthOffset;
        y = this.centerY - this.length / 2 - 65;
        w = this.width;
        h = this.length;
        ctx.fillStyle = "#505050";
        this.roundRect(x, y, w, h);

        // Attach Point
        w = 35;
        h = 50;
        x = this.centerX;
        y = this.centerY;
        ctx.fillStyle = "gray";
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.direction);

        ctx.moveTo(x - w / 2 + 5 - this.centerX, y + h / 2 - this.centerY);
        ctx.lineTo(x + w / 2 - 5 - this.centerX, y + h / 2 - this.centerY);
        ctx.lineTo(x + w / 2 - this.centerX, y - this.centerY);
        ctx.lineTo(x - w / 2 - this.centerX, y - this.centerY);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - this.centerX, y - this.centerY + 1, w / 2, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.fillRect(x - w / 6 - this.centerX, y - h / 25 - this.centerY, w / 3, h * 0.545);
        ctx.beginPath();
        ctx.arc(x - this.centerX, y - this.centerY, w / 6, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Cab
        x = this.centerX - this.cabWidth / 2;
        y = this.centerY - this.length / 2 - 65;
        w = this.cabWidth;
        h = this.cabLength;
        ctx.fillStyle = this.color;
        this.roundRect(x, y, w, h);


        // Windshield
        w = this.width * .95;
        h = 15;
        x = this.centerX - w / 2;
        y = this.centerY - this.length * .8;
        ctx.fillStyle = "#212121";
        this.roundRect(x, y, w, h);
    }

    move() {
        // Update Front Collider  
        this.spineLength = this.length - 95;
        this.frontColliderX = this.centerX + Math.sin(this.direction) * this.spineLength;
        this.frontColliderY = this.centerY - Math.cos(this.direction) * this.spineLength;

        // Wall collision
        if (this.centerX > canvas.width - 45) { this.centerX = canvas.width - 45; this.velocity = -this.velocity * 0.2 };
        if (this.centerX < 45) { this.centerX = 45; this.velocity = -this.velocity * 0.2 };
        if (this.centerY > canvas.height - 45) { this.centerY = canvas.height - 45; this.velocity = -this.velocity * 0.2 };
        if (this.centerY < 45) { this.centerY = 45; this.velocity = -this.velocity * 0.2 };

        if (this.frontColliderX > canvas.width - 45) { this.velocity = -this.velocity * 0.2; this.centerX = canvas.width - 45 - this.spineLength * Math.sin(this.direction); };
        if (this.frontColliderX < 45) { this.velocity = -this.velocity * 0.2; this.centerX = 45 - this.spineLength * Math.sin(this.direction); };
        if (this.frontColliderY > canvas.height - 45) { this.velocity = -this.velocity * 0.2; this.centerY = canvas.height - 45 + this.spineLength * Math.cos(this.direction); };
        if (this.frontColliderY < 45) { this.velocity = -this.velocity * 0.2; this.centerY = 45 + this.spineLength * Math.cos(this.direction); };

        // Update Friction
        this.friction = 5 + Math.abs(this.velocity) / 2;

        // Near 0 Velocity Sets Velocity To 0
        if (Math.abs(this.velocity).toFixed(2) == 0) { this.velocity = 0; }

        // Apply Friction
        else if (this.velocity < 0) { this.velocity += this.friction / this.mass; }
        else if (this.velocity > 0) { this.velocity -= this.friction / this.mass; }

        // Apply Acceleration
        if (this.forward) { this.velocity += this.acceleration / this.mass; }
        if (this.backward) { this.velocity -= this.acceleration / this.mass / 2; }

        // Apply Velocity to Truck Position
        this.centerX += this.velocity * Math.sin(this.direction);
        this.centerY -= this.velocity * Math.cos(this.direction);

        // Breaking
        if (this.break && this.velocity > 0) { this.velocity -= this.breakForce / this.mass; }
        if (this.break && this.velocity < 0) { this.velocity += this.breakForce / this.mass; }

        // Steering
        this.steerForce = this.steerForceEq(this.velocity)
        if (this.rightTurn && this.velocity > 0) { this.direction += this.steerForce; }
        if (this.rightTurn && this.velocity < 0) { this.direction -= this.steerForce; }
        if (this.leftTurn && this.velocity > 0) { this.direction -= this.steerForce; }
        if (this.leftTurn && this.velocity < 0) { this.direction += this.steerForce; }
    }

    save() {
        // Save Data to Local Storage in Case of Unintentional Reload
        const data = {
            centerX: this.centerX,
            centerY: this.centerY,
            direction: this.direction,
            velocity: this.velocity,
        };

        window.localStorage.setItem(this.id, JSON.stringify(data));
    }

    load() {
        return JSON.parse(window.localStorage.getItem(this.id));
    }

    debug() {
        let x, y, w, h;

        // DEBUG Center Point
        ctx.fillStyle = "lightGreen";
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // DEBUG Front Collider
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.frontColliderX, this.frontColliderY, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // DEBUG Velocity Vector
        if (this.break) {
            ctx.strokeStyle = "red";
        } else {
            ctx.strokeStyle = "blue";
        }
        ctx.lineWidth = 20;
        x = this.centerX;
        y = this.centerY;
        w = this.centerX + Math.sin(this.direction) * this.velocity * 100;
        h = this.centerY - Math.cos(this.direction) * this.velocity * 100;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.stroke();
    }
}