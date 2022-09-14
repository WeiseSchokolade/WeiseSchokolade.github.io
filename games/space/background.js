export class Background {
    constructor(game) {
        this.game = game;
        this.lines = [];
        this.frameTimer = 0;
        this.frameInterval = 1000 / 10;
    }
    update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            this.addLine();
        } else {
            this.frameTimer += deltaTime;
        }
        this.lines.forEach(line => {
            line.update();
        })
        this.lines = this.lines.filter(line => !line.markedForDeletion);
    }
    draw(context) {
        context.fillStyle = "#387136";
        context.fillRect(0, 0, this.game.width, this.game.height);
        this.lines.forEach((line) => {
            context.fillStyle = "#4f934d";
            context.fillRect(line.x, line.y, line.width, 5);
        })
    }
    addLine() {
        this.lines.push(new Line(this.game));
    }
}

class Line {
    constructor(game) {
        this.game = game;
        this.width = Math.random() * 50 + 50;
        this.x = Math.random() * this.game.width - this.width / 2;
        this.y = 0;
        this.markedForDeletion = false;
    }
    update() {
        if (this.game.height < this.y) this.markedForDeletion = true;
        this.y += 3;
    }
}