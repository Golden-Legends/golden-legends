import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { TennisGameEnv } from "@/models/environments/tennisGameEnv";
import { PlayerInputTennisGame } from "@/models/inputsMangement/PlayerInputTennisGame";
import { Color3, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, UniversalCamera, Vector3 } from "@babylonjs/core";

export class TennisGameState extends GameState{
		private _camera: UniversalCamera;
		private environment : TennisGameEnv;
		
		private isMultiplayer: boolean = false;
		// JOUEURS
		private joueur1 !: Mesh;
		private joueur2 !: Mesh;
		private input : PlayerInputTennisGame;
		// BALLE 
		private ball : Ball;
		private ballSpeed = 0.05;
		// DEPLACEMENT
		private speed = 0.05;
		// LIMITATION
		private minX = 0;
		private maxX = 0;
		private minZ = 0;
		private maxZ = 0;

		private score = {
			player1: 0,
			player2: 0
		}
		private isEndGame = false;
		private limitTime = 30;

    constructor(
        game: Game,
        canvas: HTMLCanvasElement,
        multi?: boolean,
      ) {
        super(game, canvas);
				this.isMultiplayer = multi ? multi : false;
				this._camera = this.createCamera();
				this.input = new PlayerInputTennisGame(this.scene);
				this.environment = new TennisGameEnv(this.scene);
				this.ball = new Ball(this.scene);
    }

		// cameraJoueur, joueur1, filet, joueur2, boite
    async enter(): Promise<void> {
			try {
				console.log("TennisGameState")
				this.game.engine.displayLoadingUI();
				this.scene.detachControl();

				await this.setEnvironment();
				this.ball.initBall();
				this.createLight();

				const boite = this.scene.getMeshByName("boite");
				if (boite) {
					boite.isVisible = false;
				}

				this._camera.rotation = new Vector3(0.3, 0, 0);
				const cameraMesh = this.scene.getMeshByName("cameraJoueur");
				if (cameraMesh) {
					this._camera.position = new Vector3(-cameraMesh.position.x, cameraMesh.position.y + 1.5, cameraMesh.position.z - 0.7);
				}

				if (this.isMultiplayer) {
					console.log("multiplayer");
				} else {
					await this.initPlayer();
				}

				this.joueur1.checkCollisions = true;
				console.log("player : ",  this.joueur1.checkCollisions)
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
				this.deplacementJoueur1();
				this.ball.update();
			} catch (error) {
        throw new Error("Method not implemented.");
			}
    }

    async setEnvironment(): Promise<void> {
			try { 
				await this.environment.load();

				const coteG = this.scene.getMeshByName("coteG");
				if (coteG) {
					coteG.isVisible = false;
					this.maxX = coteG.getAbsolutePosition().x + -0.2;
				}

				const coteD = this.scene.getMeshByName("coteR");
				if (coteD) {
					coteD.isVisible = false;
					this.minX = coteD.getAbsolutePosition().x + 0.2;
				}
				const finJ1 = this.scene.getMeshByName("finJ1");
				if (finJ1) {
					finJ1.isVisible = false;
					this.minZ = finJ1.getAbsolutePosition().z;
				}
				const finJ2 = this.scene.getMeshByName("finJ2");
				if (finJ2) {
					finJ2.isVisible = false;
					this.maxZ = finJ2.getAbsolutePosition().z;
				}

				

			} catch (error) {
				throw new Error("Method not implemented.");
			}
    }

		private createLight() {
			const light = new HemisphericLight(
				"light",
				new Vector3(1, 2, 1),
				this.scene,
			);
			light.intensity = 0.8;
		}

		private createCamera() : UniversalCamera {
			const camera = new UniversalCamera("camera", new Vector3(0, 1, 0), this.scene);
			camera.attachControl(this.canvas, true);
			return camera;
		}

		private async initPlayer() {
			const player1MeshBlender = this.scene.getMeshByName("joueur1");
			this.joueur1 = MeshBuilder.CreateBox("joueur1", {width: 0.4, height: 0.3, depth: 0.1}, this.scene);
			this.joueur1.position = player1MeshBlender?.getAbsolutePosition() as Vector3;
			// mettre une couleur rouge 
			const material = new StandardMaterial("texture1", this.scene);
			material.emissiveColor = new Color3(0, 0, 1);
			this.joueur1.material = material;	
			// J2
			const player2MeshBlender = this.scene.getMeshByName("joueur2");
			this.joueur2 = MeshBuilder.CreateBox("joueur2", {width: 0.4, height: 0.3, depth: 0.1}, this.scene);
			this.joueur2.position = player2MeshBlender?.getAbsolutePosition() as Vector3;
			// mettre une couleur bleu
			const material2 = new StandardMaterial("texture2", this.scene);
			material2.emissiveColor = new Color3(1, 0, 0);
			this.joueur2.material = material2;
		}	

		private deplacementJoueur1() {
			const newX = this.joueur1.position.x + this.input.horizontal * this.speed;
			// Vérification des limites
			if (newX < this.minX) {
				this.joueur1.position.x = this.minX;
			} else if (newX > this.maxX) {
				this.joueur1.position.x = this.maxX;
			} else {
				this.joueur1.position.x = newX;
			}
		}
}

class Ball {
	private direction: Vector3;
	private speed: number;
	private ball: Mesh;
	private scene: Scene;
	private hasStarted = false;

	constructor(scene: Scene) {
		this.scene = scene;
		this.speed = 0.01;
		this.ball = new Mesh("ball");
		this.direction = new Vector3(0, 0, 0);
	}

	public update() {
		if (!this.hasStarted) {
			this.hasStarted = true;
			this.startBallMovement();
			return;
		}
		this.ball.position.z += this.direction.z * this.speed;
		console.log(this.ball.position.z, this.direction.z, this.speed);
	}

	public startBallMovement () {
		let direction = Math.random() < 0.5 ? -1 : 1;
		this.direction = new Vector3(0, 0, direction);
	}

	public initBall () : void { 
		const ball = MeshBuilder.CreateSphere("ball", { diameter: 0.15 }, this.scene);
		const getFiletMesh = this.scene.getMeshByName("filet");
		if (getFiletMesh) {
			ball.position = new Vector3(-getFiletMesh.position.x, getFiletMesh.position.y + 0.1, getFiletMesh.position.z);
		}
		// la mettre en rouge
		const material = new StandardMaterial("texture1", this.scene);
		material.emissiveColor = new Color3(1, 1, 0);
		ball.material = material;
		this.ball = ball;
	}
}