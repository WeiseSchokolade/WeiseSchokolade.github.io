export class Player {
    constructor(game) {
        this.game = game;
        this.width = 64;
        this.height = 64;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = 2 * this.game.height / 3;
        this.vx = 0;
        this.vy = 0;
        this.image = document.getElementById("ufo_img");
        this.shadow = document.getElementById("shadow_img");
    }

    update(deltaTime, keys) {

        this.x += this.vx;
        this.y += this.vy;
        
        if (keys.includes("ArrowRight")) {
            this.vx = 9;
        }
        if (keys.includes("ArrowLeft")) {
            this.vx = -9;
        }
        if (keys.includes("ArrowDown")) {
            this.vy = 9;
        }
        if (keys.includes("ArrowUp")) {
            this.vy = -9;
        }

        if (this.x < 0 - this.width) {
            this.x = this.game.width;
        }
        if (this.x > this.game.width) {
            this.x = 0 - this.width;
        }

        this.vx *= 0.9;
        this.vy *= 0.9;
    }

    draw(context) {
        context.drawImage(this.shadow, this.x, this.y + 100, this.width, this.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height);       
        //context.fillRect(this.x, this.y, this.width, this.height);
    }
}