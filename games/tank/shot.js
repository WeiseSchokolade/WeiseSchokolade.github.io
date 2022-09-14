import { degrees_to_radians } from "./util.js";

export class Shot {
    constructor(game, x, y, rotation, id) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.shotID = id;
        this.speed = 10;
        this.markedForDeletion = false;
        this.update(20);
    }
    update(deltaTime) {
        this.x += Math.cos(degrees_to_radians(this.rotation)) * this.speed * deltaTime / 20;
        this.y += Math.sin(degrees_to_radians(this.rotation)) * this.speed * deltaTime / 20;
        if (this.x > 500 || this.x < -500 || this.y > 500 || this.y < -500) {
            this.markedForDeletion = true;
        }
    }
    draw(context) {
        context.fillStyle = "red";
        context.fillRect(this.x + this.game.scrollX - 10, this.y + this.game.scrollY - 10, 20, 20);
    }
}