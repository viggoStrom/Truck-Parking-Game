class Truck {
    constructor(level, fractionPosX, fractionPosY, direction = 0, color = "white") {
        // Hopefully Unique ID
        this.id = Math.floor(Date.now() * Math.random());

        // Level Reference
        this.level = level;

        // Movement
        this.direction = direction; // rad
        this.steer = {
            angle: 0, // rad
            speed: 0.02, // rad / frame
            maxAngle: Math.PI / 3, // rad
        };
        this.velocity = 0; // dm / frame
        this.forwardForce = 1000; // N
        this.breakForce = 10000; // N
        this.drag = 100; // N
        this.mass = {
            current: 7000, // kg
            dry: 7000, // kg
        };

        // Rendering
        this.color = "white";
        this.cab = {
            width: 25, // dm
            length: 20, // dm
        };
        this.chassis = {
            width: 24, // dm
            length: 60, // dm
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
        // Save the state of the canvas
        ctx.save();
        // Offset the canvas to the center of the truck, rotate it, and then offset it back
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.direction);
        ctx.translate(-this.center.x, -this.center.y);

        // Draw
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 3);
        ctx.fill();

        // Restore the canvas to the previous state but with the new drawing
        ctx.restore();
    }

    renderWheel(x, y, w, h, angle = 0) {
        // x += w / 2;
        // y -= h / 2;

        // Save the state of the canvas
        ctx.save();
        // Offset the canvas to the center of the truck, rotate it, and then offset it back
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.direction);
        ctx.translate(-this.center.x, -this.center.y);

        // Rotate again
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);


        // Draw
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 2);
        ctx.fill();

        // Restore the canvas to the previous state but with the new drawing
        ctx.restore();
    }

    update() {
        this.move();
    }

    render() {
        // Wheels
        const wheels = () => {
            let x, y;
            const w = 3; // dm
            const h = 8; // dm
            ctx.fillStyle = "black";

            // Front axle (articulated)
            x = this.center.x - this.chassis.width / 2 - w / 4;
            y = this.center.y - this.chassis.length + this.cab.length;
            this.renderWheel(x, y, w, h, this.steer.angle);
            x = this.center.x + this.chassis.width / 2 + w / 4;
            this.renderWheel(x, y, w, h, this.steer.angle);

            // Rear axles
            x = this.center.x - this.chassis.width / 2;
            y = this.center.y - h * 4 / 5;
            this.renderWheel(x, y, w, h);
            x = this.center.x + this.chassis.width / 2;
            this.renderWheel(x, y, w, h);

            x = this.center.x - this.chassis.width / 2;
            y = this.center.y + h / 2;
            this.renderWheel(x, y, w, h, -this.steer.angle / 10);
            x = this.center.x + this.chassis.width / 2;
            this.renderWheel(x, y, w, h, -this.steer.angle / 10);
        }

        // Chassis
        const chassis = () => {
            const x = this.center.x - this.cab.width / 2 + (this.cab.width - this.chassis.width) / 2;  // dm
            const y = this.center.y - this.chassis.length * 5 / 6; // dm
            const w = this.chassis.width; // dm
            const h = this.chassis.length; // dm

            ctx.fillStyle = "#505050";
            this.roundRect(x, y, w, h);
        }

        // Fifth Wheel (where the trailer hooks on)
        const fifthWheel = () => {
            let x, y // dm
            const w = 7; // dm
            const h = 10; // dm

            ctx.fillStyle = "gray";

            // Save the state of the canvas
            ctx.save();
            ctx.beginPath();
            ctx.translate(this.center.x, this.center.y);
            ctx.rotate(this.direction);

            // The prongs of the plate
            x = - w / 2;
            y = 0;
            ctx.moveTo(x, y);
            x = - w / 3;
            y = h / 2;
            ctx.lineTo(x, y);
            x = w / 3;
            y = h / 2;
            ctx.lineTo(x, y);
            x = w / 2;
            y = 0;
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fill();

            // The top part of the plate
            ctx.beginPath();
            x = 0;
            y = 0;
            ctx.arc(x, y, w / 2, Math.PI, 0);
            ctx.closePath();
            ctx.fill();

            // The hole
            ctx.fillStyle = "black";
            x = - w / 5;
            y = 0;
            ctx.fillRect(x, y, w * 2 / 5, h / 2);
            ctx.beginPath();
            x = 0;
            y = 0;
            ctx.arc(x, y, w / 5, 2 * Math.PI, 0);
            ctx.closePath();
            ctx.fill();

            // Restore the canvas to the previous state but with the new drawing
            ctx.restore();
        }

        // Cab
        const cab = () => {
            const x = this.center.x - this.cab.width / 2; // dm
            const y = this.center.y - this.chassis.length * 5 / 6; // dm
            const w = this.cab.width; // dm
            const h = this.cab.length; // dm

            ctx.fillStyle = this.color;
            this.roundRect(x, y, w, h);
        }

        // Windshield
        const windshield = () => {
            const w = this.chassis.width; // dm
            const h = this.cab.length / 5; // dm
            const x = this.center.x - w / 2; // dm
            const y = this.center.y - this.chassis.length * 5 / 6; // dm

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

        // 
        // New physics
        // 

        // Steering
        if (this.rightTurn) { this.steer.angle += this.steer.speed; }
        if (this.leftTurn) { this.steer.angle -= this.steer.speed; }
        // If the steering maxes out, set it to the max angle
        if (this.steer.angle >= this.steer.maxAngle) { this.steer.angle = this.steer.maxAngle; }
        if (this.steer.angle <= -this.steer.maxAngle) { this.steer.angle = -this.steer.maxAngle; }
        // Center Steering Angle
        if (!this.rightTurn && !this.leftTurn) {
            // If there are no inputs, steer back to center with the regular steering force
            this.steer.angle -= Math.sign(this.steer.angle) * this.steer.speed;
        }

        // Calc acceleration
        const acceleration = this.forwardForce / this.mass.current;

        // Apply Gas
        if (this.forward) { this.velocity += acceleration; }
        if (this.backward) { this.velocity -= acceleration / 2; } // Just half the acceleration for reverse

        // Calc drag
        const drag = this.drag * this.mass.current * Math.sign(this.velocity); // dm / frame^2

        // Apply Drag
        this.velocity -= drag;

        // Apply Velocity to Truck Position
        this.center.x += this.velocity * Math.sin(this.direction);
        this.center.y -= this.velocity * Math.cos(this.direction);


        // // Apply Friction
        // if (this.velocity < 0) { this.velocity += this.drag; }
        // if (this.velocity > 0) { this.velocity -= this.drag; }

        // // Near 0 Velocity Sets Velocity To 0
        // if (Math.abs(this.velocity).toFixed(2) == 0) { this.velocity = 0; }

        // // Apply Acceleration
        // if (this.forward) { this.velocity += this.acceleration; }
        // if (this.backward) { this.velocity -= this.acceleration / 2; }

        // // Apply Velocity to Truck Position
        // this.center.x += this.velocity * Math.sin(this.direction);
        // this.center.y -= this.velocity * Math.cos(this.direction);

        // // Breaking
        // if (this.break && this.velocity > 0) { this.velocity -= this.breakForce; }
        // if (this.break && this.velocity < 0) { this.velocity += this.breakForce; }

        // // Steering
        // if (this.rightTurn) { this.steer.angle += this.steer.speed; }
        // if (this.leftTurn) { this.steer.angle -= this.steer.speed; }
        // // If the steering maxes out, set it to the max angle
        // if (this.steer.angle >= this.steer.maxAngle) { this.steer.angle = this.steer.maxAngle; }
        // if (this.steer.angle <= -this.steer.maxAngle) { this.steer.angle = -this.steer.maxAngle; }

        // // Apply Steering
        // if (Math.abs(this.velocity) > 0) {
        //     // 
        //     // x: x-composite of steer force
        //     // s: spine length
        //     // u: steer angle
        //     // v: direction
        //     // F: forward force
        //     // 
        //     // F = m * a
        //     // 
        //     // v = atan(x/s)
        //     // 
        //     // tan(u) = x / F
        //     // 
        //     // x = F * tan(u)
        //     // 

        //     const spineLength = this.chassis.length - this.cab.length;
        //     const steerForce = this.mass.current * this.acceleration;

        //     // Calculate the x-component of the steering force
        //     const x = steerForce * Math.tan(this.steer.angle) / 1000;
        //     // Calculate the new direction
        //     const v = Math.atan2(x, spineLength);

        //     // Apply the new direction
        //     this.direction += v;
        // }

        // // Center Steering Angle
        // const steeringCorrection = 1;
        // if (!this.rightTurn && !this.leftTurn) {
        //     // If there are no inputs, steer back to center with the regular steering force, modified by the steeringCorrection
        //     if (this.steer.angle > 0) { this.steer.angle -= this.steer.speed * steeringCorrection; }
        //     if (this.steer.angle < 0) { this.steer.angle += this.steer.speed * steeringCorrection; }
        // }

        // // If steering close to center, center it
        // if (!this.rightTurn && !this.leftTurn && Math.abs(this.steer.angle) < this.steer.speed * 2) { this.steer.angle = 0; }
    }

    debug() {
        // DEBUG Center Point
        const centerPoint = () => {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "lightGreen";
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, 4, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // DEBUG Front Collider
        const frontCollider = () => {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.frontCollider.x, this.frontCollider.y, 4, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // DEBUG Velocity Vector
        const velocityVector = () => {
            ctx.globalAlpha = 0.5;
            if (this.break) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "blue";
            }
            ctx.lineWidth = 4;
            const x = this.center.x;
            const y = this.center.y;
            const w = this.center.x + Math.sin(this.direction) * this.velocity * 100;
            const h = this.center.y - Math.cos(this.direction) * this.velocity * 100;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        centerPoint();
        frontCollider();
        velocityVector();
    }
}