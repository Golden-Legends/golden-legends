import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { TennisGameEnv } from "@/models/environments/tennisGameEnv";
import { PlayerInputTennisGame } from "@/models/inputsMangement/PlayerInputTennisGame";
import { Scaling } from "@/utils/Scaling";
import { AbstractMesh, Color3, HemisphericLight, Mesh, MeshBuilder, Scalar, Scene, SceneLoader, StandardMaterial, UniversalCamera, Vector3 } from "@babylonjs/core";

export class TennisGameState extends GameState{
		private _camera: UniversalCamera;
		private environment : TennisGameEnv;
		
		private isMultiplayer: boolean = false;
		// JOUEURS
		
		private input : PlayerInputTennisGame;
		// BALLE 
		private ball !: Ball;
		_paddle1!: Paddle;
    _paddle2!: Paddle;
		// DEPLACEMENT		
		private isEndGame = false;

    constructor(
        game: Game,
        canvas: HTMLCanvasElement,
        multi?: boolean,
      ) {
        super(game, canvas);
				this.isMultiplayer = multi ? multi : false;
				this._camera = this.createCamera();
				this.input = new PlayerInputTennisGame(this.scene, this.isMultiplayer);
				this.environment = new TennisGameEnv(this.scene);
				
    }

		// cameraJoueur, joueur1, filet, joueur2, boite
    async enter(): Promise<void> {
			try {
				console.log("TennisGameState")
				this.game.engine.displayLoadingUI();
				this.scene.detachControl();

				await this.setEnvironment();
				this.createLight();

				const boite = this.scene.getMeshByName("boite");
				if (boite) {
					boite.isVisible = false;
				}

				const cameraMesh = this.scene.getMeshByName("filet");
				if (cameraMesh) {
					this._camera.position = new Vector3(-cameraMesh.position.clone().x, cameraMesh.position.clone().y + 10, cameraMesh.position.clone().z);
					this._camera.rotation = new Vector3(1.50, 1.563, 0);
					// this._camera.attachControl(this.canvas, true);
				}

				//add paddles to the scene
				if (this.isMultiplayer) {
					this._paddle1 = new Paddle('player', this.scene, this.input);
					this._paddle2 = new Paddle('player2', this.scene, this.input);
					this.ball = new Ball(this.scene, this._paddle1, this._paddle2, 1);
				} else {
					this._paddle1 = new Paddle('player', this.scene, this.input);
					this._paddle2 = new Paddle('cpu', this.scene, this.input);
					this.ball = new Ball(this.scene, this._paddle1, this._paddle2, 1);
				}
				
				this.ball.initGlb();
				if (this.isMultiplayer) {
					console.log("multiplayer");
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

		private isResultShown = false;
    update(): void {
			try {
				if(!this.ball.getIsEndGame()){
					this._paddle1.handleEvent();
					if (this.isMultiplayer) {
						this._paddle2.handleEventJ2();
					} else {
						this._paddle2.moveByBallPosition(this.ball._body.position.x);
					}
					this.ball.update();
				} else {
					if (!this.isResultShown) {
						this.isResultShown = true;
						if (this.isMultiplayer) {
							console.log("Show Result Multi : ", this.ball.getScoreMulti());
						} else {
							console.log("Show Result : ", this.ball.getScore(), this.ball.getScoreMulti());
						}
					}
					console.log("End Game");
				}
			} catch (error) {
        throw new Error("Method not implemented.");
			}
    }

    async setEnvironment(): Promise<void> {
			try { 
				await this.environment.load();	
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
			// camera.attachControl(this.canvas, true);
			return camera;
		}

}

class Ball {
	_body: Mesh;
	_speed: number;
	_direction: BallDirection;
	_paddle1: Paddle;
	_paddle2: Paddle;
	meshFinJ1: AbstractMesh;
	meshFinJ2: AbstractMesh;
	private _score = 0;
	private _scoreMulti = {
		scoreJ1: 0,
		scoreJ2: 0
	};
	private _isEndGame = false;
	private indexGame = 0;
	private maxGame = 3;
	private resetBall = false;
	private resetPlacement : Vector3 = new Vector3(0, 0, 0);
	_velocity: Vector3;
	// LIMITATION
	private minX = 0;
	private maxX = 0;
	private minZ = 0;
	private maxZ = 0;
	private isReadyToRun = false;
	private _scene : Scene;
	
	constructor(scene: Scene, paddle1, paddle2: Paddle, maxGame : number) {
			// create a ball
			this._scene = scene;
			this._body = MeshBuilder.CreateSphere("ball", {
					diameter: 0.15,
					updatable: true
			}, scene);
			this.maxGame = maxGame;
			// prepare the material
			let mat = new StandardMaterial('ballMaterial', scene);
			mat.diffuseColor = new Color3(1, 0, 0);

			const ballInitMeshPosition = scene.getMeshByName("filet");
			if (ballInitMeshPosition) {
				this.resetPlacement = new Vector3(ballInitMeshPosition.getAbsolutePosition().x, -0.2, ballInitMeshPosition.getAbsolutePosition().z);
			}

			this.meshFinJ1 = new Mesh("finJ1", scene);
			this.meshFinJ2 = new Mesh("finJ2", scene);

			const finJ1 = scene.getMeshByName("finJ1");
			const finJ2 = scene.getMeshByName("finJ2");
			if(finJ1) {
				this.meshFinJ1 = finJ1;
			}
			if(finJ2) {
				this.meshFinJ2 = finJ2;
			}

			
			// add color to a ball
			this._body.material = mat;
			
			// set start speed and direction
			this._speed = 0.01;
			this._direction = 1;
			
			// enable collision
			this._body.checkCollisions = true;
			
			this._paddle1 = paddle1;
			this._paddle2 = paddle2;
			if (this._paddle2._type == 'player2') {
				this._speed = 0.002;
			}
			
			// initialisation
			this.resetBall = true;
			// set start speed and direction
			this._velocity = new Vector3(0.01, 0, 0.01);
			this._body.position.copyFrom(this.resetPlacement);
			this.setMinAndMax();
	}

	public async initGlb () {
		const assets = await this._loadAsset();
		assets.env.parent = this._body;
	}

	public async _loadAsset() {
		const result = await SceneLoader.ImportMeshAsync(
			null,
			"./models/maps/games/",
			"tennis_ball.glb",
		);

		let env = result.meshes[0];
		env.scaling = new Scaling(0.1);
		let allMeshes = env.getChildMeshes();
		allMeshes.forEach(m => {
			m.receiveShadows = false;
			m.checkCollisions = false;
		});

		return {
			env: env, //reference to our entire imported glb (meshes and transform nodes)
			allMeshes: allMeshes, // all of the meshes that are in the environment
		};
	}

	private _calculateHeight(z: number): number {
    const posj1 = this._paddle1._body.position.z;
    const posj2 = this._paddle2._body.position.z;
    const middleZ = (posj1 + posj2) / 2;
    const minHeight = -0.35;
    const maxHeight = 0.1;

    // Calcul de a, h et k pour la parabole
    const h = middleZ;
    const k = maxHeight;
    const a = minHeight / Math.pow(posj1 - h, 2);

    // Calcul de la hauteur en utilisant la formule quadratique
    const height = a * Math.pow(z - h, 2) + k;

    // Assurez-vous que la hauteur ne dépasse pas les bornes spécifiées
    return Math.max(minHeight, Math.min(height, maxHeight));
	}

	update() {
		if (!this._isEndGame) {
			if (this.indexGame - 1 >= this.maxGame) {
				// this._isEndGame = true;
				return;
			}
			if (this.resetBall && this.indexGame -1  <= this.maxGame) {
				// attendre un peu avant de relancer la balle
				this.resetBall = false;
				this._body.position.copyFrom(this.resetPlacement);
				// donne moi un nombre random entre -0.05 et 0.05
				const random = Math.random() * (0.04 - -0.04) + -0.04;
				if (this._paddle2._type == 'player2') {
					this._velocity = new Vector3(random, 0, 0.03);
				} else  {
				this._velocity = new Vector3(random, 0, -0.04); // Reset velocity if needed
					
				}
				this.indexGame++;
				this.isReadyToRun = false;
				setTimeout(() => {
					this.isReadyToRun = true;
				}, 2000);
				return;
			}
			if (this.isReadyToRun) {
				this._move();
				this._checkCollision();
				this._checkBoundaryCollision();
			}
		}
	}


	private maxSpeed = 0.2;
	_move() {
		let ballPos = this._body.position;
		this._velocity.x = Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this._velocity.x));
		this._velocity.z = Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this._velocity.z));
		ballPos.x += this._velocity.x;
		ballPos.z += this._velocity.z;

		const height = this._calculateHeight(this._body.position.z);
    this._body.position.y = height;
	}

	private _checkCollision() {
    const ballPos = this._body.position;
    const paddle1Pos = this._paddle1._body.position;
    const paddle2Pos = this._paddle2._body.position;

    // Collision with Paddle 1
    if (Math.abs(ballPos.x - paddle1Pos.x) < WIDTH / 2 && 
			Math.abs(ballPos.z - paddle1Pos.z) < HEIGHT /2 ) {
			this.hitBallBack(this._paddle1);
    }

    // Collision with Paddle 2
    if (Math.abs(ballPos.x - paddle2Pos.x) < WIDTH /2  && 
			Math.abs(ballPos.z - paddle2Pos.z) < HEIGHT/ 2) {
			this.hitBallBack(this._paddle2);
    }
	}

	private hitBallBack(paddle: Paddle) {
		this._velocity.x = (this._body.position.x - paddle._body.position.x) / 5;
		if (Math.abs(this._velocity.z) < 0.06) {
			this._velocity.z *= -1.03; 
		} else if (Math.abs(this._velocity.z) < 0.1) {
			this._velocity.z *= -1.015; 
			
		} else if (Math.abs(this._velocity.z) >= 0.15) {
			this._velocity.z *= -1.0; 
		}
		this._score++;
	}

	private _checkBoundaryCollision() {
    const ballPos = this._body.position;
		// mur sur les côtés 
    if (ballPos.x <= this.minX || ballPos.x >= this.maxX) {
			this._velocity.x *= -1;
    }
    if (ballPos.z <= this.minZ ) {
			this.resetBall = true;
			this._scoreMulti.scoreJ1++;
    } else if (ballPos.z >= this.maxZ) { 
			this.resetBall = true;
			this._scoreMulti.scoreJ2++;
		}
	}	

	private setMinAndMax () {
		const coteG = this._scene.getMeshByName("coteG");
		if (coteG) {
			coteG.isVisible = false;
			this.maxX = coteG.getAbsolutePosition().x + -0.2;
		}

		const coteD = this._scene.getMeshByName("coteR");
		if (coteD) {
			coteD.isVisible = false;
			this.minX = coteD.getAbsolutePosition().x + 0.2;
		}
		const finJ1 = this._scene.getMeshByName("finJ1");
		if (finJ1) {
			finJ1.isVisible = false;
			this.minZ = finJ1.getAbsolutePosition().z;
		}
		const finJ2 = this._scene.getMeshByName("finJ2");
		if (finJ2) {
			finJ2.isVisible = false;
			this.maxZ = finJ2.getAbsolutePosition().z;
		}
	}

	public getIsEndGame() {
		return this._isEndGame;
	}

	public getScore() {
		return this._score;
	}

	public getScoreMulti() {
		return this._scoreMulti;
	}
};

enum BallDirection {
	UP = 1,
	DOWN,
	L_UP,
	L_DOWN,
	R_UP,
	R_DOWN
}
enum PaddleDirection {
	LEFT,
	RIGHT,
	NONE
}

const WIDTH = 0.6;
const HEIGHT = 0.3;
const DEPTH = 0.1;

class Paddle {
    public _body: Mesh;
    _type: string; //player or cpu
    _direction: PaddleDirection;
		_input : PlayerInputTennisGame;
		speed = 0.05;
		private minX = 0;
		private maxX = 0;
		private scene : Scene;

    constructor(paddleType: string, scene: Scene, input: PlayerInputTennisGame) {
			this._type = paddleType;
			this._input = input;
			this._body = MeshBuilder.CreateBox(this._type, {
					depth: DEPTH,
					width: WIDTH,
					height: HEIGHT,
			}, scene);
			this.scene = scene;
			// prepare the material
			let mat = new StandardMaterial('paddleMaterial', scene);
			mat.emissiveColor = this._type == 'player' ? new Color3(0, 0, 1) : new Color3(1, 0, 0);

			// add color to a paddle
			this._body.material = mat;

			// add a position
			const player1Init = scene.getMeshByName("joueur2");
			const player2Init = scene.getMeshByName("joueur1");
			if (player1Init && player2Init) {
				this._body.position = this._type == 'player' ? player1Init.getAbsolutePosition().clone() : player2Init.getAbsolutePosition().clone();
			}

			// enable collisions
			this._body.checkCollisions = true;

			// initial direction
			this._direction = PaddleDirection.NONE;
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
    }

    handleEvent() {			
			if (this._type == 'player') {
				// mettre les limites de déplacement
				if (this._body.position.x <= this.minX) {
					if (this._input.horizontal > 0) {
						this._body.position.x += this._input.horizontal * this.speed;
					}
				} else if (this._body.position.x >= this.maxX) {
					if (this._input.horizontal < 0) {
						this._body.position.x += this._input.horizontal * this.speed;
					}
				} else {
					this._body.position.x += this._input.horizontal * this.speed;
				}
			}
    }

		handleEventJ2() {
			if (this._type == 'player2') {
				// mettre les limites de déplacement
				if (this._body.position.x <= this.minX) {
					if (this._input.horizontalJ2 > 0) {
						this._body.position.x += this._input.horizontalJ2 * this.speed;
					}
				} else if (this._body.position.x >= this.maxX) {
					if (this._input.horizontalJ2 < 0) {
						this._body.position.x += this._input.horizontalJ2 * this.speed;
					}
				} else {
					this._body.position.x += this._input.horizontalJ2 * this.speed;
				}
			}
    }

		private baseSpeed = 0;

    moveByBallPosition(x:number) {
			const movementLerpSpeed = 0.05;
			if(this._type=='cpu'){
				if(x>this._body.position.x){
					// this._body.position.x+=0.1;
					let horizontal = Scalar.Lerp(this.baseSpeed, 2, movementLerpSpeed);
					this._body.position.x += horizontal;
				}
				if(x<this._body.position.x){
					let horizontal = Scalar.Lerp(this.baseSpeed, -2, movementLerpSpeed);
					this._body.position.x += horizontal;
				}
			}
    }

    getDirection(): PaddleDirection {
			return this._direction;
    }

		public getHorizontal(): number {
			return this._input.horizontal;
		}
		public getHorizontalJ2(): number {
			return this._input.horizontalJ2;
		}
}