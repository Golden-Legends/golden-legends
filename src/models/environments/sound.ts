import { Music } from "@/utils/Music";
import { Scene, Sound } from "@babylonjs/core";

export class SoundManager {
  private _scene: Scene;
  private _music!: Sound;
  private etatMusic: boolean = true;
  public music = Music.getInstance("./sounds/musiqueJeu.m4a", 0.025);

  constructor(scene: Scene) {
    this._scene = scene;
    // this.soundGame(this._scene);
    this.soundButtonListener();
    this.music.modifMusique("./sounds/musiqueJeu.m4a", 0.025);
  }

  private soundButtonListener(): void {
    document.getElementById("sound-button")?.addEventListener("click", () => {
      console.log("click");
      this.music = Music.getInstance("./sounds/musiqueJeu.m4a", 0.025);
      if (this.etatMusic) {
        // this.soundPause();
        this.music.couperSon();
      } else {
        // this.soundPlay();
        this.music.remettreSon();
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
