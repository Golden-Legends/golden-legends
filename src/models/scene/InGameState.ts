import {
	Color3,
	HemisphericLight,
	Matrix,
	Mesh,
	MeshBuilder,
	Nullable,
	PointLight,
	Scene,
	SceneLoader,
	ShadowGenerator,
	Vector3,
} from "@babylonjs/core";
import {GameState} from "../GameState";
import {PlayerInput} from "../inputsMangement/PlayerInput";
import {Player} from "../controller/Player";
import {Environment} from "../environments/environments";
import {Character} from "../intefaces/Character";
import {Scaling} from "../../utils/Scaling.ts";
import {RunningGameState} from "./games/RunningGameState.ts";
import {AdvancedDynamicTexture, Control} from "@babylonjs/gui";
import ky from "ky";
import {socket} from "../../utils/socket.ts";
import {BACK_URL} from "../../utils/constants.ts";
import { JumpGame } from "./miniGames/JumpGame.ts";
import { ObjectGame } from "./miniGames/ObjectGame.ts";


export class InGameState extends GameState {
	public assets;
	private loadedGui: AdvancedDynamicTexture | undefined;
	private background : Nullable<Control> = null;
	private character: Character = {
		fileName: "amy.glb",
		scalingVector3: new Scaling(0.01)
	};
	private _input: PlayerInput;
	private jumpGame!: JumpGame;
	private objectGame!: ObjectGame;

	constructor(game, canvas) {
		super(game, canvas);
		this._input = new PlayerInput(this.scene);
	}

	async enter() {
		// Request to server to tell that the user is in game
		ky.post(`${BACK_URL}/join-main-lobby`, {
			json: {
				playerName: "test",
			},
		});

		this.loadedGui = await AdvancedDynamicTexture.ParseFromFileAsync("public/gui/gui_gate_runningGame.json", true);
		this.background = this.loadedGui.getControlByName("CONTAINER");
		this.initButtons(this.loadedGui);
		if (this.background) {
			this.closeGui(this.background);
		}
		await this._loadCharacterAssets(this.scene);

		// création des controlles du joueur
		this._input = new PlayerInput(this.scene);

		this._initPlayer(this.scene).then(async () => {
			if (!!this._player) {
				await this._player.activatePlayerCamera();
				this.jumpGame = new JumpGame(this.scene, this._player.mesh, this._input);
				this.objectGame = new ObjectGame(this.scene, this._player.mesh, this._input);
			}
		});

		// set environments
		await this.setEnvironment();

		// Inspector.Show(this.scene, {});

		// lancer la boucle de rendu
		this.runUpdateAndRender();
		this.handlePointerLockChange();

		// lancer le mini jeu
		if (this.jumpGame){
			this.jumpGame.init();
		}

		if (this.objectGame){
			this.objectGame.init();
		}

		socket.on("joinMainLobby", (playerName: string) => {
			console.log("NEW PLAYER JOINED THE GAME: ", playerName);
		});
	}

	exit() {
		// Nettoyer la scène lors de la sortie de cet état
		this.clearScene();
		this.loadedGui?.dispose();
	}

	update() {
		
	}

	private async _loadCharacterAssets(scene: Scene){

		async function loadCharacter(characterFileAndScaling: Character){
			//collision mesh
			const outer = MeshBuilder.CreateBox(
				"outer",
				{ width: 3.5, depth: 2.5, height: 15 },
				scene,
			);
			// pour afficher la box qui sert de collision
			outer.isVisible = false;
			outer.isPickable = false;
			outer.checkCollisions = true;
			//move origin of box collider to the bottom of the mesh (to match player mesh)
			outer.bakeTransformIntoVertices(Matrix.Translation(0, 7, 0));
			//for collisions
			outer.ellipsoid = new Vector3(1, 1.5, 1);
			outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

			//--IMPORTING MESH--
			return SceneLoader.ImportMeshAsync(
				null,
				"./models/characters/",
				characterFileAndScaling.fileName,
				scene,
			).then(result => {
				const root = result.meshes[0];
				//body is our actual player mesh
				const body = root;
				body.parent = outer;
				body.isPickable = false;
				body.getChildMeshes().forEach(m => {
					m.isPickable = false;
				});
				body.scaling = characterFileAndScaling.scalingVector3;
				body.showBoundingBox = true;
				// enlever l'animation à l'indice 0 de animationsGroups
				result.animationGroups[0].stop();
				const idle = result.animationGroups.find(ag => ag.name === "idle");
				idle?.start();
				//return the mesh and animations
				return {
					mesh: outer as Mesh,
					animationGroups: result.animationGroups,
				};
			});
		}	

		return loadCharacter(this.character).then(assets=> {
			this.assets = assets;
		})

	}

	private async _initPlayer(scene: Scene): Promise<void> {
		new HemisphericLight("HemiLight", new Vector3(0, 3, 0), scene);

		const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
		light.diffuse = new Color3(
			0.08627450980392157,
			0.10980392156862745,
			0.15294117647058825,
		);
		light.intensity = 35;
		light.radius = 1;

		const shadowGenerator = new ShadowGenerator(1024, light);
		shadowGenerator.darkness = 0.4;

		//Create the player
		this._player = new Player(this.assets, scene, shadowGenerator, this._input);
		this._player.mesh.position = new Vector3(-170, 2.75, -5);
		
	}

	async setEnvironment(): Promise<void> {
		// ENVIRONMENT
		this._environment = new Environment(this.scene, this._player, this);
        await this._environment.load();
	}

	public goToRunningGame() {
		this.game.changeState(new RunningGameState(this.game, this.canvas));
	}


	private initButtons (gui: AdvancedDynamicTexture) {
		const exitButton = gui.getControlByName("NO_BUTTON-bjs");
		if (exitButton) {
			exitButton.onPointerClickObservable.add( () => {  
				// dont display the gui 
				if (this.background) {
					this.closeGui(this.background);
				}

			});
		}

		const enterButton = gui.getControlByName("YES_BUTTON-bjs");
		if (enterButton) {
			enterButton.onPointerClickObservable.add( () => {  
				this.goToRunningGame()
			});
		}
		
	}

	public closeGui(background : Control) {
		background.isVisible = false;
	}

	public openGui (background : Control) {
		background.isVisible = true;
	}

	public getBackground() : Nullable<Control> {
		return this.background;
	}
	
}
