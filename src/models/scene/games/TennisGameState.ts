import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { tennisGameEnv } from "@/models/environments/tennisGameEnv";
import { PlayerInputTennisGame } from "@/models/inputsMangement/PlayerInputTennisGame";
import { Color3, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, UniversalCamera, Vector3 } from "@babylonjs/core";

export class TennisGameState extends GameState{
		private _camera: UniversalCamera;
		
		private isMultiplayer: boolean = false;
		// JOUEURS
		private joueur1 !: Mesh;
		private joueur2 !: Mesh;
		private input : PlayerInputTennisGame;

		private score = {
			player1: 0,
			player2: 0
		}

    constructor(
        game: Game,
        canvas: HTMLCanvasElement,
        multi?: boolean,
      ) {
        super(game, canvas);
				this.isMultiplayer = multi ? multi : false;
				this._camera = this.createCamera();
				this.input = new PlayerInputTennisGame(this.scene);
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
				this._camera.position = cameraMesh?.getAbsolutePosition() as Vector3;
				this._camera.position.y += 1;
				this._camera.rotation = new Vector3(0.3, 0, 0);

				if (this.isMultiplayer) {
					console.log("multiplayer");
				} else {
					await this.initPlayer();
				}

				this.runUpdateAndRender();
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
			try {
				console.log(this.input.horizontal, this.input.horizontalAxis);
			} catch (error) {
        throw new Error("Method not implemented.");
			}
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

		private async initPlayer() {
			const player1MeshBlender = this.scene.getMeshByName("joueur1");
			this.joueur1 = MeshBuilder.CreateBox("joueur1", {width: 0.4, height: 0.2, depth: 0.1}, this.scene);
			this.joueur1.position = player1MeshBlender?.getAbsolutePosition() as Vector3;
			// mettre une couleur rouge 
			const material = new StandardMaterial("texture1", this.scene);
			material.emissiveColor = new Color3(0, 0, 1);
			this.joueur1.material = material;	
			// J2
			const player2MeshBlender = this.scene.getMeshByName("joueur2");
			this.joueur2 = MeshBuilder.CreateBox("joueur2", {width: 0.4, height: 0.2, depth: 0.1}, this.scene);
			this.joueur2.position = player2MeshBlender?.getAbsolutePosition() as Vector3;
			// mettre une couleur bleu
			const material2 = new StandardMaterial("texture2", this.scene);
			material2.emissiveColor = new Color3(1, 0, 0);
			this.joueur2.material = material2;
		}	
}