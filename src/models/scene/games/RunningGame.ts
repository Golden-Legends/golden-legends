import { MeshBuilder } from "@babylonjs/core";
import { GameState } from "../../GameState";
import { Inspector } from '@babylonjs/inspector';


export class RunningGame extends GameState {

    enter(): void {
        try {
            this.createRunningMap();
            this.createBoxlayer();
            Inspector.Show(this.scene, {});
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
        box.position.y = 1;
        box.position.x = 3;
        box.position.z = 3;
        box.rotation.y = Math.PI / 4;
    }

    private createRunningMap () {
        const plane = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, this.scene);
        plane.position.y = -1;
    }
}