import { FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";
import { Inspector } from '@babylonjs/inspector';
import { CustomLoadingScreen } from "../../loadingScreen/customLoadingScreen";
import { runningGameEnv } from "../../environments/runningGameEnv";


export class RunningGame extends GameState {

    async enter(): Promise<void> {
        try {
            // Inspector.Show(this.scene, {});

            // Initialiser le premier état du jeu ici
            const loadingScreen = new CustomLoadingScreen("Loading...");
            await loadingScreen.loadGui();
            this.game.engine.loadingScreen = loadingScreen;
            this.game.engine.displayLoadingUI();

            await this.createRunningMap();
            this.createBoxlayer();
            this.createCamera();
            this.createLight();
            this.runRenderLoop();

            setTimeout(() => {
                this.game.engine.hideLoadingUI();
            }
            , 100); // penser à le mettre à 2500 pour rémi

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
        box.position = new Vector3(-4.49, 2.50, -35.24);
        box.rotation = new Vector3(0, 89.58, 0);
    }

    private createRunningMap () {
        const maps = new runningGameEnv(this.scene);
        maps.load();
    }

    private createCamera() { 
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        // This targets the camera to scene origin
        camera.attachControl(this.canvas, true);
        camera.position = new Vector3(22.72, 22.07, -31.21);
        camera.rotation = new Vector3(27.69, 90.00, 0.00);
        // camera.setTarget();

    }

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }
}