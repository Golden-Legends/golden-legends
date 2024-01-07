class Game {
    private currentState: GameState;

    constructor() {
        this.changeState(new StartState(this));
    }

    changeState(newState: GameState) {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }

    update() {
        this.currentState.update();
    }
}