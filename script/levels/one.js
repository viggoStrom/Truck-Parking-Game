class levelOne {
    constructor() {
        this.truck = new Truck(1 / 2, 1 / 4)
        // this.trailer = new trailer([this.truck], 1 / 2, 3 / 4, 0, "white")
        // this.exit = new exit(new levelTwo, [this.truck], 1 / 2, 0, Math.PI / 2)
        // this.parkingArea = new parkingSpot([this.exit], this.trailer, 1 / 2, 2.8 / 4, 0)

        this.exit = null

        this.content = [
            this.truck,
            // this.trailer,
            // this.exit,
            // this.parkingArea
        ]
    }

    update() {
        this.content.forEach((element) => {
            element.update()
        })
    }

    render() {
        this.content.forEach((element) => {
            element.render()
        })
    }
}