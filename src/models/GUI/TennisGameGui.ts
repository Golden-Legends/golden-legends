import { doc } from "firebase/firestore";
import { GameState } from "../GameState";
import { InGameState } from "../scene/InGameState";
import { TennisGameState } from "../scene/games/TennisGameState";

export class TennisGameGui {
  private helpComponent: boolean = false;
  private readyComponent: boolean = false;
  private scoreComponent: boolean = false;
  private keyPressedComponent: boolean = false;
  private resultComponent: boolean = false;
  private multi: boolean | undefined;

  private gameState: TennisGameState;

  constructor(gameState: TennisGameState, multi: boolean) {
    this.gameState = gameState;
    this.multi = multi;
  }

  public initFirstGuiSolo(): void {
    ("initFirstGui");
    this.score();
    this.keyPressedGui();
  }

  public initFirstGuiMulti(): void {
    ("initFirstGuiMulti");
    this.score();
    this.keyPressedGuiMulti();
  }

  public initListeners(): void {
    if (this.multi) {
      this.gameState.addEventListenerById("close-help-tennis", "click", () => {
        document.getElementById("tennis-help")!.classList.add("hidden");
      });
    } else {
      this.gameState.addEventListenerById(
        "close-help-tennis-solo",
        "click",
        () => {
          document.getElementById("tennis-help-solo")!.classList.add("hidden");
        },
      );
    }
    this.gameState.addEventListenerByQuerySelector(
      "#tennis-results #continue-button",
      "click",
      () => {
        this.gameState
          .getGame()
          .changeState(
            new InGameState(
              this.gameState.getGame(),
              this.gameState.getCanvas(),
            ),
          );
        this.resultGui();
      },
    );
    this.gameState.addEventListenerByQuerySelector(
      "#tennis-results #replay-button",
      "click",
      () => {
        this.gameState
          .getGame()
          .changeState(
            new TennisGameState(
              this.gameState.getGame(),
              this.gameState.getCanvas(),
              this.gameState.getMultiplayer(),
            ),
          );
        this.resultGui();
      },
    );
  }

  public helperComponent() {
    if (this.multi) {
      if (!this.helpComponent) {
        document.getElementById("tennis-help")!.classList.remove("hidden");
      } else {
        document.getElementById("tennis-help")!.classList.add("hidden");
      }
      this.helpComponent = !this.helpComponent;
    } else {
      if (!this.helpComponent) {
        document.getElementById("tennis-help-solo")!.classList.remove("hidden");
      } else {
        document.getElementById("tennis-help-solo")!.classList.add("hidden");
      }
      this.helpComponent = !this.helpComponent;
    }
  }

  public readyButton() {
    if (!this.readyComponent) {
      document
        .getElementById("tennis-ready-button")!
        .classList.remove("hidden");
    } else {
      document.getElementById("tennis-ready-button")!.classList.add("hidden");
    }
    this.readyComponent = !this.readyComponent;
  }

  private score() {
    if (!this.scoreComponent) {
      document.getElementById("tennis-score")!.classList.remove("hidden");
    } else {
      document.getElementById("tennis-score")!.classList.add("hidden");
    }
    this.scoreComponent = !this.scoreComponent;
  }
  private keyPressedGui() {
    if (!this.keyPressedComponent) {
      document.getElementById("tennis-keyPressed")!.classList.remove("hidden");
    } else {
      document.getElementById("tennis-keyPressed")!.classList.add("hidden");
    }
    this.keyPressedComponent = !this.keyPressedComponent;
  }

  private keyPressedGuiMulti() {
    if (!this.keyPressedComponent) {
      document.getElementById("tennis-keyPressed0")!.classList.remove("hidden");
      document.getElementById("tennis-keyPressed1")!.classList.remove("hidden");
    } else {
      document.getElementById("tennis-keyPressed0")!.classList.add("hidden");
      document.getElementById("tennis-keyPressed1")!.classList.add("hidden");
    }
    this.keyPressedComponent = !this.keyPressedComponent;
  }

  public resultGui() {
    if (!this.resultComponent) {
      document.getElementById("tennis-results")!.classList.remove("hidden");
    } else {
      document.getElementById("tennis-results")!.classList.add("hidden");
    }
    this.resultComponent = !this.resultComponent;
  }
}
