import {
    Engine,
    Scene,
} from "@babylonjs/core"; 

enum STATES {
    START,
    PLAY,
    PAUSE,
    END
}
export default class App {
    // General Entire Application
    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;

    constructor(canvas : HTMLCanvasElement) {
        this._canvas = canvas;
        // initialize babylon scene and engine
        this._init();
    }

    //set up the canva

    private async _init(): Promise<void> {
        this._engine = new Engine(this._canvas, true)
        this._scene = new Scene(this._engine);

        //**for development: make inspector visible/invisible
        window.addEventListener("keydown", (ev) => {
            //Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        //MAIN render loop & state machine
        await this._main();
    }

    private async _main(): Promise<void> {

    }
}