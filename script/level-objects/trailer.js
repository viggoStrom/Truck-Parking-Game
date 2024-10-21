class Trailer {
    constructor(level, fractionPosX, fractionPosY, options = { direction: 0, color: "white", truck: null }) {
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
        this.center = {
            x: fractionPosX * canvas.width,
            y: fractionPosY * canvas.height,
        };

        // Rendering
        this.color = options.color;
        this.chassis = {
            width: 25, // dm
            length: 100, // dm
        }
        this.axle = {
            rear1: -5, // dm
            rear2: 5, // dm
        };
        this.hookLocation = this.chassis.length * 6 / 8; // A fraction of the chassis length
        this.hookingRadius = 7; // dm

        // Colliders
        this.colliders = [
            // offset is the distance from center and will take the direction into account when projecting
            { offset: this.chassis.length * 4 / 9, radius: 12 },
            { offset: this.chassis.length * 2 / 9, radius: 12 },
            { offset: 0, radius: 12 },
        ]

        // States 
        this.canHook = false;
    }

    init() {
        // All the trucks in the level
        this.trucks = this.level.gameElements.filter(element => element instanceof Truck);
        // All the other trailers in the level
        this.trailers = this.level.gameElements.filter(element => element instanceof Trailer).filter(trailer => trailer.id !== this.id);
    }

    connectTo(truck) {
        // If you pass null, it will disconnect
        if (!truck && this.truck) {
            // Update states
            this.truck.isHooking = false; // Release on the truck side

            // Reset truck mass when disconnected
            this.truck.mass.current = this.truck.mass.dry;

            // Reset references
            this.truck.trailer = null;
            this.truck = null;
            return;
        }

        // Set references
        this.truck = truck;
        this.truck.trailer = this;

        // Increase the mass of the truck to include this trailer
        this.truck.mass.current = this.truck.mass.dry + this.mass.current;

        // Update states
        this.canHook = false;
        this.truck.isHooking = true;
    }

    getHookLocation() {
        return {
            x: this.center.x + Math.sin(this.direction) * this.hookLocation,
            y: this.center.y - Math.cos(this.direction) * this.hookLocation,
        }
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
                        const distance = Math.hypot(dx, dy);

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

        // Check and apply wall collisions to all colliders
        projectedColliders.forEach(wallCollide);
        trailerCollide();
    }

    move() {
        if (!this.truck) { return; }

        // Point toward the truck
        const directionToTruck = Math.atan2(this.truck.center.y - this.center.y, this.truck.center.x - this.center.x);
        this.direction = directionToTruck + Math.PI / 2;

        // Calculate the distance between this center and the hook location
        const hookLocation = this.getHookLocation();
        const dx = hookLocation.x - this.center.x;
        const dy = hookLocation.y - this.center.y;
        const hookDistance = Math.hypot(dx, dy);

        // Keep the trailers center a hook locations distance away from the trucks center
        this.center.x = this.truck.center.x - Math.sin(this.direction) * hookDistance;
        this.center.y = this.truck.center.y + Math.cos(this.direction) * hookDistance;
    }

    update() {
        this.collisions();
        this.move();
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

        velocityVector();
        colliders();
    }
}