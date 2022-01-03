export class LoadingScreen {
    /**
     * A simple loading screen
     */
    constructor(){
        let parentEl = document.createElement('div');
        parentEl.classList.add("loading-screen");
        let leftSection = document.createElement('div');
        leftSection.classList.add("left");
        let rightSection = document.createElement('div');
        rightSection.classList.add("right");

        let middleSection = document.createElement('div');
        middleSection.classList.add("middle");

        let readyComponent = document.createElement("div");
        readyComponent.classList.add("component");
        readyComponent.classList.add("ready");
    
        let readyHeader = document.createElement("span");
        readyHeader.innerHTML = "Ready to launch";
        readyComponent.append(readyHeader);

        let readyButton = document.createElement("a");
        readyButton.classList.add("btn");
        readyButton.innerHTML = "Go ahead";
        readyButton.addEventListener("click", () => {
            parentEl.classList.remove("ready");
            parentEl.classList.add("open");
        });

        readyComponent.append(readyButton);

        let loadingComponent = document.createElement("div");
        loadingComponent.classList.add("component");
        loadingComponent.classList.add("loading");

        let loadingHeader = document.createElement("span");
        loadingHeader.innerHTML = "Loading...";
        loadingComponent.append(loadingHeader);

        let dots = document.createElement("div");
        dots.classList.add("dots");

        for(let i = 0; i < 3; i++){
            let dot = document.createElement("div");
            dot.classList.add("dot");
            dots.append(dot);
        }

        loadingComponent.append(dots);

        middleSection.append(readyComponent);
        middleSection.append(loadingComponent);

        parentEl.append(leftSection);
        parentEl.append(middleSection);
        parentEl.append(rightSection);

        document.body.append(parentEl);

        this.element = parentEl;
    }

    ready(){
        this.element.classList.add("ready");
    }
}