import { Color4, FreeCamera, Vector3 } from "@babylonjs/core";
import { GameState } from "../GameState";

export class MainMenuState extends GameState {
	
	async enter() {
		console.info("Entering MainMenuState");
		this.scene.clearColor = Color4.FromHexString("#A0CFC9");
		let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this.scene); 
		camera.setTarget(Vector3.Zero());


		await this.scene.whenReadyAsync();

		this.runRender();
	}

	exit() {
		// Nettoyer la scène lors de la sortie de cet état
		this.clearScene();
	}

	update() {
		// Logique de mise à jour pour InGameState
		
	}
	
	setEnvironment(): void {
		throw new Error("Method not implemented.");
	}
}
