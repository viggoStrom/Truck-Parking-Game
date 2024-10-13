/** @type {HTMLCanvasElement} */

class Trailer {
    constructor(trucks = [], x = 1 / 5, y = 3 / 4, direction = 0.5, color = "white") {
        this.id = Date.now();
        this.trucks = trucks;

        this.color = color;
        this.width = 115;
        this.length = 500;
        this.spineLength = this.length - 150;

        this.centerX = x * canvas.width;
        this.centerY = y * canvas.height;
        this.attachPointX = this.centerX;
        this.attachPointY = this.centerY - this.length + 150;
        this.direction = direction;
        this.velocity = 0;
        this.break = false;

        this.hooked = false;
        this.hookedBy = "";
        this.canHook = true;
        this.isParked = false;

        this.breakForce = 80;
        this.friction = 10;
        this.cargoMass = 0;
        this.dryMass = 2000;

        const inputDownKeys = document.addEventListener("keydown", event => {
            let key = event.key.toLowerCase();
            trucks.forEach(truck => {
                if (key == " " && truck.id == this.hookedBy) { this.break = true; event.preventDefault(); }
            });
        });
        const inputUpKeys = document.addEventListener("keyup", event => {
            let key = event.key.toLowerCase();
            trucks.forEach(truck => {
                if (key == " ") { this.break = false; event.preventDefault(); }
            });
        });

        // window.onbeforeunload = function (event) {
        //     this.save()
        // };
    }

    updateDeltaAngle(truck) {
        // this.deltaAngle = Math.asin(Math.sin(truck.direction)) - Math.asin(Math.sin(this.direction));
        this.deltaAngle = truck.direction - this.direction;
    }

    updateDistance(truck) {
        this.distance = Math.sqrt((truck.centerX - this.centerX) ** 2 + (truck.centerY - this.centerY) ** 2);
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

    render() {
        let x, y, w, h;

        // Wheels
        ctx.fillStyle = "black";
        x = this.centerX - this.width / 2 - 6;
        y = this.centerY + 5;
        w = 20;
        h = 30;
        this.roundRect(x, y, w, h);
        x = this.centerX + this.width / 2 - 1; 4
        y = this.centerY + 5;
        this.roundRect(x, y, w, h);
        x = this.centerX - this.width / 2 - 6;
        y = this.centerY - 35;
        this.roundRect(x, y, w, h);
        x = this.centerX + this.width / 2 - 1; 4
        y = this.centerY - 35;
        this.roundRect(x, y, w, h);


        // Back Bumper
        x = this.centerX - this.width / 2;
        y = this.centerY + 8 + 50;
        w = this.width;
        h = 40;
        ctx.fillStyle = "#505050";
        this.roundRect(x, y, w, h);


        // Cargo Space
        x = this.centerX - this.width / 2;
        y = this.centerY - this.length + 40 + 50;
        w = this.width;
        h = this.length;
        ctx.fillStyle = this.color;
        this.roundRect(x, y, w, h);


        // Can Hook Prompt
        if ((this.canHook && !this.hooked && !this.isParked) || (this.isParked && this.hooked)) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.beginPath();
            ctx.roundRect(this.attachPointX - 70, this.attachPointY - 70, 140, 140, 20);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "bold 60px sans-serif";
            ctx.fillText("H", this.attachPointX, this.attachPointY + 20);
        }
    }

    move() {
        // Update Attach Points and Delta Angle 
        this.spineLength = this.length - 150;
        this.attachPointX = this.centerX + Math.sin(this.direction) * this.spineLength;
        this.attachPointY = this.centerY - Math.cos(this.direction) * this.spineLength;


        // Wall collision
        if (this.centerX > canvas.width - 45) { this.centerX = canvas.width - 45; this.velocity = -this.velocity * 0.2; }
        if (this.centerX < 0 + 45) { this.centerX = 0 + 45; this.velocity = -this.velocity * 0.2; }
        if (this.centerY > canvas.height - 45) { this.centerY = canvas.height - 45; this.velocity = -this.velocity * 0.2; }
        if (this.centerY < 0 + 45) { this.centerY = 0 + 45; this.velocity = -this.velocity * 0.2; }

        if (this.attachPointX > canvas.width - 45) { ; this.velocity = -this.velocity * 0.2; this.centerX = canvas.width - 45 - this.spineLength * Math.sin(this.direction); }
        if (this.attachPointX < 45) { ; this.velocity = -this.velocity * 0.2; this.centerX = 45 - this.spineLength * Math.sin(this.direction); }
        if (this.attachPointY > canvas.height - 45) { ; this.velocity = -this.velocity * 0.2; this.centerY = canvas.height - 45 + this.spineLength * Math.cos(this.direction); }
        if (this.attachPointY < 45) { ; this.velocity = -this.velocity * 0.2; this.centerY = 45 + this.spineLength * Math.cos(this.direction); }


        // Update Friction
        this.trucks.forEach(truck => {
            if (this.hooked && truck.id == this.hookedBy) {
                this.friction = truck.friction;
            }
            else {
                this.friction = 5 + Math.abs(this.velocity) / 2;
            }
        })


        // Near 0 Velocity Sets Velocity To 0
        if (Math.abs(this.velocity).toFixed(2) == 0) { this.velocity = 0; }

        // Apply Friction
        else if (this.velocity < 0) { this.velocity += this.friction / (this.cargoMass + this.dryMass); }
        else if (this.velocity > 0) { this.velocity -= this.friction / (this.cargoMass + this.dryMass); }

        // Turn to Truck
        this.trucks.forEach(truck => {
            if (this.hooked && truck.id == this.hookedBy) {
                const deltaX = truck.centerX - this.centerX;
                const deltaY = this.centerY - truck.centerY;
                const c = Math.sqrt(deltaX ** 2 + deltaY ** 2);

                if (truck.centerX > this.centerX) {
                    this.direction = -Math.asin(deltaY / c) + Math.PI / 2;
                } else {
                    this.direction = Math.asin(deltaY / c) - Math.PI / 2;
                }
            }
        });

        // Calculate Velocity V2
        this.trucks.forEach(truck => {
            if (this.hookedBy == truck.id) {
                this.updateDistance(truck);
                this.updateDeltaAngle(truck);
                const deltaDistance = this.distance - this.spineLength;
                const deadZone = 0.1;

                if (Math.abs(deltaDistance) < deadZone) {
                    this.velocity = truck.velocity * Math.cos(this.deltaAngle);
                }
                else if (deltaDistance > deadZone) {
                    this.velocity += 0.2 - 0.1 * Math.cos(this.deltaAngle);
                }
                else if (deltaDistance < -deadZone) {
                    this.velocity -= 0.2 - 0.1 * Math.cos(this.deltaAngle);
                }
            }
        });


        // Apply Velocity to Trailer Position
        this.centerX += this.velocity * Math.sin(this.direction);
        this.centerY -= this.velocity * Math.cos(this.direction);


        // Breaking
        this.trucks.forEach(truck => {
            if (truck.id == this.hookedBy && truck.break && this.velocity > 0) { this.velocity -= this.breakForce / (this.cargoMass + this.dryMass); }
            if (truck.id == this.hookedBy && truck.break && this.velocity < 0) { this.velocity += this.breakForce / (this.cargoMass + this.dryMass); }
        });


        // Hook on Trailer
        const canAttachCheck = (truck, r) => {
            return (
                truck.centerX < this.attachPointX + r &&
                truck.centerX > this.attachPointX - r &&
                truck.centerY < this.attachPointY + r &&
                truck.centerY > this.attachPointY - r
            )
        };
        this.trucks.forEach(truck => {
            const radius = 10;
            this.canHook = false;
            this.updateDeltaAngle(truck);
            this.updateDistance(truck);

            // If They're Hooked Just Continue
            if (
                truck.id == this.hookedBy &&
                this.hooked &&
                truck.hooked &&
                canAttachCheck(truck, radius)
            ) {

            }

            // If Truck Isn't Attached Offer, Prompt To Do So
            else if (
                truck.id != this.hookedBy &&
                !this.hooked &&
                !truck.hooked &&
                canAttachCheck(truck, radius)
            ) {
                this.canHook = true
            }

            // If Truck Hooks and Trailer Isn't Hooked, Hook
            else if (
                (
                    truck.id != this.hookedBy &&
                    truck.hooked &&
                    !this.hooked &&
                    canAttachCheck(truck, radius)
                )
            ) {
                this.hookOn(truck)
            }

            // Defaults to Setting the Truck to Unhooked
            else {
                truck.hooked = false
            }

            // If Truck Is: Clicking Hook Off, Their Angle Is Too Sharp, or The Distance Between Them Is Too Great, Detach the Trailer
            if (
                (
                    truck.id == this.hookedBy &&
                    truck.hasTrailer &&
                    !truck.hooked &&
                    canAttachCheck(truck, radius)
                )
                ||
                (
                    truck.id == this.hookedBy &&
                    truck.hasTrailer &&
                    Math.abs(Math.acos(Math.cos(this.deltaAngle))) > 2
                )
                ||
                (
                    truck.id == this.hookedBy &&
                    truck.hasTrailer &&
                    Math.abs(this.distance - this.spineLength) > 50
                )
            ) {
                this.hookOff(truck)
            }
        })
    }


    hookOn(truck) {
        this.hooked = true;
        this.hookedBy = truck.id;
        truck.mass += (this.cargoMass + this.dryMass);
        truck.hasTrailer = true;
    }


    hookOff(truck) {
        this.hooked = false;
        this.hookedBy = "";
        truck.mass -= (this.cargoMass + this.dryMass);
        truck.hasTrailer = false;
        truck.hooked = false;
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


        // DEBUG Attach Point
        ctx.fillStyle = "orange";
        x = this.attachPointX - this.centerX;
        y = this.attachPointY - this.centerY;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.centerX, this.centerY);
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

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