export class EscapeScreen {
    /**
     * A simple escape screen
     */
    constructor(){
        let parentEl = document.createElement('div');
        parentEl.classList.add("escape-screen");
        
        parentEl.innerHTML = "En Pause !";
        document.body.append(parentEl);

        this.element = parentEl;
    }

    permut(){
        if(this.element.classList.contains("active")) this.element.classList.remove("active");
        else this.element.classList.add("active");
    }

    get state(){
        return this.element.classList.contains("active");
    }
}