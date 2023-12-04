import {
    Engine,
    Scene,
    FreeCamera,
    Vector3,
    MeshBuilder,
    StandardMaterial,
    Color3,
    HemisphericLight,
    KeyboardEventTypes, SceneOptimizer, SceneOptimizerOptions, Camera
} from "@babylonjs/core";
import Player from "../models/player/Player.ts";

const createScene = async (canvas: HTMLCanvasElement, fpsCallback: (fps: string) => void, nbMeshCallback: (nbMesh: number) => void) => {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    let options = new SceneOptimizerOptions(60, 1000);
    // Optimizer
    let optimizer = new SceneOptimizer(scene, options);
    optimizer.start();

    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    new HemisphericLight("light", Vector3.Up(), scene);

    // Create a floor
    const ground = MeshBuilder.CreateGround("ground", {width: 16, height: 16}, scene);
    const groundMaterial = new StandardMaterial("ground-material", scene);
    groundMaterial.diffuseColor = Color3.Green();
    ground.material = groundMaterial;

    engine.runRenderLoop(() => {
        scene.render();

        if (fpsCallback) {
            fpsCallback(engine.getFps().toFixed());
        }

        if (nbMeshCallback) {
            nbMeshCallback(scene.meshes.length);
        }
    });

    let players: Player[] = [];

    // When ENTER is pressed, create a new Player and add it to the scene (random color) and place it at the camera's position
    addNewPlayer(scene, players, camera);

    // Add resize listener
    window.addEventListener("resize", () => {
        engine.resize();
    });
};

const addNewPlayer = (scene: Scene, players: Player[], camera: Camera) => {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "Enter":
                        const player = new Player("Player " + (players.length + 1));
                        players.push(player);
                        const box = MeshBuilder.CreateBox(player.name, { size: 1 }, scene);
                        box.position = camera.position;
                        const material = new StandardMaterial(player.name + "-material", scene);
                        material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
                        box.material = material;
                        break;
                }
                break;
        }
    });
}

export { createScene };