import {
    Engine,
    Scene,
    FreeCamera,
    Vector3,
    MeshBuilder,
    StandardMaterial,
    Color3,
    HemisphericLight,
    KeyboardEventTypes, Mesh, SceneOptimizer, SceneOptimizerOptions
} from "@babylonjs/core";

const createScene = (canvas: HTMLCanvasElement, fpsCallback, nbMeshCallback) => {
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

    // Generate 1000 boxes that form a cube
    const boxes = [] as Mesh[];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j ++) {
            for (let k = 0; k < 10; k++) {
                const box = MeshBuilder.CreateBox("box", { size: 4 }, scene);
                const material = new StandardMaterial("box-material", scene);
                material.diffuseColor = Color3.Random();
                box.material = material;
                box.position = new Vector3(i * 4, j * 4, k * 4);
                boxes.push(box);
            }
        }
    }

    // Make an invisible plane to stop the boxes from falling forever
    const plane = MeshBuilder.CreatePlane("plane", { size: 1000 }, scene);
    plane.isVisible = false;

    // Rotate the plane so it's horizontal
    plane.position.y = -2;
    plane.rotation.x = Math.PI / 2;

    const material = new StandardMaterial("box-material", scene);
    material.diffuseColor = Color3.Blue();
    plane.material = material;


    engine.runRenderLoop(() => {
        scene.render();

        if (fpsCallback) {
            fpsCallback(engine.getFps().toFixed());
        }

        if (nbMeshCallback) {
            nbMeshCallback(scene.meshes.length);
        }
    });

    // Move all the boxes with the arrow keys
    handleMoves(scene, boxes);

    // When ENTER is pressed, create a new Box and add it to the scene (random color) and place it at the camera's position
    createNewBox(scene, boxes, camera);

    // Add resize listener
    window.addEventListener("resize", () => {
        engine.resize();
    });
};

const handleMoves = (scene, boxes) => {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "z":
                        boxes.forEach((box) => {
                            box.position.z -= 1;
                        });
                        break;
                    case "s":
                        boxes.forEach((box) => {
                            box.position.z += 1;
                        });
                        break;
                    case "q":
                        boxes.forEach((box) => {
                            box.position.x -= 1;
                        });
                        break;
                    case "d":
                        boxes.forEach((box) => {
                            box.position.x += 1;
                        });
                        break;
                }
                break;
        }
    });
}

const createNewBox = (scene, boxes, camera) => {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "Enter":
                        const newBox = MeshBuilder.CreateBox("box", { size: 4 }, scene);
                        const newMaterial = new StandardMaterial("box-material", scene);
                        newMaterial.diffuseColor = Color3.Random();
                        newBox.material = newMaterial;
                        newBox.position = camera.position;
                        boxes.push(newBox);
                        break;
                }
                break;
        }
    });
}

export { createScene };