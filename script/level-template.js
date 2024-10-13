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

    render() {
        this.gameElements.forEach((element) => {
            element.render();
        });
    }
}