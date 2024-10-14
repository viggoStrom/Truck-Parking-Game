class LevelTemplate {
    constructor() {
        this.gameElements = [];
        this.levelNumber = undefined;
    }

    update() {
        this.gameElements.forEach((element) => {
            element.update();
        });
    }

    render(debug = false) {
        this.gameElements.forEach((element) => {
            element.render();

            if (debug) {
                element.debug();
            }
        });
    }
}