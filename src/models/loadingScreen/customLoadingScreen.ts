import { ILoadingScreen, Nullable } from "@babylonjs/core";
import { AdvancedDynamicTexture, Control } from "@babylonjs/gui";

export class CustomLoadingScreen implements ILoadingScreen {
    public loadingUIBackgroundColor: string;
    private background : Nullable<Control> = null;

    constructor(public loadingUIText: string) {
        this.loadingUIBackgroundColor = "black";
    }

    public async loadGui() : Promise<void> {
        try {
            const loadedscreen = await AdvancedDynamicTexture.ParseFromFileAsync("gui/gui_loading_screen.json", true);
            this.background = loadedscreen.getControlByName("Rectangle");
            this.background!.isVisible = false; // peut être améliorer la gestioon du loading screen
        } catch (e) {
            console.error(e);
        }
    }
    
    public displayLoadingUI() {
        console.log(this.loadingUIText);
        if (this.background) { 
            this.background.isVisible = true;
        }
        
    }

    public hideLoadingUI(time : number = 2000) {
        console.log("Loaded !")
        setTimeout(() => {
            if (this.background) { 
                this.background.isVisible = false;
            }            
        }, time);
    }
    
    public asyncHideLoadingUI(promiseArray : Promise<any>[]) {
        Promise.all(promiseArray).then(() => {
            setTimeout(() => {
                this.hideLoadingUI();
            }, 4000);
        });

    }


}