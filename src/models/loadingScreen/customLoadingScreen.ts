import { ILoadingScreen, Nullable } from "@babylonjs/core";
import { AdvancedDynamicTexture, Control } from "@babylonjs/gui";

export class CustomLoadingScreen implements ILoadingScreen {
    public loadingUIBackgroundColor: string;
    private background : Nullable<Control> = null;

    constructor(public loadingUIText: string) {
        this.loadingUIBackgroundColor = "black";
    }

    public async loadGui() : Promise<AdvancedDynamicTexture> {
        const loadedscreen = await AdvancedDynamicTexture.ParseFromFileAsync("gui/gui_loading_screen.json", true);
        this.background = loadedscreen.getControlByName("Rectangle");
        this.background!.isVisible = false; // peut être améliorer la gestioon du loading screen
        return loadedscreen;
    }
    
    public displayLoadingUI() {
        console.log(this.loadingUIText);
        if (this.background) { 
            this.background.isVisible = true;
        }
        
    }

    public hideLoadingUI() {
        console.log("Loaded !")
        if (this.background) { 
            this.background.isVisible = false;
        }
    }
    
    public asyncHideLoadingUI(promiseArray : Promise<any>[]) {
        Promise.all(promiseArray).then(() => {
            setTimeout(() => {
                this.hideLoadingUI();
            }, 5000);
        });

    }


}