class Truck {
    constructor(level, fractionPosX, fractionPosY, direction = 0, color = "white") {
        this.id = Math.floor(Date.now() * Math.random());

        this.direction = direction;
        this.steerAngle = 0;

        this.color = "white";
        this.cab = {
            width: 100,
            length: 85,
        };
        this.width = 95;
        this.length = 220;
        this.widthOffset = (this.cab.width - this.width) / 2;
        this.center = {
            x: fractionPosX * canvas.width,
            y: fractionPosY * canvas.height,
        };

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
    }

    initInput() {
        this.keydownListener = document.addEventListener("keydown", event => {
            let key = event.key.toLowerCase();

            // Prevent undesired browser behavior
            if (event.ctrlKey && key != "r") { event.preventDefault(); } // Reload
            if (event.ctrlKey && key != "w") { event.preventDefault(); } // Close Tab

            if (key == "w" || key == "arrowup") { this.forward = true; event.preventDefault(); }
            if (key == "s" || key == "arrowdown") { this.backward = true; event.preventDefault(); }
            if (key == "d" || key == "arrowright") { this.rightTurn = true; }
            if (key == "a" || key == "arrowleft") { this.leftTurn = true; }
            if (key == "h") { this.hooked = !this.hooked }
            if (key == " ") { this.break = true; event.preventDefault(); }
        });

        this.keyupListener = document.addEventListener("keyup", event => {
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
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.direction);
        ctx.roundRect(x - this.center.x, y - this.center.y, w, h, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    wheel(x, y, w, h) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.direction);
        // ctx.roundRect(x - this.centerX, y - this.centerY, w, h, 5);
        ctx.restore();
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.direction * 1.3);
        ctx.roundRect(this.center.x - x - 58, this.center.y - y - 150, w, h, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }


    update() {
        this.move();
    }

    render() {
        let x, y, w, h;

        // Wheels
        x = this.center.x - this.cab.width / 2 - 8;
        y = this.center.y - 130 - 20;
        w = 20;
        h = 30;
        ctx.fillStyle = "black";
        this.roundRect(x, y, w, h);
        x = this.center.x + this.cab.width / 2 - 12;
        y = this.center.y - 130 - 20;
        this.roundRect(x, y, w, h);
        x = this.center.x - this.cab.width / 2 - 6;
        y = this.center.y - 10 - 20;
        this.roundRect(x, y, w, h);
        x = this.center.x + this.cab.width / 2 - 14;
        y = this.center.y - 10 - 20;
        this.roundRect(x, y, w, h);
        x = this.center.x - this.cab.width / 2 - 6;
        y = this.center.y + 30 - 20;
        this.roundRect(x, y, w, h);
        x = this.center.x + this.cab.width / 2 - 14;
        y = this.center.y + 10;
        this.roundRect(x, y, w, h);


        // Tractor Unit
        x = this.center.x - this.cab.width / 2 + this.widthOffset;
        y = this.center.y - this.length / 2 - 65;
        w = this.width;
        h = this.length;
        ctx.fillStyle = "#505050";
        this.roundRect(x, y, w, h);

        // Attach Point
        w = 35;
        h = 50;
        x = this.center.x;
        y = this.center.y;
        ctx.fillStyle = "gray";
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.direction);

        ctx.moveTo(x - w / 2 + 5 - this.center.x, y + h / 2 - this.center.y);
        ctx.lineTo(x + w / 2 - 5 - this.center.x, y + h / 2 - this.center.y);
        ctx.lineTo(x + w / 2 - this.center.x, y - this.center.y);
        ctx.lineTo(x - w / 2 - this.center.x, y - this.center.y);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - this.center.x, y - this.center.y + 1, w / 2, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.fillRect(x - w / 6 - this.center.x, y - h / 25 - this.center.y, w / 3, h * 0.545);
        ctx.beginPath();
        ctx.arc(x - this.center.x, y - this.center.y, w / 6, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Cab
        x = this.center.x - this.cab.width / 2;
        y = this.center.y - this.length / 2 - 65;
        w = this.cab.width;
        h = this.cab.length;
        ctx.fillStyle = this.color;
        this.roundRect(x, y, w, h);


        // Windshield
        w = this.width * .95;
        h = 15;
        x = this.center.x - w / 2;
        y = this.center.y - this.length * .8;
        ctx.fillStyle = "#212121";
        this.roundRect(x, y, w, h);
    }

    move() {
        // Update Front Collider  
        this.spineLength = this.length - 95;
        this.frontCollider = {
            x: this.center.x + Math.sin(this.direction) * this.spineLength,
            y: this.center.y - Math.cos(this.direction) * this.spineLength,
        };

        // Wall collision
        if (this.center.x > canvas.width - 45) { this.center.x = canvas.width - 45; this.velocity = -this.velocity * 0.2 };
        if (this.center.x < 45) { this.center.x = 45; this.velocity = -this.velocity * 0.2 };
        if (this.center.y > canvas.height - 45) { this.center.y = canvas.height - 45; this.velocity = -this.velocity * 0.2 };
        if (this.center.y < 45) { this.center.y = 45; this.velocity = -this.velocity * 0.2 };

        if (this.frontCollider.x > canvas.width - 45) { this.velocity = -this.velocity * 0.2; this.center.x = canvas.width - 45 - this.spineLength * Math.sin(this.direction); };
        if (this.frontCollider.x < 45) { this.velocity = -this.velocity * 0.2; this.center.x = 45 - this.spineLength * Math.sin(this.direction); };
        if (this.frontCollider.y > canvas.height - 45) { this.velocity = -this.velocity * 0.2; this.center.y = canvas.height - 45 + this.spineLength * Math.cos(this.direction); };
        if (this.frontCollider.y < 45) { this.velocity = -this.velocity * 0.2; this.center.y = 45 + this.spineLength * Math.cos(this.direction); };

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
        this.center.x += this.velocity * Math.sin(this.direction);
        this.center.y -= this.velocity * Math.cos(this.direction);

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
            centerX: this.center.x,
            centerY: this.center.y,
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
        ctx.arc(this.center.x, this.center.y, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // DEBUG Front Collider
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.frontCollider.x, this.frontCollider.y, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // DEBUG Velocity Vector
        if (this.break) {
            ctx.strokeStyle = "red";
        } else {
            ctx.strokeStyle = "blue";
        }
        ctx.lineWidth = 20;
        x = this.center.x;
        y = this.center.y;
        w = this.center.x + Math.sin(this.direction) * this.velocity * 100;
        h = this.center.y - Math.cos(this.direction) * this.velocity * 100;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.stroke();
    }
}