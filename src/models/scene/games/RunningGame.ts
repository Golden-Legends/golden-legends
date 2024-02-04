import { FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";
import { Inspector } from '@babylonjs/inspector';


export class RunningGame extends GameState {

    enter(): void {
        try {
            this.createRunningMap();
            this.createBoxlayer();
            this.createCamera();
            this.createLight();
            Inspector.Show(this.scene, {});
            this.runRenderLoop();

            
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }
    exit(): void {
        console.log("exit running game");
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    setEnvironment(): void {
        throw new Error("Method not implemented.");
    }

    private createBoxlayer () {
        const box = MeshBuilder.CreateBox("box", {size: 2}, this.scene);
        box.position = new Vector3(2, 1, 0);
        box.rotation.y = Math.PI / 4;
    }

    private createRunningMap () {
        const plane = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, this.scene);
        plane.position.y = -1;
    }

    private createCamera() { 
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this.canvas, true);

    }

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }
}