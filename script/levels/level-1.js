
class Level1 extends LevelTemplate {
    constructor() {
        super();

        // Set up the game elements
        this.gameElements = [
            new Truck(this, 1 / 2, 1 / 2),
            new Trailer(this, 1 / 2, 3 / 4),
        ];

        // Some values in the elements are dependant on other elements so they need to be initialized after the list is complete 
        this.gameElements.forEach(element => {
            element.init();
        });
    }
}