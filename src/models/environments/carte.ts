import {
    Animation,
    EasingFunction,
    FollowCamera,
    Mesh,
    QuadraticEase,
    Scene,
    Vector3,
} from "@babylonjs/core";
import { Player } from "../controller/Player";

export class Carte {
    private _scene: Scene;
    private player: Player;
    public positionCam!: Vector3;
    private fps: number = 30;

    constructor(scene: Scene, player: Player) {
        this._scene = scene;
        this.player = player;
    }

    public init() {
        this.interactCarte();
    }


    public interactCarte() {
		document.addEventListener("keydown", async (event) => {
			if (event.key === 'm' && document.getElementById("carte-dialog")!.classList.contains("hidden")
                                    && !document.getElementById("map-keybind")!.classList.contains("hidden")){
                document.getElementById("carte-dialog")!.classList.remove("hidden");
                document.getElementById("map-keybind")!.classList.add("hidden");              
                //créer une caméra qui se déplace sur la carte
                const camera = new FollowCamera("carteCamera", this.player.mesh.position, this._scene);
                //camera.lockedTarget = this.player.mesh;
                //camera.radius = 10;
                //camera.heightOffset = 20;
                //camera.rotationOffset = 180;
                this.positionCam = this.player._camRoot.position.clone();
                console.log(this.positionCam);

                const animation = new Animation(
                    "cameraAnimation",
                    "position",
                    30,
                    Animation.ANIMATIONTYPE_VECTOR3,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                // Définir les frames clés de l'animation
                const camKeys: { frame: number, value: Vector3 }[] = [];
                camKeys.push({
                    frame: 0,
                    value: this.positionCam, // Position actuelle de la caméra
                });
                camKeys.push({
                    frame: 100, // Durée de l'animation (en frames)
                    value: new Vector3(-140, 80, -260), // Nouvelle position de la caméra
                });

                // Ajouter les keys à l'animation
                animation.setKeys(camKeys);

                // Ajouter une fonction d'interpolation (ici, interpolation linéaire)
                const easingFunction = new QuadraticEase();
                easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
                animation.setEasingFunction(easingFunction);
                
                // Ajouter l'animation à la caméra
                camera.animations.push(animation);


                const rotationAnimation = new Animation(
                    "cameraRotationAnimation",
                    "rotation",
                    30,
                    Animation.ANIMATIONTYPE_VECTOR3,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                // Définir les frames clés de l'animation de rotation
                const rotationKeys: { frame: number, value: Vector3 }[] = [];
                rotationKeys.push({
                    frame: 0,
                    value: camera.rotation.clone(), // Rotation actuelle de la caméra
                });
                rotationKeys.push({
                    frame: 100, // Durée de l'animation (en frames)
                    value: new Vector3(Math.PI/6, 0, 0), // Rotation vers le bas de 20 degrés
                });
                rotationAnimation.setKeys(rotationKeys);
                rotationAnimation.setEasingFunction(easingFunction);
                camera.animations.push(rotationAnimation);

                // Lancer l'animation
                this._scene.beginAnimation(camera, 0, 100 * this.fps, false);

                setTimeout(() => {
                    document.getElementById("map-keybind")!.classList.remove("hidden");
                }, 100*this.fps);

                this._scene.activeCamera = camera;  
			}
			else if (event.key === 'm' && !document.getElementById("carte-dialog")!.classList.contains("hidden")
                                        && !document.getElementById("map-keybind")!.classList.contains("hidden")){
                document.getElementById("carte-dialog")!.classList.add("hidden");   
                document.getElementById("map-keybind")!.classList.add("hidden");
                //retourner à la caméra du joueur
                if(this._scene.activeCameras){
                    const camera = new FollowCamera("carteCamera", new Vector3(-140, 80, -260), this._scene);

                    const animation = new Animation(
                        "cameraAnimation",
                        "position",
                        30,
                        Animation.ANIMATIONTYPE_VECTOR3,
                        Animation.ANIMATIONLOOPMODE_CONSTANT
                    );

                    // Définir les frames clés de l'animation
                    const camKeys: { frame: number, value: Vector3 }[] = [];
                    camKeys.push({
                        frame: 0,
                        value: new Vector3(-140, 80, -260), // Position actuelle de la caméra
                    });
                    camKeys.push({
                        frame: 100, // Durée de l'animation (en frames)
                        value: this.positionCam, // Nouvelle position de la caméra
                    });

                    // Ajouter les keys à l'animation
                    animation.setKeys(camKeys);

                    // Ajouter une fonction d'interpolation (ici, interpolation linéaire)
                    const easingFunction = new QuadraticEase();
                    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
                    animation.setEasingFunction(easingFunction);
                    

                    // Ajouter l'animation à la caméra
                    camera.animations.push(animation);


                    const rotationAnimation = new Animation(
                        "cameraRotationAnimation",
                        "rotation",
                        30,
                        Animation.ANIMATIONTYPE_VECTOR3,
                        Animation.ANIMATIONLOOPMODE_CONSTANT
                    );

                    // Définir les frames clés de l'animation de rotation
                    const rotationKeys: { frame: number, value: Vector3 }[] = [];
                    rotationKeys.push({
                        frame: 0,
                        value: camera.rotation.clone(), // Rotation actuelle de la caméra
                    });
                    rotationKeys.push({
                        frame: 100, // Durée de l'animation (en frames)
                        value: new Vector3(Math.PI/6, 0, 0), // Rotation vers le bas de 20 degrés
                    });
                    rotationAnimation.setKeys(rotationKeys);
                    rotationAnimation.setEasingFunction(easingFunction);
                    camera.animations.push(rotationAnimation);

                    // Lancer l'animation
                    this._scene.beginAnimation(camera, 0, 100 * this.fps, false);

                    this._scene.activeCamera = camera;  

                    setTimeout(() => {
                        this._scene._activeCamera = this.player.activatePlayerCamera();
                        document.getElementById("map-keybind")!.classList.remove("hidden");
                    }, 100*this.fps);
                }
			}
		});
	}

}
  