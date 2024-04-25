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
    // console.log("modif musique");
    // super.stop();
    // super._src = [path];
    // this.volumeCourant = volume; 
    // super.play();   
    // super.loop(true);
    const newMusic = new Howl({
          src: path,
          autoplay: true,
          loop: true,
          volume: volume, // Volume par défaut
        }) as Music;
    Music.instance = newMusic;
  }

  public couperSon(): void {
    this.volumeCourant = super.volume();
    super.volume(0);
    console.log("couper son");
  }

  public remettreSon(): void {
    super.volume(this.volumeCourant);
    console.log("remettre son");
  }

  public modifVolume(volume: number): void {
    super.volume(volume);
    this.volumeCourant = volume;
  }

}