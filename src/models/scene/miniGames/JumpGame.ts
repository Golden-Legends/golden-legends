import {
  AbstractMesh,
  ActionManager,
  Animation,
  Color4,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  ParticleSystem,
  Scene,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";
import { PlayerInput } from "../../inputsMangement/PlayerInput";
import { storeJump } from "@/components/gui/storeJump.ts";
import { GameState } from "@/models/GameState";

export class JumpGame{
  progress: number;
  public scene: Scene;
  private player: Mesh;
  private cube!: Mesh;
  private guiTextureButton!: AdvancedDynamicTexture;
  private isPlayerInsideTrigger: boolean = false;
  private playerInput: PlayerInput;
  private platformsJumped: number = 0;
  private platformsAlreadyJump: string[] = [];
  private readonly TOTAL_PLATFORMS: number = 20;
  private defeatMessage?: TextBlock;
  private victoryMessage?: TextBlock;
  private gameRunning: boolean = false;
  private animations: Animation[] = [];

  private countdownInProgress: boolean = false;
  private raceStartTime: number = 0;
  private timer: number = 0;
  private currentTime : number = 0;

  constructor(scene: Scene, player: Mesh, input: PlayerInput) {
    this.scene = scene;
    this.player = player;
    this.progress = 0;
    this.playerInput = input;
  }

  public init() {
    //invisible platform
    // console.log(this.player.position);
    this.invisiblePlatform(1, 20);

    //apparition message pour afficher les plateformes
    this.initCube();
    this.registerBoxPickUpActions();

    
    //apparition des plateformes
    // this.scene.registerBeforeRender(() => {
    //     if (this.isPlayerInsideTrigger && this.playerInput.inputMap["Space"]) {
    //         this.visiblePlatform(1, 20);
    //         if (!this.gameRunning) {
    //             //compteur pour arriver au nombre de plateformes
    //             //si touche l'eau, le jeu se termine et s'il arrive au bon nombre, apparition du message de fin de jeu
    //             this.miniGame(); // Lancer le mini-jeu uniquement si le jeu n'est pas déjà en cours
    //         }
    //     }
    // });

    this.scene.registerBeforeRender(() => {
      if (
        this.isPlayerInsideTrigger &&
        this.playerInput.inputMap["KeyR"] &&
        !this.gameRunning
      ) {
        this.timer = 0;
        this.raceStartTime = 0;
        this.currentTime = 0;
        storeJump.commit('setTimer', 0.00);
        document.getElementById("jumpGame-timer")!.classList.remove("hidden");
        this.miniGame();
      }
    });
    // this.playFireworksAnimation(this.scene, this.player.position);
  }

  private startCountdown() {
    //if (this.countdownInProgress) return; // Évite de démarrer le compte à rebours multiple fois

    // Permet au joueur de jouer ou exécutez d'autres actions nécessaires
    this.countdownInProgress = true;
    this.raceStartTime = performance.now();
  }

  private endCountdown() {
    if (!this.countdownInProgress) return; // Évite de terminer le compte à rebours si ce n'est pas déjà en cours

    const currentTime = performance.now();
    const elapsedTime = (currentTime - this.raceStartTime);
    this.timer = parseFloat(elapsedTime.toFixed(1));  
    storeJump.commit('setTimer', this.timer);
    console.log("Temps écoulé: ", this.timer, elapsedTime);
  }

  private miniGame() {
    // Initialiser le jeu et démarrer le comptage des plateformes sautées
    this.startCountdown()

    // this.update();

    this.resetGame();
    this.gameRunning = true;

    // Afficher les premières plateformes
    const startNumber = 1;
    let endNumber = 2; // Afficher deux plateformes initialement ou moins si elles n'existent pas
    this.visiblePlatform(startNumber, startNumber);
    // this.visiblePlatform(endNumber, endNumber);

    // Continuer à afficher les plateformes progressivement
    this.player.onCollide = (collidedMesh?: AbstractMesh) => {
      // console.log("collidedMesh", collidedMesh);
      if (
        collidedMesh &&
        collidedMesh.name.startsWith("platform") &&
        !this.platformsAlreadyJump.includes(collidedMesh.name)
      ) {
        // Plateforme visible et collision détectée
        this.platformsAlreadyJump.push(collidedMesh.name);
        this.platformsJumped++; // Incrémenter le compteur de plateformes sautées
        console.log("Plateforme sautée: ", this.platformsJumped);

        // Vérifier si toutes les plateformes ont été sautées
        if (this.platformsJumped === this.TOTAL_PLATFORMS) {
          // Afficher un message de victoire et réinitialiser le jeu
          this.showVictoryMessage();
          this.resetGame();
          this.invisiblePlatform(1, 20);
          this.gameRunning = false;
          this.stopMiniGame();
          this.playFireworksAnimation(this.scene, this.player.position);
          this.endCountdown();
          return;
        }

        // Afficher la prochaine plateforme après un délai
        setTimeout(() => {
          endNumber = Math.min(this.platformsJumped + 1, this.TOTAL_PLATFORMS); // Afficher une seule plateforme de plus
          this.visiblePlatform(endNumber, endNumber);
        }, 100); // Délai de 1 seconde avant d'afficher la prochaine plateforme
      }

      if (collidedMesh && collidedMesh.name === "fondBassin") {
        // Afficher un message de défaite et réinitialiser le jeu
        this.showDefeatMessage();
        console.log("endgame");
        this.resetGame();
        this.invisiblePlatform(1, 20);
        this.gameRunning = false;
        this.stopMiniGame();
        this.endCountdown();
      }
    };
  }

  private createAnimation(mesh: AbstractMesh) {
    const fps = 30;
    const animaPlatform = new Animation(
      "platformAnimation",
      "position.y",
      fps,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    // const animation = new Animation("platformAnimation", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const animKeys: { frame: number; value: number }[] = [];
    animKeys.push({ frame: 0, value: mesh.position.y });
    animKeys.push({ frame: 30, value: mesh.position.y + 0.25 }); // Déplacez la plateforme vers le bas à la frame 30
    animaPlatform.setKeys(animKeys);
    this.animations.push(animaPlatform);

    // Appliquer l'animation à la plateforme
    mesh.animations.push(animaPlatform);
    this.scene.beginAnimation(mesh, 0, 30, false);
  }

  private resetGame() {
    // Réinitialiser les compteurs et les états du jeu
    this.platformsJumped = 0;
    this.platformsAlreadyJump = [];
    // Réinitialiser les messages affichés à l'écran
    if (this.defeatMessage) {
      this.guiTextureButton.removeControl(this.defeatMessage);
      this.defeatMessage.dispose(); // Libérer les ressources
      this.defeatMessage = undefined;
    }
    if (this.victoryMessage) {
      this.guiTextureButton.removeControl(this.victoryMessage);
      this.victoryMessage.dispose(); // Libérer les ressources
      this.victoryMessage = undefined;
    }
    // Le jeu n'est plus en cours
    this.gameRunning = false;
    this.invisiblePlatform(1, 20);
  }

  playFireworksAnimation(scene: Scene, position: Vector3) {
    // Créer un système de particules pour le feu d'artifice
    const fireworks = new ParticleSystem("fireworks", 2000, scene);
    fireworks.particleTexture = new Texture("textures/flare.png", scene);
    fireworks.emitter = position;
    fireworks.minEmitBox = new Vector3(-0.5, 0, -0.5);
    fireworks.maxEmitBox = new Vector3(0.5, 0, 0.5);
    fireworks.color1 = new Color4(1, 1, 0, 1);
    fireworks.color2 = new Color4(1, 0, 0, 1);
    fireworks.colorDead = new Color4(0, 0, 0, 0);
    fireworks.minSize = 0.05;
    fireworks.maxSize = 0.2;
    fireworks.minLifeTime = 0.5;
    fireworks.maxLifeTime = 1;
    fireworks.emitRate = 500;
    fireworks.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    fireworks.gravity = new Vector3(0, -1, 0);
    fireworks.direction1 = new Vector3(-1, 1, -1);
    fireworks.direction2 = new Vector3(1, 1, 1);
    fireworks.minAngularSpeed = 0;
    fireworks.maxAngularSpeed = Math.PI;
    fireworks.minEmitPower = 0.5;
    fireworks.maxEmitPower = 2;
    fireworks.updateSpeed = 0.005;

    // Démarrer l'animation
    fireworks.start();
  }

  update(): void {
    if (!this.countdownInProgress) return;
      this.currentTime = performance.now();
      let deltaTime = this.scene.getEngine().getDeltaTime();
      deltaTime = deltaTime / 10;
      this.currentTime = this.currentTime;


    if(!this.gameRunning){
      this.timer = Math.round((this.currentTime - this.raceStartTime));
      console.log("Temps écoulé: ", this.timer);
      storeJump.commit('setTimer', this.timer);
    }
  }

  showVictoryMessage() {
    // Créer un message de victoire à afficher à l'écran    
    document.getElementById("victory-jump-dialog")!.classList.remove("hidden");
    setTimeout(() => {
      storeJump.commit('setTimer', 0.00);
      document.getElementById("victory-jump-dialog")!.classList.add("hidden");
      document.getElementById("jumpGame-timer")!.classList.add("hidden");
    }, 3000);
  }

  showDefeatMessage() {
    // Créer un message de défaite à afficher à l'écran
    document.getElementById("lose-jump-dialog")!.classList.remove("hidden");
    setTimeout(() => {
      storeJump.commit('setTimer', 0.00);
      document.getElementById("jumpGame-timer")!.classList.add("hidden");
      document.getElementById("lose-jump-dialog")!.classList.add("hidden");
    }, 3000);
  }

  stopMiniGame() {
    // Mettre fin au mini-jeu en désactivant la détection de collision du joueur
    this.player.onCollide = () => {};
  }

  initCube(): void {
    // if (this.progress === 100) {
    // 	return;
    // }

    this.cube = MeshBuilder.CreateBox("cube", { size: 2 }, this.scene);
    this.cube.position = new Vector3(-70, 3, -127); // Changez la position du cube selon vos besoins
    // this.cube.position._y += 2;
    this.cube.visibility = 0; // Rendre le cube invisible
    this.cube.checkCollisions = false; // Empêcher les collisions avec le cube
  }

  registerBoxPickUpActions(): void {
    this.guiTextureButton = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    if (this.player && this.player.actionManager) {
      this.player.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionEnterTrigger,
            parameter: {
              mesh: this.cube,
              usePreciseIntersection: true,
            },
          },
          () => {
            if (this.progress !== 100) {
              this.isPlayerInsideTrigger = true;

              // console.log("Player is inside the trigger");
            }
          },
        ),
      );
    }

    if (this.player && this.player.actionManager) {
      this.player.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionExitTrigger,
            parameter: {
              mesh: this.cube,
              usePreciseIntersection: true,
            },
          },
          () => {
            this.isPlayerInsideTrigger = false;
          },
        ),
      );
    }
  }

  private invisiblePlatform(startNumber: number, endNumber: number) {
    for (let i = startNumber; i <= endNumber; i++) {
      let mesh = this.scene.getMeshByName("platform" + i);
      if (mesh) {
        mesh.isVisible = false;
      }
    }
  }

  private visiblePlatform(startNumber: number, endNumber: number) {
    for (let i = startNumber; i <= endNumber; i++) {
      let mesh = this.scene.getMeshByName("platform" + i);
      if (mesh) {
        mesh.isVisible = true;
        mesh.position.y -= 0.25;
        this.createAnimation(mesh);
      }
    }
  }
}
