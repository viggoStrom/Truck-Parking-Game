class levelOne {
    constructor() {
        this.whiteTruck = new truck(1 / 2, 1 / 4)
        this.whiteTrailer = new trailer([this.whiteTruck], 1 / 2, 3 / 4, 0, "white")
        this.exit = new exit(levelTwo, [this.whiteTruck], 1 / 2, 0, Math.PI / 2)
        this.whiteTrailersSpot = new parkingSpot([this.exit], this.whiteTrailer, 1 / 2, 2.8 / 4, 0)
    }

    draw() {
        this.whiteTrailersSpot.math()
        this.whiteTrailersSpot.draw()

        this.whiteTruck.move()
        this.whiteTruck.draw()

        this.whiteTrailer.move()
        this.whiteTrailer.draw()

        this.exit.draw()
        this.exit.check()
    }
}