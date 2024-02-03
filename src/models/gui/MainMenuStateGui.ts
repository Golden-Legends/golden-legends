import { AdvancedDynamicTexture, Button, Control, TextBlock } from "@babylonjs/gui";

export class MainMenuStateGui {
    private guiMenu : AdvancedDynamicTexture;
    private startButton : Button;

    public constructor() {
        this.guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        this.titleTextMenu();
        this.startButton = this.createStartButton();
        this.guiMenu.addControl(this.startButton);
    }
    private titleTextMenu () {
        const title = new TextBlock();
        title.text = "GOLDEN LEGENDS";
        title.color = "white";
        title.fontSize = 80;
        title.top = -280;
        title.fontFamily = "Verdana";
        title.shadowOffsetX = 10;
        title.shadowOffsetY = 10;
        title.shadowBlur = 8;
        title.shadowColor = "black";
        this.guiMenu.addControl(title);		
    }

    private createStartButton () { 
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.5;
        startBtn.height = "100px";
        startBtn.fontSize = "96px";
        startBtn.color = "white";
        startBtn.background = "#096a09";
        startBtn.top = "200px";
        startBtn.cornerRadius = 60;
        startBtn.thickness = 0;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        return startBtn;
    }

    public getStartButton() : Button {
        return this.startButton;
    }

    public dispose() {
        this.guiMenu.dispose();
    }
}