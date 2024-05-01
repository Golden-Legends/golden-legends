import { Track } from "@/utils/track";
import { Scene } from "@babylonjs/core";

// Gestionnaire de musique
export class SoundManager {
  private _scene: Scene;
  private tracks: Map<string, Track>;
  private etatMusic: boolean = true;
  private currentMusic: string = "inGame";

  constructor(scene: Scene) {
    this._scene = scene;
    this.tracks = new Map();
    this.soundButtonListener();
  }

  private soundButtonListener(): void {
    document.getElementById("sound-button")?.addEventListener("click", () => {
      console.log("click");
      if (this.etatMusic) {
        this.pauseTrack(this.currentMusic);
        this.etatMusic = false;
        this.soundButtonListener();
      } else {
        this.playTrack(this.currentMusic);
        this.etatMusic = true;
        this.soundButtonListener();
      }
    });
  }

  addTrack(name: string, path: string, volume: number): void {
    if (!this.tracks.has(name)) {
      const track = new Track(path, volume);
      this.tracks.set(name, track);
    }
  }

  playTrack(name: string): void {
    const track = this.tracks.get(name);
    if (track) {
      track.play();
    }
    this.currentMusic = name;
  }

  pauseTrack(name: string): void {
    const track = this.tracks.get(name);
    if (track) {
      track.pause();
    }
  }

  stopTrack(name: string): void {
    const track = this.tracks.get(name);
    if (track) {
      track.stop();
    }
  }

  setTrackVolume(name: string, volume: number): void {
    const track = this.tracks.get(name);
    if (track) {
      track.setVolume(volume);
    }
  }
}




// import { Music } from "@/utils/Music";
// import { Scene, Sound } from "@babylonjs/core";

// export class SoundManager {
//   private _scene: Scene;
//   private _music!: Sound;
//   private etatMusic: boolean = true;
//   public music = Music.getInstance("./sounds/musiqueJeu.m4a", 0.025);

//   constructor(scene: Scene) {
//     this._scene = scene;
//     // this.soundGame(this._scene);
//     this.soundButtonListener();
//     // this.music.modifMusique("./sounds/musiqueJeu.m4a", 0.025);
//   }

//   private soundButtonListener(): void {
//     document.getElementById("sound-button")?.addEventListener("click", () => {
//       console.log("click");
//       this.music = Music.getInstance("./sounds/musiqueJeu.m4a", 0.025);
//       if (this.etatMusic) {
//         // this.soundPause();
//         this.music.couperSon();
//       } else {
//         // this.soundPlay();
//         this.music.remettreSon();
//       }
//     });
//   }

//   private soundGame(scene: Scene): void {
//     this._music = new Sound(
//       "gameSong",
//       "./sounds/musiqueJeu.m4a",
//       scene,
//       function () {},
//       {
//         loop: true,
//         volume: 0.025,
//         autoplay: false,
//       },
//     );
//   }

//   private soundPause(): void {
//     this._music.pause();
//     this.etatMusic = false;
//     this.soundButtonListener();
//   }

//   private soundPlay(): void {
//     this._music.play();
//     this.etatMusic = true;
//     this.soundButtonListener();
//   }
// }
