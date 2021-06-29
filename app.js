import { Sticker } from "./sticker.js";

class App {
    constructor(selector) {
        if (typeof selector === 'string') {
            this.elements = document.querySelectorAll(selector);
            this.elements.forEach((element) => {
                new Sticker(element);
            })
        }
    }
}

window.onload = () => {
    new App('.sticker');
};