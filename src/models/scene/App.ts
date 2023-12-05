import {
    Color3,
    Color4,
    Engine,
    FollowCamera,
    GlowLayer,
    PointLight,
    Scene,
    ShadowGenerator,
    Vector3
} from "@babylonjs/core";
import Player from "../player/Player.ts";
import {PlayerInput} from "../player/PlayerInput.ts";

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

    // Game state related
    private _input: PlayerInput;
    private _player: Player;

    //post process
    private _transition: boolean = false;

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
        await this._start();

        // Register a render loop to repeatedly render the scene
        this._engine.runRenderLoop(() => {
            switch (this._state) {
                case STATES.START:
                    this._scene.render();
                    break;
                default: break;
            }
        });

        //Resize if the screen is resized/rotated
        window.addEventListener('resize', () => {
            this._engine.resize();
        });

    }

    private async _start(): Promise<void> {
        //--SCENE SETUP--
        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0, 0, 0, 1);

        // Add player
        this._player = new Player(scene, this._input);

        // Attach camera to the box to work as a 3rd person camera
        const camera = new FollowCamera("FollowCam", new Vector3(0, -10, 10), scene);
        camera.lockedTarget = scene.getMeshByName("player");
        camera.radius = 8;

        this._input = new PlayerInput(scene);

        //Initializes the game's loop
        await this._initializeGameAsync(scene); //handles scene related updates & setting up meshes in scene

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        //lastly set the current state to the start state and set the scene to the start scene
        this._scene.dispose();
        this._scene = scene;
        this._state = STATES.START;
    }

    //init game
    private async _initializeGameAsync(scene: Scene): Promise<void> {
        scene.ambientColor = new Color3(0.34509803921568627, 0.5568627450980392, 0.8352941176470589);
        scene.clearColor = new Color4(0.01568627450980392, 0.01568627450980392, 0.20392156862745098);

        const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
        light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
        light.intensity = 35;
        light.radius = 1;

        //Create the player
        this._player = new Player(scene, this._input, "Swayyys");

        const camera = this._player.activatePlayerCamera();

        //--GAME LOOP--
        scene.onBeforeRenderObservable.add(() => {
            // SOME STUFF SUCH AS PLAYER UPDATES
        })
        //glow layer
        const gl = new GlowLayer("glow", scene);
        gl.intensity = 0.4;
    }
}