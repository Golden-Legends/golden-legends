import { Game } from "./Game";
import {socket} from "../utils/socket.ts";
export default class App {
  private _canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    new Game(this._canvas);
    socket.on('connected', (data) => {
      console.log('Connected to server:', data);
    });
  }
}

