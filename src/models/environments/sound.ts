import { Scene, Sound } from "@babylonjs/core";

export class SoundManager {
  private _scene: Scene;
  private _music!: Sound;
  private etatMusic: boolean = false;

  constructor(scene: Scene) {
    this._scene = scene;
    this.soundGame(this._scene);
    this.soundButtonListener();
  }

  private soundButtonListener(): void {
    document.getElementById("sound-button")?.addEventListener("click", () => {
      if (this.etatMusic) {
        this.soundPause();
        // var sounds = this._scene.mainSoundTrack;
				// //changer le volume des sons
				// sounds.setVolume(0);
      } else {
        this.soundPlay();
      }
    });
  }

  private soundGame(scene: Scene): void {
    this._music = new Sound(
      "gameSong",
      "./sounds/musiqueJeu.m4a",
      scene,
      function () {},
      {
        loop: true,
        volume: 0.025,
        autoplay: false,
      },
    );
  }

  private soundPause(): void {
    this._music.pause();
    this.etatMusic = false;
    this.soundButtonListener();
  }

  private soundPlay(): void {
    this._music.play();
    this.etatMusic = true;
    this.soundButtonListener();
  }
}
