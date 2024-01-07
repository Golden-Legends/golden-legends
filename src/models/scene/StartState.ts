import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import { GameState } from "../GameState";

export class StartState extends GameState {
    enter() {
        // Créer et configurer la scène pour StartState
        this.createScene();
    }

    exit() {
        // Nettoyer la scène lors de la sortie de cet état
        this.clearScene();
    }

    update() {
        // Logique de mise à jour pour StartState
        
    }

    private createScene(): void {
        // Ajouter caméra, lumière, et objets à la scène
        this.addCamera();
        this.addLight();
        this.addCylinder();
    }

    private addCamera(): void {
        const camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
        camera.setTarget(Vector3.Zero());
    }

    private addLight(): void {
        new HemisphericLight("light", new Vector3(1, 1, 0), this.scene);
    }

    private addCylinder(): void {
        MeshBuilder.CreateCylinder("cylinder", {}, this.scene);
    }
}
