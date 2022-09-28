export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.checkedKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "];    
        window.addEventListener("keydown", e => {
            if (this.checkedKeys.indexOf(e.key) !== -1 && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener("keyup", e => {
            if (this.checkedKeys.indexOf(e.key) !== -1) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}