import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Mesh } from "@babylonjs/core";
import { GameState } from "../GameState";
import { PlayerInput } from "../player/PlayerInput";
import { Player } from "../controller/Player";

export class InGameState extends GameState {
    private mesh: Mesh | null = null;
    private plane : Mesh | null = null;
    private _player : Player | null = null;
    private _input : PlayerInput | null = null;

    enter() {
        // Créer et configurer la scène pour InGameState
        this.createScene();
        this._input = new PlayerInput(this.scene);
        this._player = new Player(this.mesh, this.scene, this._input);
    }

    exit() {
        // Nettoyer la scène lors de la sortie de cet état
        this.clearScene();
        
    }

    update() {
        // Logique de mise à jour pour InGameState
    }

    private createScene(): void {
        // Ajouter caméra, lumière, et objets à la scène
        // this.addCamera();
        this.addLight();
        this.addCylinder();
        this.addSurface();
    }

    private addCamera(): void {
        const camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
        camera.setTarget(Vector3.Zero());
    }

    private addLight(): void {
        new HemisphericLight("light", new Vector3(1, 1, 0), this.scene);
    }

    private addCylinder(): void {
        this.mesh = MeshBuilder.CreateCylinder("cylinder", {}, this.scene);
        this.mesh.position = new Vector3(0, 1, 0);
    }

    private addSurface(): void {
        this.plane = MeshBuilder.CreateGround("ground", {width: 15, height: 15}, this.scene);
        this.plane.position = new Vector3(0, 0, 0);
    }

}
