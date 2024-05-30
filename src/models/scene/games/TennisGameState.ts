import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { tennisGameEnv } from "@/models/environments/tennisGameEnv";
import { HemisphericLight, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";

export class TennisGameState extends GameState{
		private _camera: UniversalCamera;

    constructor(
        game: Game,
        canvas: HTMLCanvasElement,
        multi?: boolean,
      ) {
        super(game, canvas);
				this._camera = this.createCamera();
    }

		// cameraJoueur, joueur1, filet, joueur2
    async enter(): Promise<void> {
			try {
				console.log("TennisGameState")
				this.game.engine.displayLoadingUI();
				this.scene.detachControl();

				await this.setEnvironment();
				this.createLight();

				const cameraMesh = this.scene.getMeshByName("cameraJoueur");
				console.log(cameraMesh?.position)
				this._camera.position = cameraMesh?.getAbsolutePosition() as Vector3;


				this.runRenderLoop();
				await this.scene.whenReadyAsync(); // on attends que la scene soit bien chargé
				this.scene.attachControl();
				this.game.engine.hideLoadingUI();

			} catch (error) {
					throw new Error("Method not implemented.");
			}

    }
    exit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    async setEnvironment(): Promise<void> {
			try { 
				const maps = new tennisGameEnv(this.scene);
				await maps.load();

			} catch (error) {
				throw new Error("Method not implemented.");
			}
    }

		private createLight() {
			const light = new HemisphericLight(
				"light",
				new Vector3(0, 2, 0),
				this.scene,
			);
			light.intensity = 0.7;
		}

		private createCamera() : UniversalCamera {
			const camera = new UniversalCamera("camera", new Vector3(0, 1, 0), this.scene);
			camera.attachControl(this.canvas, true);
			return camera;
		}

}