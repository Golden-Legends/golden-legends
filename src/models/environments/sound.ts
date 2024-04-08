import {
	Color3,
	Mesh,
	MeshBuilder,
	Scene,
	Sound,
	StandardMaterial,
	Vector3,
} from "@babylonjs/core";

export class SoundManager {
	private _scene: Scene;
	private _character: Mesh;
	private _sphereMat: StandardMaterial;

	constructor(scene: Scene, mesh: Mesh) {
		this._scene = scene;
		this._character = mesh;

		this._sphereMat = new StandardMaterial("sphereMat", this._scene);
		this._sphereMat.diffuseColor = Color3.Purple();
		this._sphereMat.backFaceCulling = false;
		this._sphereMat.alpha = 0.3;

		this.soundGame(this._sphereMat, this._scene);
	}

	private soundGame(sphereMat: StandardMaterial, scene: Scene): void{
		// set a music sphere to play music when the player is in it
		let boxMusic = MeshBuilder.CreateBox(
			"musique1",
			{ width: 250, height: 25, depth: 250},
			this._scene,
		);
		boxMusic.material = sphereMat;
		boxMusic.position = new Vector3(
			-148,
			2.75,
			-60,
		);
		boxMusic.visibility = 0;

		let music = new Sound(
			"gameSong",
			"./sounds/musiqueJeu.m4a",
			scene,
			function () {},
			{
				loop: true,
				volume: 0.025,
			},
		);
		music.setPosition(
			new Vector3(-148, 2.75, -60),
		);

		this._scene.registerBeforeRender(() => {
			if (this._isCharacterInsideBox(boxMusic)) {
				if (!music.isPlaying) {
					music.play();
				}
			} else {
				if (music.isPlaying) {
					music.pause();
				}
			}
		});
	}


	private _isCharacterInsideBox(box: Mesh): boolean {
		let boxMin = box.getBoundingInfo().boundingBox.minimumWorld;
		let boxMax = box.getBoundingInfo().boundingBox.maximumWorld;
		let characterPos = this._character.position;

		return (
			characterPos.x >= boxMin.x &&
			characterPos.x <= boxMax.x &&
			characterPos.y >= boxMin.y &&
			characterPos.y <= boxMax.y &&
			characterPos.z >= boxMin.z &&
			characterPos.z <= boxMax.z
		);
	}
}
