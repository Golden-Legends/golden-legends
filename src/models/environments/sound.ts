import {
	Scene,
	Sound,
} from "@babylonjs/core";

export class SoundManager {
	private _scene: Scene;

	constructor(scene: Scene) {
		this._scene = scene;
		this.soundGame(this._scene);
	}

	private soundGame(scene: Scene): void{
		let music = new Sound(
			"gameSong",
			"./sounds/musiqueJeu.m4a",
			scene,
			function () {},
			{
				loop: true,
				volume: 0.025,
                autoplay: true
			},
		);
	}
}
