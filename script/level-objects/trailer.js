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

    init() {
        // All the trucks in the level
        this.trucks = this.level.gameElements.filter(element => element instanceof Truck);
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

    }

    connectTo(truck) {
        this.truck = truck;
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

        const hookOnUI = () => {
            // The hovering H that indicates the trailer can hook on
            if (this.canHook) {
                const trailerX = this.center.x + Math.sin(this.direction) * this.hookLocation;
                const trailerY = this.center.y - Math.cos(this.direction) * this.hookLocation;
                ui.hookOn(trailerX, trailerY);
            }
        }

        wheels();
        curtain();
        hookOnUI();
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