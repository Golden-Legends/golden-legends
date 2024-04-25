import {
    Scene,
} from "@babylonjs/core";
import { Player } from "../controller/Player";

export class Options {
    private _scene: Scene;
    private player: Player;

    constructor(scene: Scene, player: Player) {
        this._scene = scene;
        this.player = player;
    }

    public init() {
        this.interactOptions();
    }


    public interactOptions() {
		document.addEventListener("keydown", function(event) {
			if (event.key === 'o' && !document.getElementById("options")!.classList.contains("hidden")){
                document.getElementById("options")!.classList.add("hidden");
                console.log("options hidden");
			}
			else if (event.key === 'o' && document.getElementById("options")!.classList.contains("hidden")){
                document.getElementById("options")!.classList.remove("hidden");
                console.log("options not hidden");
			}
		});
	}
}
  