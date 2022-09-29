export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.checkedKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "];
        this.touchX = '';
        this.touchY = '';
        this.touchTreshold = 20;
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
        window.addEventListener("touchstart", e => {
            this.touchX = e.changedTouches[0].pageX;
            this.touchY = e.changedTouches[0].pageY;
        });
        window.addEventListener("touchmove", e => {
            const swipeXDistance = e.changedTouches[0].pageX - this.touchX;
            if (swipeXDistance < -this.touchTreshold && this.keys.indexOf("a") === -1) this.keys.push("a");
            else if (swipeXDistance > this.touchTreshold && this.keys.indexOf("d") === -1) {
                this.keys.push("d");
            }

            const swipeYDistance = e.changedTouches[0].pageY - this.touchY;
            if (swipeYDistance < -this.touchTreshold && this.keys.indexOf("w") === -1) this.keys.push("w");
            else if (swipeYDistance > this.touchTreshold && this.keys.indexOf("s") === -1) {
                this.keys.push("s");
            }
        });
        window.addEventListener("touchend", e => {
            this.keys.splice(this.keys.indexOf("w"), 1);
            this.keys.splice(this.keys.indexOf("a"), 1);
            this.keys.splice(this.keys.indexOf("s"), 1);
            this.keys.splice(this.keys.indexOf("d"), 1);
        });
    }
}