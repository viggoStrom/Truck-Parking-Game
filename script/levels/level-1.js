
class Level1 extends LevelTemplate {
    constructor() {
        super();

        this.gameElements = [
            new Truck(this, 1 / 2, 1 / 2),
        ];
    }
}