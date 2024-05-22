import { Howl, Howler } from 'howler';

// Classe pour représenter une piste audio individuelle
export class Track {
  private howl: Howl;
  private pausedAt: number | null;

  constructor(path: string, volume: number) {
    this.howl = new Howl({
      src: [path],
      autoplay: false,
      loop: true,
      volume: volume,
    });
    this.pausedAt = null;
  }

  play(): void {
    // if (this.pausedAt !== null) {
    //   this.howl.seek(this.pausedAt);
    //   this.pausedAt = null;
    // } else {
    //   this.howl.play();
    // }
    this.howl.play();
  }

  pause(): void {
    this.pausedAt = this.howl.seek();
    // console.log(this.pausedAt);
    this.howl.pause();
  }

  stop(): void {
    this.howl.stop();
    this.pausedAt = null;
  }

  setVolume(volume: number): void {
    this.howl.volume(volume);
  }

  getVolume(): number {
    return this.howl.volume();
  }
}
