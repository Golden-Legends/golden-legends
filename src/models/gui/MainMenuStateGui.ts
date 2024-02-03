import { AdvancedDynamicTexture, Button, Control, TextBlock } from "@babylonjs/gui";

export class MainMenuStateGui {

    constructor () {
        
    }
    
    
   private guiMenu () { 
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        const text1 = new TextBlock();
        text1.text = "GOLDEN LEGENDS";
        text1.color = "white";
        text1.fontSize = 80;
        text1.top = -280;
        text1.fontFamily = "Verdana";
        text1.shadowOffsetX = 10;
        text1.shadowOffsetY = 10;
        text1.shadowBlur = 8;
        text1.shadowColor = "black";
        guiMenu.addControl(text1);


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
        guiMenu.addControl(startBtn);

    }
}