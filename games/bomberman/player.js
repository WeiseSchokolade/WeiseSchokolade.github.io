export class Player {
	constructor(game) {
		this.game = game;
		this.x = 0;
		this.vx = 0;
		this.y = 0;
		this.vy = 0;
		this.sizeFactor = 0.7;
		this.width = game.tileSize * this.sizeFactor;
		this.height = game.tileSize * this.sizeFactor;
		this.facing = 3; // 0 = up, 1 = right, 2 = down, 3 = left
		this.id = -1;
		this.bombCooldown = 0;
		this.image = document.getElementById("player_img");
		this.frameX = 0;
		this.frameY = 0;
		this.frameWidth = 64;
		this.frameHeight = 64;
		this.frameTimer = 0;
		this.frameInterval = 1000 / 3;
		this.maxFrame = 1;
		this.maxSpeed = 0.002;
		this.bombAmount = 0;
		this.maxBombAmount = 1;
		this.username = this.game.username;
		this.alive = true;
	}
	update(deltaTime) {
		if (this.alive) {
			let keys = this.game.input.keys;
			
			const speed = this.maxSpeed * deltaTime;
			if (this.bombCooldown > 0) {
				this.bombCooldown -= deltaTime;
			}
			if (keys.includes("ArrowUp") || keys.includes("w")) {
				this.vy = -speed;
			}
			if (keys.includes("ArrowDown") || keys.includes("s")) {
				this.vy = speed;
			}
			if (keys.includes("ArrowLeft") || keys.includes("a")) {
				this.vx = -speed;
			}
			if (keys.includes("ArrowRight") || keys.includes("d")) {
				this.vx = speed;
			}
			if (keys.includes(" ") && this.bombCooldown <= 0 && this.bombAmount < this.maxBombAmount) {
				this.game.connection.addBomb(this);
				this.bombCooldown = 250;
			}
			this.game.connection.updatePlayer(this);
			
			if (this.game.grid) {
				this.x += this.vx;
				if (this.vx != 0 && this.isInSolid()) {
					this.x -= this.vx;
					this.vx = 0;
				}

				this.y += this.vy;
				if (this.vy != 0 && this.isInSolid()) {
					this.y -= this.vy;
					this.vy = 0;
				}
			}

			this.vx *= 0.7;
			this.vy *= 0.7;

			
			if (this.frameTimer > this.frameInterval) {
				this.frameTimer = 0;
				if (this.frameX < this.maxFrame) {
					this.frameX++;
				} else {
					this.frameX = 0;
				}
			} else {
				this.frameTimer += deltaTime;
			}
		}
	}
	isInSolid() {
		let passables = ["E", "P", "B", "R"];

		return (!passables.includes(this.game.grid.get(this.x + this.sizeFactor, this.y + this.sizeFactor)) ||
				!passables.includes(this.game.grid.get(this.x + this.sizeFactor, this.y)) ||
				!passables.includes(this.game.grid.get(this.x, this.y + this.sizeFactor)) ||
				!passables.includes(this.game.grid.get(this.x, this.y)));
	}
	draw(context) {
		if (this.alive) {
			context.drawImage(this.image, this.frameX * this.frameWidth, this.frameY * this.frameHeight, this.frameWidth, this.frameHeight, this.x * this.game.tileSize, this.y * this.game.tileSize, this.width, this.height);
			context.textAlign = "center";
			context.font = "bold 15px consolas";
			context.fillStyle = "#77FF77";
			context.fillText(this.username, this.x * this.game.tileSize + this.width / 2, this.y * this.game.tileSize - 7.5);
		}
	}
}