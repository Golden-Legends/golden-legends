import {
	TransformNode,
	ShadowGenerator,
	Scene,
	Mesh,
	UniversalCamera,
	Vector3,
	Quaternion,
	Ray,
	AnimationGroup,
	Observable,
	ActionManager,
} from "@babylonjs/core";
import { PlayerInput } from "../inputsMangement/PlayerInput";

// clavier anglais (qwerty)
// const KEY_UP = "KeyW";
// const KEY_DOWN = "KeyS";
// const KEY_LEFT = "KeyA";
// const KEY_RIGHT = "KeyD";
// const KEY_DASH = "KeyP";
// const KEY_JUMP = "Space";

// clavier français (azerty)
const KEY_UP = "KeyW";
const KEY_DOWN = "KeyS";
const KEY_LEFT = "KeyA";
const KEY_RIGHT = "KeyD";
const KEY_ARROW_LEFT = "ArrowLeft";
const KEY_ARROW_RIGHT = "ArrowRight";
const KEY_ARROW_UP = "ArrowUp";
const KEY_ARROW_DOWN = "ArrowDown";
const KEY_DASH = "KeyP";
const KEY_JUMP = "Space";

export class Player extends TransformNode {
	public camera;
	public scene: Scene;
	private _input: PlayerInput | null;

	//Player
	public mesh: Mesh; //outer collisionbox of player

	//Camera
	private _camRoot: TransformNode;
	private _yTilt: TransformNode;

	//const values
	private static readonly PLAYER_SPEED: number = 0.3;
	private static readonly JUMP_FORCE: number = 0.2;
	private static readonly GRAVITY: number = -0.8;
	private static readonly DASH_FACTOR: number = 2.5;
	private static readonly DASH_TIME: number = 10; //how many frames the dash lasts
	private static readonly ORIGINAL_TILT: Vector3 = new Vector3(
		0.5934119456780721,
		0,
		0,
	);
	public dashTime: number = 0;

	//player movement vars
	private _deltaTime: number = 0;
	private _h: number;
	private _v: number;

	private _moveDirection: Vector3 = new Vector3();
	private _inputAmt: number;

	//dashing
	private _dashPressed: boolean;
	private _canDash: boolean = true;

	//animations
	private _run: AnimationGroup;
	private _idle: AnimationGroup;
	private _jump: AnimationGroup;
	private _land: AnimationGroup;
	private _dance: AnimationGroup;

	// animation trackers
	private _currentAnim: AnimationGroup | null = null;
	private _prevAnim: AnimationGroup;
	private _isFalling: boolean = false;
	private _jumped: boolean = false;

	//observables
	public onRun = new Observable();

	//gravity, ground detection, jumping
	private _gravity: Vector3 = new Vector3();
	private _lastGroundPos: Vector3 = Vector3.Zero(); // keep track of the last grounded position
	private _grounded: boolean;
	private _jumpCount: number = 1;

	private readonly CAMERA_MIN_ANGLE = Math.PI / 12; // Limite de rotation vers le haut
	private readonly CAMERA_MAX_ANGLE = Math.PI / 3; // Limite de rotation vers le bas
	private isMouseVisible: boolean = true;


	constructor(assets, scene: Scene, shadowGenerator: ShadowGenerator, input?) {
		super("player", scene);
		this.scene = scene;
		this._setupPlayerCamera();

		this.mesh = assets.mesh;
		this.mesh.parent = this;
		this.mesh.rotationQuaternion = Quaternion.Identity();

		this._idle = assets.animationGroups.find(ag => ag.name === "idle");
		this._jump = assets.animationGroups.find(ag => ag.name === "jump");
		this._run = assets.animationGroups.find(ag => ag.name === "running");
		this._land = assets.animationGroups.find(ag => ag.name === "falling");
		this._dance = assets.animationGroups.find(ag => ag.name === "dance");

		this._setUpAnimations();
		shadowGenerator.addShadowCaster(assets.mesh); //the player mesh will cast shadows

		this._input = input;

		//--COLLISIONS--
		this.mesh.actionManager = new ActionManager(this.scene);
		this._handleEscapeKey();
	}

	public setInput(input: PlayerInput | null) {
		this._input = input;
	}

	private _setUpAnimations(): void {
		this.scene.stopAllAnimations();
		this._run.loopAnimation = true;
		this._idle.loopAnimation = true;

		//initialize current and previous
		this._currentAnim = this._land;
		this._prevAnim = this._idle;
	}

	private _animatePlayer(): void {
		if (
			!this._dashPressed &&
			!this._isFalling &&
			!this._jumped &&
			(this._input.inputMap[KEY_UP] ||
				this._input.inputMap[KEY_DOWN] ||
				this._input.inputMap[KEY_LEFT] ||
				this._input.inputMap[KEY_RIGHT])
		) {
			this._currentAnim = this._run;
			this.onRun.notifyObservers(true);
		} else if (this._jumped && !this._isFalling && !this._dashPressed) {
			this._currentAnim = this._jump;
			if (!this._jump.play()) {
				this._jumped = false;
			}
		} else if (!this._isFalling && this._grounded) {
			this._currentAnim = this._idle;
			//only notify observer if it's playing
			// if (this.scene.getSoundByName("walking").isPlaying) {
			// 	this.onRun.notifyObservers(false);
			// }
		} else if (this._isFalling) {
			// rajouter une anim land
			this._currentAnim = this._land;
		}

		//Animations
		if (this._currentAnim != null && this._prevAnim !== this._currentAnim) {
			this._prevAnim.stop();
			this._currentAnim.play(this._currentAnim.loopAnimation);
			this._prevAnim = this._currentAnim;
		}
	}

	private _updateFromControls(): void {
		if (this._input) {
			this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
			// console.log(this.mesh.position); // utilie pour récup les positions du joueur
			this._moveDirection = Vector3.Zero(); // vector that holds movement information
			this._h = this._input.horizontal; //x-axis
			this._v = this._input.vertical; //z-axis

			if (
				this._input.dashing &&
				!this._dashPressed &&
				this._canDash &&
				!this._grounded
			) {
				this._canDash = false; //we've started a dash, do not allow another
				this._dashPressed = true; //start the dash sequence
			}

			let dashFactor = 1;
			//if you're dashing, scale movement
			if (this._dashPressed) {
				if (this.dashTime > Player.DASH_TIME) {
					this.dashTime = 0;
					this._dashPressed = false;
				} else {
					dashFactor = Player.DASH_FACTOR;
				}
				this.dashTime++;
			}

			//--MOVEMENTS BASED ON CAMERA (as it rotates)--
			let fwd = this._camRoot.forward;
			let right = this._camRoot.right;
			let correctedVertical = fwd.scaleInPlace(this._v);
			let correctedHorizontal = right.scaleInPlace(this._h);

			//movement based off of camera's view
			let move = correctedHorizontal.addInPlace(correctedVertical);

			//clear y so that the character doesnt fly up, normalize for next step, taking into account whether we've DASHED or not
			this._moveDirection = new Vector3(
				move.normalize().x * dashFactor,
				0,
				move.normalize().z * dashFactor,
			);

			//clamp the input value so that diagonal movement isn't twice as fast
			let inputMag = Math.abs(this._h) + Math.abs(this._v);
			if (inputMag < 0) {
				this._inputAmt = 0;
			} else if (inputMag > 1) {
				this._inputAmt = 1;
			} else {
				this._inputAmt = inputMag;
			}

			//final movement that takes into consideration the inputs
			this._moveDirection = this._moveDirection.scaleInPlace(
				this._inputAmt * Player.PLAYER_SPEED,
			);

			// Rotations
			// Check if there is movement to determine if rotation is needed
			let input = new Vector3(
				this._input.horizontalAxis,
				0,
				this._input.verticalAxis,
			);

			// Rotation de la caméra sur l'axe des Y en utilisant les flèches gauche et droite
			let cameraRotationSpeed = 0.025; // Ajustez cette valeur pour contrôler la vitesse de rotation
			if (this._input.inputMap[KEY_ARROW_LEFT]) {
				this._camRoot.rotation.y -= cameraRotationSpeed;
			}
			if (this._input.inputMap[KEY_ARROW_RIGHT]) {
				this._camRoot.rotation.y += cameraRotationSpeed;
			}

			// Rotation de la caméra sur l'axe des X en utilisant les flèches haut et bas
			let cameraRotationSpeedX = 0.02; // Ajustez cette valeur pour contrôler la vitesse de rotation
			if (this._input.inputMap[KEY_ARROW_DOWN]) {
				let newRotationX = this._camRoot.rotation.x - cameraRotationSpeedX;
				// Ajoutez une limite pour éviter une rotation complète vers le haut
				if (newRotationX > this.CAMERA_MIN_ANGLE) {
					this._camRoot.rotation.x = newRotationX;
				}
			}
			if (this._input.inputMap[KEY_ARROW_UP]) {
				let newRotationX = this._camRoot.rotation.x + cameraRotationSpeedX;
				// Ajoutez une limite pour éviter une rotation complète vers le bas
				if (newRotationX < this.CAMERA_MAX_ANGLE) {
					this._camRoot.rotation.x = newRotationX;
				}
			}

			if (input.length() == 0) {
				// If there's no input detected, prevent rotation and keep player in same rotation
				return;
			}

			// Rotation based on input & the camera angle
			let angle = Math.atan2(
				this._input.horizontalAxis,
				this._input.verticalAxis,
			);
			angle += this._camRoot.rotation.y + Math.PI;
			let targ = Quaternion.FromEulerAngles(0, angle, 0);

			this.mesh.rotationQuaternion = Quaternion.Slerp(
				this.mesh.rotationQuaternion,
				targ,
				10 * this._deltaTime,
			);
		}
	}

	private _floorRaycast(
		offsetx: number,
		offsetz: number,
		raycastlen: number,
	): Vector3 {
		let raycastFloorPos = new Vector3(
			this.mesh.position.x + offsetx,
			this.mesh.position.y + 0.5,
			this.mesh.position.z + offsetz,
		);
		let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

		let predicate = function (mesh) {
			return mesh.isPickable && mesh.isEnabled();
		};
		let pick = this.scene.pickWithRay(ray, predicate);

		if (pick.hit) {
			return pick.pickedPoint;
		} else {
			return Vector3.Zero();
		}
	}

	private _isGrounded(): boolean {
		if (this._floorRaycast(0, 0, 0.6).equals(Vector3.Zero())) {
			return false;
		} else {
			return true;
		}
	}

	private _checkSlope(): boolean {
		//only check meshes that are pickable and enabled (specific for collision meshes that are invisible)
		let predicate = function (mesh) {
			return mesh.isPickable && mesh.isEnabled();
		};

		//4 raycasts outward from center
		let raycast = new Vector3(
			this.mesh.position.x,
			this.mesh.position.y + 0.5,
			this.mesh.position.z + 0.25,
		);
		let ray = new Ray(raycast, Vector3.Up().scale(-1), 1.5);
		let pick = this.scene.pickWithRay(ray, predicate);

		let raycast2 = new Vector3(
			this.mesh.position.x,
			this.mesh.position.y + 0.5,
			this.mesh.position.z - 0.25,
		);
		let ray2 = new Ray(raycast2, Vector3.Up().scale(-1), 1.5);
		let pick2 = this.scene.pickWithRay(ray2, predicate);

		let raycast3 = new Vector3(
			this.mesh.position.x + 0.25,
			this.mesh.position.y + 0.5,
			this.mesh.position.z,
		);
		let ray3 = new Ray(raycast3, Vector3.Up().scale(-1), 1.5);
		let pick3 = this.scene.pickWithRay(ray3, predicate);

		let raycast4 = new Vector3(
			this.mesh.position.x - 0.25,
			this.mesh.position.y + 0.5,
			this.mesh.position.z,
		);
		let ray4 = new Ray(raycast4, Vector3.Up().scale(-1), 1.5);
		let pick4 = this.scene.pickWithRay(ray4, predicate);

		if (pick.hit && !pick.getNormal().equals(Vector3.Up())) {
			if (pick.pickedMesh.name.includes("stair")) {
				return true;
			}
		} else if (pick2.hit && !pick2.getNormal().equals(Vector3.Up())) {
			if (pick2.pickedMesh.name.includes("stair")) {
				return true;
			}
		} else if (pick3.hit && !pick3.getNormal().equals(Vector3.Up())) {
			if (pick3.pickedMesh.name.includes("stair")) {
				return true;
			}
		} else if (pick4.hit && !pick4.getNormal().equals(Vector3.Up())) {
			if (pick4.pickedMesh.name.includes("stair")) {
				return true;
			}
		}
		return false;
	}

	private _updateGroundDetection(): void {
		this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;

		// Stocker le résultat de la première invocation de _isGrounded()
		const isGrounded = this._isGrounded();

		//if not grounded
		if (!isGrounded) {
			//if the body isnt grounded, check if it's on a slope and was either falling or walking onto it
			if (this._checkSlope() && this._gravity.y <= 0) {
				console.log("slope");
				//if you are considered on a slope, you're able to jump and gravity wont affect you
				this._gravity.y = 0;
				this._jumpCount = 1;
				this._grounded = true;
			} else {
				//keep applying gravity
				this._gravity = this._gravity.addInPlace(
					Vector3.Up().scale(this._deltaTime * Player.GRAVITY),
				);
				this._grounded = false;
			}
		}

		//limit the speed of gravity to the negative of the jump power
		if (this._gravity.y < -Player.JUMP_FORCE) {
			this._gravity.y = -Player.JUMP_FORCE;
		}

		//cue falling animation once gravity starts pushing down
		if (this._gravity.y < 0 && this._jumped) {
			//todo: play a falling anim if not grounded BUT not on a slope
			this._isFalling = true;
		}

		//update our movement to account for jumping
		// on enleve on veut le faire avec bounder
		this.mesh.moveWithCollisions(this._moveDirection.addInPlace(this._gravity));
		if (isGrounded) {
			this._gravity.y = 0;
			this._grounded = true;
			//keep track of last known ground position
			this._lastGroundPos.copyFrom(this.mesh.position);

			this._jumpCount = 1;
			//dashing reset
			this._canDash = true;
			//reset sequence(needed if we collide with the ground BEFORE actually completing the dash duration)
			this.dashTime = 0;
			this._dashPressed = false;

			//jump & falling animation flags
			this._jumped = false;
			this._isFalling = false;
		}

		//Jump detection
		if (this._input.jumpKeyDown && this._jumpCount > 0) {
			this._gravity.y = Player.JUMP_FORCE;
			this._jumpCount--;

			//jumping and falling animation flags
			this._jumped = true;
			this._isFalling = false;
		}
	}

	private _beforeRenderUpdate(): void {
		if (this._input) {
			this._updateFromControls();
			this._updateGroundDetection();
			this._animatePlayer();
			this._updateCameraWithMouse();
		}
	}

	private _updateCameraWithMouse(): void {
		const mouseSensitivity = 0.000002; // Ajustez la sensibilité de la souris selon vos besoins

		window.addEventListener('mousedown', () => {
			// Cachez la souris lorsqu'elle est cliquée
			this.isMouseVisible = false;
			document.body.style.cursor = 'none'; // Cachez le curseur de la souris
		});
	
		window.addEventListener('mousemove', (event) => {
			if(this.isMouseVisible) return;
			let deltaX = event.movementX * mouseSensitivity;
			let deltaY = event.movementY * mouseSensitivity;
	
			// Ajustez la rotation de la caméra autour de l'axe Y pour la rotation horizontale
			this._camRoot.rotation.y += deltaX;
	
			// Ajustez la rotation de la caméra autour de l'axe X pour la rotation verticale
			let newRotationX = this._yTilt.rotation.x + deltaY;
			// Ajoutez des limites pour éviter une rotation complète vers le haut ou vers le bas
			if (newRotationX > this.CAMERA_MIN_ANGLE && newRotationX < this.CAMERA_MAX_ANGLE) {
				// console.log(newRotationX);
				this._yTilt.rotation.x = newRotationX;
			}
		});
	}

	private _handleEscapeKey(): void {
		window.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				// Réinitialisez l'état de visibilité de la souris à true lorsque la touche "Échap" est pressée
				this.isMouseVisible = true;
				document.body.style.cursor = 'auto'; // Réaffichez le curseur de la souris
			}
		});
	}

	public activatePlayerCamera(): UniversalCamera {
		this.scene.registerBeforeRender(() => {
			this._beforeRenderUpdate();
			this._updateCamera();
		});
		return this.camera;
	}

	private _updateCamera(): void {
		let centerPlayer = this.mesh.position.y + 2;
		this._camRoot.position = Vector3.Lerp(
			this._camRoot.position,
			new Vector3(this.mesh.position.x, centerPlayer, this.mesh.position.z),
			0.4,
		);
	}

	private _setupPlayerCamera(): UniversalCamera {
		//root camera parent that handles positioning of the camera to follow the player
		this._camRoot = new TransformNode("root");
		this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
		//to face the player from behind (180 degrees)
		this._camRoot.rotation = new Vector3(0, Math.PI, 0);

		//rotations along the x-axis (up/down tilting)
		let yTilt = new TransformNode("ytilt");
		//adjustments to camera view to point down at our player
		yTilt.rotation = Player.ORIGINAL_TILT;
		this._yTilt = yTilt;
		yTilt.parent = this._camRoot;

		//our actual camera that's pointing at our root's position
		this.camera = new UniversalCamera(
			"cam",
			new Vector3(0, -3, -10),
			this.scene,
		);
		this.camera.lockedTarget = this._camRoot.position;
		this.camera.fov = 0.6;
		this.camera.parent = yTilt;

		this.scene.activeCamera = this.camera;
		return this.camera;
	}
}