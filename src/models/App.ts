import { Game } from "./Game";

export default class App {
    private _canvas: HTMLCanvasElement;

    constructor(canvas : HTMLCanvasElement) {
        this._canvas = canvas;
        new Game(this._canvas);    
    }
}


