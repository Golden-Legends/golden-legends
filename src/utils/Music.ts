import { Howl } from "howler";

export class Music extends Howl {
  private static instance: Music;
  private volumeCourant: number = 0;

  private constructor(path: string, volume: number) {
    super({
      src: [path],
      autoplay: true,
      volume: volume,
      loop: true,
    });
    this.volumeCourant = volume;
  }

  public static getInstance(path: string, volume: number): Music {
    if (!Music.instance) {
      Music.instance = new Music(path, volume);
    }

    return Music.instance;
  }

  public stop(): void {
    super.stop();
  }

  public modifMusique(path: string, volume: number): void {
    super.stop();
    super._src = [path];
    this.volumeCourant = volume; 
    super.play();
  }

  public couperSon(): void {
    this.volumeCourant = super.volume();
    super.volume(0);
  }

  public remettreSon(): void {
    super.volume(this.volumeCourant);
  }

  public modifVolume(volume: number): void {
    super.volume(volume);
    this.volumeCourant = volume;
  }

}