class Truck {
    constructor(level, fractionPosX, fractionPosY, direction = 0, color = "white") {
        // Hopefully Unique ID
        this.id = Math.floor(Date.now() * Math.random());

        // Level Reference
        this.level = level;

        // Movement
        this.direction = direction;
        this.steer = {
            angle: 0,
            force: 0.0002,
            maxAngle: Math.PI / 2.5,
        };

        this.velocity = 0;
        this.acceleration = 5 / 100;
        this.breakForce = 10 / 100;
        this.drag = 1 / 100; // How much the vehicle is slowed down by friction with the ground and air
        this.mass = {
            current: 2000,
            dry: 2000,
        };

        // Rendering
        this.color = "white";
        this.cab = {
            width: 100,
            length: 85,
        };
        this.chassis = {
            width: 95,
            length: 220,
        }
        this.center = {
            x: fractionPosX * canvas.width,
            y: fractionPosY * canvas.height,
        };

        // States
        this.isHooked = false; // Whether the trucks fifth wheel is "locked" or not
        this.hasTrailer = false; // Whether the truck has a trailer attached or not

        // Set up inputs
        this.initInput();
    }

    initInput() {
        this.keydownListener = document.addEventListener("keydown", event => {
            const key = event.key.toLowerCase();

            // Prevent undesired browser behavior
            if (event.ctrlKey && !event.shiftKey && key === "r") { event.preventDefault(); } // Reload protection but allow hard refresh
            if (event.ctrlKey && key === "w") { event.preventDefault(); } // Close tab protection

            if (key == "w" || key == "arrowup") { this.forward = true; event.preventDefault(); }
            if (key == "s" || key == "arrowdown") { this.backward = true; event.preventDefault(); }
            if (key == "d" || key == "arrowright") { this.rightTurn = true; }
            if (key == "a" || key == "arrowleft") { this.leftTurn = true; }
            if (key == "h") { this.isHooked = !this.isHooked }
            if (key == " ") { this.break = true; event.preventDefault(); }
        });

        this.keyupListener = document.addEventListener("keyup", event => {
            const key = event.key.toLowerCase();

            if (key == "w" || key == "arrowup") { this.forward = false; event.preventDefault(); }
            if (key == "s" || key == "arrowdown") { this.backward = false; event.preventDefault(); }
            if (key == "d" || key == "arrowright") { this.rightTurn = false; }
            if (key == "a" || key == "arrowleft") { this.leftTurn = false; }
            if (key == " ") { this.break = false; event.preventDefault(); }
        });
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

    renderWheel(x, y, w, h) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.direction);
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
        // Wheels
        const wheels = () => {
            let x = this.center.x - this.cab.width / 2 - 8;
            let y = this.center.y - 130 - 20;
            let w = 20;
            let h = 30;

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
        }

        // Chassis
        const chassis = () => {
            let x = this.center.x - this.cab.width / 2 + (this.cab.width - this.chassis.width) / 2;
            let y = this.center.y - this.chassis.length / 2 - 65;
            let w = this.chassis.width;
            let h = this.chassis.length;

            ctx.fillStyle = "#505050";
            this.roundRect(x, y, w, h);
        }

        // Fifth Wheel
        const fifthWheel = () => {
            let w = 35;
            let h = 50;
            let x = this.center.x;
            let y = this.center.y;

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
        }

        // Cab
        const cab = () => {
            let x = this.center.x - this.cab.width / 2;
            let y = this.center.y - this.chassis.length / 2 - 65;
            let w = this.cab.width;
            let h = this.cab.length;

            ctx.fillStyle = this.color;
            this.roundRect(x, y, w, h);
        }

        // Windshield
        const windshield = () => {
            let w = this.chassis.width * .95;
            let h = 15;
            let x = this.center.x - w / 2;
            let y = this.center.y - this.chassis.length * .8;

            ctx.fillStyle = "#212121";
            this.roundRect(x, y, w, h);
        }

        wheels();
        chassis();
        fifthWheel();
        cab();
        windshield();
    }

    move() {
        // Update Front Collider  
        const spineLength = this.chassis.length - this.cab.length;
        this.frontCollider = {
            x: this.center.x + Math.sin(this.direction) * spineLength,
            y: this.center.y - Math.cos(this.direction) * spineLength,
        };

        // Wall collision
        // If the truck hits a wall, reverse the velocity and move the truck back
        if (this.center.x > canvas.width - 45) { this.center.x = canvas.width - 45; this.velocity = -this.velocity * 0.2 };
        if (this.center.x < 45) { this.center.x = 45; this.velocity = -this.velocity * 0.2 };
        if (this.center.y > canvas.height - 45) { this.center.y = canvas.height - 45; this.velocity = -this.velocity * 0.2 };
        if (this.center.y < 45) { this.center.y = 45; this.velocity = -this.velocity * 0.2 };
        // Does the same but for the front collider
        if (this.frontCollider.x > canvas.width - 45) { this.velocity = -this.velocity * 0.2; this.center.x = canvas.width - 45 - spineLength * Math.sin(this.direction); };
        if (this.frontCollider.x < 45) { this.velocity = -this.velocity * 0.2; this.center.x = 45 - spineLength * Math.sin(this.direction); };
        if (this.frontCollider.y > canvas.height - 45) { this.velocity = -this.velocity * 0.2; this.center.y = canvas.height - 45 + spineLength * Math.cos(this.direction); };
        if (this.frontCollider.y < 45) { this.velocity = -this.velocity * 0.2; this.center.y = 45 + spineLength * Math.cos(this.direction); };

        // Apply Friction
        if (this.velocity < 0) { this.velocity += this.drag; }
        if (this.velocity > 0) { this.velocity -= this.drag; }

        // Near 0 Velocity Sets Velocity To 0
        if (Math.abs(this.velocity).toFixed(2) == 0) { this.velocity = 0; }

        // Apply Acceleration
        if (this.forward) { this.velocity += this.acceleration; }
        if (this.backward) { this.velocity -= this.acceleration / 2; }

        // Apply Velocity to Truck Position
        this.center.x += this.velocity * Math.sin(this.direction);
        this.center.y -= this.velocity * Math.cos(this.direction);

        // Breaking
        if (this.break && this.velocity > 0) { this.velocity -= this.breakForce; }
        if (this.break && this.velocity < 0) { this.velocity += this.breakForce; }

        // Steering
        if (this.rightTurn) { this.steer.angle += this.steer.force; }
        if (this.leftTurn) { this.steer.angle -= this.steer.force; }
        // If the steering maxes out, set it to the max angle
        if (this.steer.angle > this.steer.maxAngle) { this.steer.angle = this.steer.maxAngle; }
        if (this.steer.angle < -this.steer.maxAngle) { this.steer.angle = -this.steer.maxAngle; }

        // Apply Steering
        if (Math.abs(this.velocity) > 0) {
            this.direction += this.steer.angle * this.velocity / 1000;
        }

        // Center Steering Angle
        // The further from center, the faster it corrects
        const steeringCorrection = 1 / (Math.abs(this.steer.angle) / this.steer.maxAngle);
        if (!this.rightTurn && !this.leftTurn) {
            // If there are no inputs, steer back to center with the regular steering force, modified by the steeringCorrection
            if (this.steer.angle > 0) { this.steer.angle -= this.steer.force * steeringCorrection; }
            if (this.steer.angle < 0) { this.steer.angle += this.steer.force * steeringCorrection; }
        }

        console.log("SteerAngle:" + this.steer.angle.toFixed(5), "Velocity:" + this.velocity.toFixed(2), "Direction:" + this.direction.toFixed(5), "SteeringCorrection:" + steeringCorrection.toFixed(5));
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