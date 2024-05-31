import { doc } from "firebase/firestore";
import { GameState } from "../GameState";
import { InGameState } from "../scene/InGameState";
import { TennisGameState } from "../scene/games/TennisGameState";

export class TennisGameGui {
    private helpComponent : boolean = false;
    private readyComponent : boolean = false;
    private scoreComponent : boolean = false;
    private keyPressedComponent : boolean = false;
    private resultComponent : boolean = false;

    private gameState : TennisGameState;

    constructor(gameState: TennisGameState) {
        this.gameState = gameState;
    }

    public initFirstGuiSolo(): void {
        console.log('initFirstGui');
        this.score();
        this.keyPressedGui();
    }

    public initFirstGuiMulti(): void {
        console.log('initFirstGuiMulti');
    }

    public initListeners(): void {
        this.gameState.addEventListenerById("close-help-tennis", "click", () => {
            document.getElementById("tennis-help")!.classList.add("hidden");
        });
        this.gameState.addEventListenerByQuerySelector(
            "#tennis-results #continue-button",
            "click", () => {
            this.gameState.getGame().changeState(new InGameState(this.gameState.getGame(), this.gameState.getCanvas()));
            this.resultGui();
        });
        this.gameState.addEventListenerByQuerySelector(
            "#tennis-results #replay-button",
            "click",
            () => {
                this.gameState.getGame().changeState(
                  new TennisGameState(
                    this.gameState.getGame(),
                    this.gameState.getCanvas(),
                    this.gameState.getMultiplayer()
                  ),
                );
                this.resultGui();
              },
            );

    }

    public helperComponent () { 
        if (!this.helpComponent) {
            document.getElementById("tennis-help")!.classList.remove("hidden");
        } else {
            document.getElementById("tennis-help")!.classList.add("hidden");
        }
        this.helpComponent = !this.helpComponent;
    }

    public readyButton () {
        if (!this.readyComponent) {
            document.getElementById("tennis-ready-button")!.classList.remove("hidden");
        } else {
            document.getElementById("tennis-ready-button")!.classList.add("hidden");
        }
        this.readyComponent = !this.readyComponent;
    }

    private score () {
        if (!this.scoreComponent) {
            document.getElementById("tennis-score")!.classList.remove("hidden");
        } else {
            document.getElementById("tennis-score")!.classList.add("hidden");
        }
        this.scoreComponent = !this.scoreComponent;
    }
    private keyPressedGui () {
        if (!this.keyPressedComponent) {
            document.getElementById("tennis-keyPressed")!.classList.remove("hidden");
        } else {
            document.getElementById("tennis-keyPressed")!.classList.add("hidden");
        }
        this.keyPressedComponent = !this.keyPressedComponent;
    }

    public resultGui () {
        if (!this.resultComponent) {
            document.getElementById("tennis-results")!.classList.remove("hidden");
        } else {
            document.getElementById("tennis-results")!.classList.add("hidden");
        }
        this.resultComponent = !this.resultComponent;
    }

    

}