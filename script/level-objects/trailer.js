class Trailer {
    constructor(level, fractionPosX, fractionPosY, options = { direction: 0, color: "white", truck: Truck }) {
        // Default Options
        options = {
            direction: 0,
            color: "white",
            truck: null,
            ...options
        }

        // Hopefully Unique ID
        this.id = Math.floor(Date.now() * Math.random());

        // Level Reference
        this.level = level;
        // Parent truck reference
        this.truck = options.truck;

        // Movement
        this.direction = options.direction; // rad
        this.velocity = 0; // dm / frame
        this.breakForce = 3000; // N
        this.dragForce = 100; // N
        this.mass = {
            current: 7000, // kg
            dry: 7000, // kg
        };

        // Rendering
        this.color = options.color;
        this.chassis = {
            width: 25, // dm
            length: 100, // dm
        }
        this.center = {
            x: fractionPosX * canvas.width,
            y: fractionPosY * canvas.height,
        };
        this.axle = {
            rear1: -5, // dm
            rear2: 5, // dm
        };
        this.hookLocation = this.chassis.length * 6 / 8; // A fraction of the chassis length
        this.canHook = false;
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

        if (!this.truck) { return; }

        // Check if truck is close enough to hook on
        const hookOnDistance = 10; // dm
        const truckX = this.truck.center.x;
        const truckY = this.truck.center.y;
        const trailerX = this.center.x + Math.sin(this.direction) * this.hookLocation;
        const trailerY = this.center.y - Math.cos(this.direction) * this.hookLocation;
        const distance = Math.sqrt((truckX - trailerX) ** 2 + (truckY - trailerY) ** 2);

        if (distance < hookOnDistance) {
            this.canHook = true;
        } else {
            this.canHook = false;
        }
    }

    render() {
        // Wheels
        const wheels = () => {
            let x, y;
            const w = 3; // dm
            const h = 8; // dm
            ctx.fillStyle = "black";

            // Forward axle
            x = this.center.x - this.chassis.width / 2;
            y = this.center.y + this.axle.rear1;
            this.renderWheel(x, y, w, h);
            x = this.center.x + this.chassis.width / 2;
            this.renderWheel(x, y, w, h);

            // Rear axle
            x = this.center.x - this.chassis.width / 2;
            y = this.center.y + this.axle.rear2;
            this.renderWheel(x, y, w, h);
            x = this.center.x + this.chassis.width / 2;
            this.renderWheel(x, y, w, h);
        }


        // Curtain 
        const curtain = () => {
            const x = this.center.x - this.chassis.width / 2; // dm
            const y = this.center.y - this.chassis.length * 7 / 8; // dm
            const w = this.chassis.width; // dm
            const h = this.chassis.length; // dm

            ctx.fillStyle = this.color;
            this.roundRect(x, y, w, h);
        }

        wheels();
        curtain();
    }

    move() {
        // Update Front Collider  
        const spineLength = this.hookLocation; // dm
        this.frontCollider = {
            x: this.center.x + Math.sin(this.direction) * spineLength,
            y: this.center.y - Math.cos(this.direction) * spineLength,
        };

        // Wall collision
        // If the truck hits a wall, reverse the velocity and move the truck back
        const sideMargin = 10; // dm
        if (this.center.x > canvas.width - sideMargin) { this.center.x = canvas.width - sideMargin; this.velocity = -this.velocity * 0.2 };
        if (this.center.x < sideMargin) { this.center.x = sideMargin; this.velocity = -this.velocity * 0.2 };
        if (this.center.y > canvas.height - sideMargin) { this.center.y = canvas.height - sideMargin; this.velocity = -this.velocity * 0.2 };
        if (this.center.y < sideMargin) { this.center.y = sideMargin; this.velocity = -this.velocity * 0.2 };
        // Does the same but for the front collider
        if (this.frontCollider.x > canvas.width - sideMargin) { this.velocity = -this.velocity * 0.2; this.center.x = canvas.width - sideMargin - spineLength * Math.sin(this.direction); };
        if (this.frontCollider.x < sideMargin) { this.velocity = -this.velocity * 0.2; this.center.x = sideMargin - spineLength * Math.sin(this.direction); };
        if (this.frontCollider.y > canvas.height - sideMargin) { this.velocity = -this.velocity * 0.2; this.center.y = canvas.height - sideMargin + spineLength * Math.cos(this.direction); };
        if (this.frontCollider.y < sideMargin) { this.velocity = -this.velocity * 0.2; this.center.y = sideMargin + spineLength * Math.cos(this.direction); };

        // Apply Break
        if (this.break) {
            const breakVel = (this.breakForce / this.mass.current) / 10; // dm / frame^2
            if (this.velocity > 0) { this.velocity -= breakVel; if (this.velocity < 0) { this.velocity = 0; } }
            if (this.velocity < 0) { this.velocity += breakVel; if (this.velocity > 0) { this.velocity = 0; } }
        }

        // Calc drag
        const drag = ((this.dragForce / this.mass.current) / 10); // dm / frame^2
        // Apply Drag
        if (this.velocity > 0) { this.velocity -= drag; }
        if (this.velocity < 0) { this.velocity += drag; }

        // If the velocity is close to 0, set it to 0
        if (!this.forward && !this.backward && (Math.abs(this.velocity) < 0.01)) { this.velocity = 0; }

        // Apply Velocity to Truck Position
        this.center.x += this.velocity * Math.sin(this.direction);
        this.center.y -= this.velocity * Math.cos(this.direction);
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