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
            speed: 0.015, // rad / frame
            maxAngle: Math.PI / 6, // rad
        };
        this.velocity = 0; // dm / frame
        this.forwardForce = 1000; // N
        this.breakForce = 3000; // N
        this.dragForce = 200; // N
        this.mass = {
            current: 7000, // kg
            dry: 7000, // kg
        };
        this.center = {
            x: fractionPosX * canvas.width,
            y: fractionPosY * canvas.height,
        };

        // Rendering
        this.color = color;
        this.cab = {
            width: 25, // dm
            length: 20, // dm
        };
        this.chassis = {
            width: 24, // dm
            length: 52, // dm
        };
        this.axle = {
            front: this.chassis.length - this.cab.length, // dm
            rear1: -2, // dm
            rear2: 8, // dm
        };

        // Colliders
        this.colliders = [
            // offset is the distance from center and will take the direction into account when projecting
            { offset: 0, radius: 11 },
            { offset: this.axle.front, radius: 11 },
        ]

        // States
        this.isHooked = false; // Whether the trucks fifth wheel is "locked" or not
        this.hasTrailer = false; // Whether the truck has a trailer attached or not

        // Set up inputs
        this.initInput();
    }

    init() {
        // All the trailers in the level
        this.trailers = this.level.gameElements.filter(element => element instanceof Trailer);
        // All the trucks in the level
        this.trucks = this.level.gameElements.filter(element => element instanceof Truck);
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

    render() {
        // Wheels
        const wheels = () => {
            let x, y;
            const w = 3; // dm
            const h = 8; // dm
            ctx.fillStyle = "black";

            // Front axle (articulated)
            x = this.center.x - this.chassis.width / 2 - w / 4;
            y = this.center.y - this.axle.front;
            this.renderWheel(x, y, w, h, this.steer.angle);
            x = this.center.x + this.chassis.width / 2 + w / 4;
            this.renderWheel(x, y, w, h, this.steer.angle);

            // Rear axles
            x = this.center.x - this.chassis.width / 2;
            y = this.center.y + this.axle.rear1;
            this.renderWheel(x, y, w, h);
            x = this.center.x + this.chassis.width / 2;
            this.renderWheel(x, y, w, h);

            x = this.center.x - this.chassis.width / 2;
            y = this.center.y + this.axle.rear2;
            this.renderWheel(x, y, w, h, -this.steer.angle / 10);
            x = this.center.x + this.chassis.width / 2;
            this.renderWheel(x, y, w, h, -this.steer.angle / 10);
        }

        // Chassis
        const chassis = () => {
            const x = this.center.x - this.cab.width / 2 + (this.cab.width - this.chassis.width) / 2;  // dm
            const y = this.center.y - this.chassis.length * 6 / 8; // dm
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

    getProjectedColliders() {
        return this.colliders.map((collider) => {
            return {
                x: this.center.x - collider.offset * Math.cos(this.direction + Math.PI / 2),
                y: this.center.y - collider.offset * Math.sin(this.direction + Math.PI / 2),
                radius: collider.radius,
            }
        });
    }

    collisions() {
        // Update Front Collider  
        const projectedColliders = this.getProjectedColliders();

        // Wall collisions
        const wallCollide = (collider, index) => {
            const wallBounceFactor = 0.2;

            // X and Y offset from the center to the current collider
            const x = this.colliders[index].offset * Math.cos(this.direction + Math.PI / 2);
            const y = this.colliders[index].offset * Math.sin(this.direction + Math.PI / 2);

            // Left wall
            if (collider.x < collider.radius) {
                this.velocity = -this.velocity * wallBounceFactor;
                this.center.x = x + collider.radius;
            }
            // Top wall
            if (collider.y < collider.radius) {
                this.velocity = -this.velocity * wallBounceFactor;
                this.center.y = y + collider.radius;
            }
            // Right wall
            if (collider.x > canvas.width - collider.radius) {
                this.velocity = -this.velocity * wallBounceFactor;
                this.center.x = canvas.width + x - collider.radius;
            }
            // Bottom wall
            if (collider.y > canvas.height - collider.radius) {
                this.velocity = -this.velocity * wallBounceFactor;
                this.center.y = canvas.height + y - collider.radius;
            }
        }

        // Truck colliding with trailers
        const trailerCollide = () => {
            const trailerBounceFactor = 0.2;

            this.trailers.forEach(trailer => {
                const trailerColliders = trailer.getProjectedColliders();

                // Check if any truck colliders are colliding with any trailer colliders
                trailerColliders.forEach(trailerCollider => {
                    projectedColliders.forEach(truckCollider => {
                        const dx = trailerCollider.x - truckCollider.x;
                        const dy = trailerCollider.y - truckCollider.y;
                        // Distance between the two colliders
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // If the distance is less than the sum of the radii, they are colliding
                        if (distance < trailerCollider.radius + truckCollider.radius) {
                            // Angle between the two colliders to calculate the push direction
                            const angle = Math.atan2(dy, dx);
                            const pushDistance = trailerCollider.radius + truckCollider.radius - distance;
                            // Move the truck back
                            this.center.x -= Math.cos(angle) * pushDistance;
                            this.center.y -= Math.sin(angle) * pushDistance;

                            // Reverse truck velocity to make it bounce
                            this.velocity = -this.velocity * trailerBounceFactor;
                        }
                    });
                });
            });
        }

        // Run all collisions
        projectedColliders.forEach(wallCollide);
        trailerCollide();
    }

    move() {
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
        // If steering close to center, center it
        if (
            !this.rightTurn && !this.leftTurn
            &&
            Math.abs(this.steer.angle) < this.steer.speed * 1.1
        ) {
            this.steer.angle = 0;
        }

        // Forward acceleration
        // Calculate acceleration, F = ma => a = F / m divided by 10 to make it dm / frame^2
        const acceleration = (this.forwardForce / this.mass.current) / 10; // dm / frame^2
        // Apply Gas
        if (this.forward && !this.break) { this.velocity += acceleration; }
        if (this.backward && !this.break) { this.velocity -= acceleration / 2; } // Just half the acceleration for reverse

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

        // Apply Steering
        const wheelBase = this.axle.front - this.axle.rear1;
        const turnRadius = wheelBase / Math.tan(this.steer.angle);
        const changeInDirection = this.velocity / turnRadius;

        // Apply Rotation
        this.direction += changeInDirection;

        // Apply Velocity to Truck Position
        this.center.x += this.velocity * Math.sin(this.direction);
        this.center.y -= this.velocity * Math.cos(this.direction);
    }

    update() {
        this.collisions();
        this.move();
    }

    debug() {
        const projectedColliders = this.getProjectedColliders();

        // DEBUG Colliders
        const colliders = () => {
            projectedColliders.forEach(collider => {
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "orange";
                ctx.beginPath();
                ctx.arc(collider.x, collider.y, collider.radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
            });
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

        colliders();
        velocityVector();
    }
}