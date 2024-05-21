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
    
}
  