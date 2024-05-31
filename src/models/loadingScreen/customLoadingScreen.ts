import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
    //optional, but needed due to interface definitions
    public loadingUIBackgroundColor: string;

    constructor(public loadingUIText: string) {
        this.loadingUIBackgroundColor = "black";
    }

    public displayLoadingUI() {
      // alert(this.loadingUIText);
      document.getElementById("loading-container")!.classList.remove("hidden");
    }
  
    public hideLoadingUI() {
      document.getElementById("loading-container")!.classList.add("hidden");
    }
  }