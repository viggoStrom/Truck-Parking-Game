
class Level1 extends LevelTemplate {
    constructor() {
        super();

        // Set up the game elements
        this.gameElements = [
            new Truck(this, 1 / 2, 1 / 2),
        ];
        // Some game objects need references to other game objects so the get pushed after
        this.gameElements.push(
            new Trailer(this, 1 / 2, 3 / 4, { truck: this.gameElements[0] }),
        );
    }
}