import { Color4, FreeCamera, Vector3 } from "@babylonjs/core";
import { GameState } from "../GameState";
import { MainMenuStateGui } from "../gui/MainMenuStateGui";
import { Game } from "../Game";
import { InGameState } from "./InGameState";

export class MainMenuState extends GameState {
	private mainMenuGui: MainMenuStateGui;
	
	constructor(game : Game, canvas : HTMLCanvasElement) {
		super(game, canvas);
		this.mainMenuGui = new MainMenuStateGui();
	}

	async enter() {
		console.info("Entering MainMenuState");
		console.info("Setting up camera")
		this.setCamera();
		
		this.scene.clearColor = Color4.FromHexString("#A0CFC9");
		
		this.mainMenuGui = new MainMenuStateGui();

		// Attendre que la scène soit prête avant de lancer le rendu
		await this.scene.whenReadyAsync();

		this.activateStartButton();
		this.runRender();
	}

	exit() {
		// Nettoyer la scène lors de la sortie de cet état
		this.clearScene();
		this.mainMenuGui.dispose();
	}

	update() {
		// Logique de mise à jour pour InGameState
		
	}

	// Initialiser la caméra
	setCamera(): void {
		const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
		camera.setTarget(Vector3.Zero());
		camera.attachControl(this.canvas, true);
	}
	
	setEnvironment(): void {
		throw new Error("Method not implemented.");
	}

	activateStartButton(): void {
		this.mainMenuGui.getStartButton().onPointerUpObservable.add(() => {
			this.game.changeState(new InGameState(this.game, this.canvas));
		}
		);
	}
}
