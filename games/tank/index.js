import { Player, EnemyTank } from "./sprites.js";
import { InputHandler } from "./input.js";
import { Shot } from "./shot.js";

window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.enemies = [new EnemyTank(this)];
            this.shots = [];
            this.input = new InputHandler(this);
            this.scrollX = this.player.x;
            this.scrollY = this.player.y;
        }
        update(deltaTime) {
            let keys = this.input.keys;
            this.player.update(deltaTime, keys);
            
            this.scrollX = this.player.x + this.width / 2;
            this.scrollY = this.player.y + this.height / 2;

            this.enemies.forEach(enemyTank => {
                enemyTank.update(deltaTime);
            })

            this.shots.forEach(shot => {
                shot.update(deltaTime);
            })
            this.shots.filter((shot) => !shot.markedForDeletion);
        }
        draw(context) {
            context.fillStyle = "#006622";
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            this.shots.forEach(shot => {
                shot.draw(context);
            })

            this.enemies.forEach(enemyTank => {
                enemyTank.draw(context);
            })

            this.player.draw(context);
        }
        addShot(x, y, rotation, id) {
            this.shots.push(new Shot(this, x * -1, y * -1, rotation, id));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        game.update(deltaTime);
        game.draw(ctx);

        requestAnimationFrame(animate);
    }
    animate(0);
})