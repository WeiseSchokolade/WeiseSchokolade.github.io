import { degrees_to_radians } from "./util.js";

class Tank {
    static maxID = 0;

    constructor(game) {
        this.game = game;
        this.id = Tank.maxID++;
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.speed = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.towerRotation = 180;
        this.towerRotationSpeed = 0;
        this.bodyImage = document.getElementById("blue_tank_body");
        this.towerImage = document.getElementById("blue_tank_tower");
    }
    update(deltaTime) {
        this.rotation += this.rotationSpeed;
        this.rotationSpeed *= 0.75;

        this.towerRotation += this.towerRotationSpeed;
        this.towerRotationSpeed *= 0.75;

        if (this.speed > 0) {
            let tx = Math.cos(degrees_to_radians(this.rotation)) * this.speed * deltaTime / 20;
            let ty = Math.sin(degrees_to_radians(this.rotation)) * this.speed * deltaTime / 20;
            
            this.x += tx;
            this.y += ty;
            this.speed -= 0.5;
        }
    }
    draw(context) {
        this._draw(context, this.game.scrollX + this.x, this.game.scrollY + this.y);
    }
    _draw(context, x, y) {
        context.fillStyle = "white";
        context.save();
        context.translate(x, y);
        context.rotate(degrees_to_radians(this.rotation));
        context.drawImage(this.bodyImage, this.width * -0.5, this.height * -0.5, this.width, this.height);
        context.restore();
        context.save();
        context.translate(x, y);
        context.rotate(degrees_to_radians(this.towerRotation));
        context.drawImage(this.towerImage, this.width * -0.5, this.height * -0.5, this.width, this.height);
        context.restore();
        
    }
}

export class Player extends Tank {
    constructor(game) {
        super(game);
    }
    update(deltaTime, keys) {
        super.update(deltaTime);
        
        if (keys.includes("ArrowLeft")) {
            this.rotationSpeed = -2;
            this.towerRotationSpeed = -2;
        }
        if (keys.includes("ArrowRight")) {
            this.rotationSpeed = 2;
            this.towerRotationSpeed = 2;
        }
        if (keys.includes("a")) {
            this.towerRotationSpeed = -2;
        }
        if (keys.includes("d")) {
            this.towerRotationSpeed = 2;
        }
        if (keys.includes("ArrowUp")) {
            this.speed = 2;
        }
        if (keys.includes(" ")) {
            this.game.addShot(this.x, this.y, this.towerRotation, this.id);
            console.log(this.x, this.y);
        }
    }
    draw(context) {
        this._draw(context, this.game.width / 2, this.game.height / 2);
    }
}

export class EnemyTank extends Tank {

}
