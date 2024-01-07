abstract class GameState {
    protected game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    abstract enter(): void;
    abstract exit(): void;
    abstract update(): void;
}

