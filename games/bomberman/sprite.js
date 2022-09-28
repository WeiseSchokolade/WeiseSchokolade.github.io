export class Bomb {
	constructor(game, x, y, playerSourceID, timeLeft, tileSize, id) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.playerSourceID = playerSourceID;
		this.timeLeft = timeLeft;
		this.tileSize = tileSize;
		this.id = id;
		this.image = document.getElementById("bomb_img");
		this.frameX = 0;
		this.frameWidth = 64;
		this.frameHeight = 64;
		this.frameTimer = 0;
		this.frameInterval = 1000 / 5;
		this.maxFrame = 1;
	}
	update(deltaTime) {
		this.timeLeft -= deltaTime;

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
	draw(context) {
		context.drawImage(this.image, this.frameX * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x * this.tileSize, this.y * this.tileSize, this.tileSize, this.tileSize);
	}
}

export class ExplosionParticle {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.tileSize = this.game.tileSize;
		this.width = this.tileSize;
		this.height = this.tileSize;
		this.age = 0;
		this.duration = 0.5 * 1000;
		this.markedForDeletion = false;
		this.image = document.getElementById("explosion_img")
		this.frameX = 0;
		this.frameWidth = 64;
		this.frameHeight = 64;
		this.frameTimer = 0;
		this.frameInterval = 1000 / 20;
		this.maxFrame = 5;
	}
	update(deltaTime) {
		this.age += deltaTime;
		if (this.age > this.duration) {
			this.markedForDeletion = true;
		}

		if (this.frameTimer > this.frameInterval) {
			this.frameTimer = 0;
			if (this.frameX < this.maxFrame) {
				this.frameX++;
			} else {
				this.markedForDeletion = true;
			}
		} else {
			this.frameTimer += deltaTime;
		}
	}
	draw(context) {
		context.drawImage(this.image, this.frameX * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x * this.tileSize, this.y * this.tileSize, this.width, this.height);
	}
}

export class OtherPlayer {
	constructor(game, packet) {
		this.game = game;
		this.id = packet.id;
		this.x = packet.x;
		this.vx = 0;
		this.y = packet.y;
		this.vy = 0;
        this.sizeFactor = 0.7;
        this.width = game.tileSize * this.sizeFactor;
        this.height = game.tileSize * this.sizeFactor;
        this.image = document.getElementById(packet.img);
		this.maxFrame = 1;
		this.frameX = 0;
		this.frameY = 0;
		this.frameWidth = 64;
		this.frameHeight = 64;
		this.frameTimer = 0;
		this.frameInterval = 1000 / 3;
		this.username = packet.username;
		this.alive = true;
	}
	update(deltaTime) {
		if (this.alive) {
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

			this.x += this.vx;
			this.y += this.vy;
			
        	this.vx *= 0.7;
        	this.vy *= 0.7;
		}
	}
	draw(context) {
		if (this.alive) {
			context.drawImage(this.image, this.frameX * this.frameWidth, this.frameY * this.frameHeight, this.frameWidth, this.frameHeight, this.x * this.game.tileSize, this.y * this.game.tileSize, this.width, this.height);
			context.font = "15px consolas";
			context.textAlign = "center";
			context.fillStyle = "#777777";
			context.fillText(this.username, this.x * this.game.tileSize + this.width / 2, this.y * this.game.tileSize - 7.5);
		}
	}
	updateFromPacket(packet) {
		this.x = packet.x;
		this.y = packet.y;
		this.vx = packet.vx;
		this.vy = packet.vy;
	}
}

export class TextBox {
	constructor(text, x, y, vx, vy, duration, fontsize, color) {
		this.text = text;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.duration = duration;
		this.maxAge = duration;
		this.fontsize = fontsize;
		this.color = color;
		this.markedForDeletion = false;
	}
	update(deltaTime) {
		this.x += this.vx * 0.01 * deltaTime;
		this.y += this.vy * 0.01 * deltaTime;
		
		this.duration -= deltaTime;
		if (this.duration < 0) {
			this.markedForDeletion = true;
		}
	}
	draw(context) {
		context.font = this.fontsize + "px consolas";
		context.fillStyle = this.color;
		context.globalAlpha = this.duration / this.maxAge;
		context.fillText(this.text, this.x, this.y)
		context.globalAlpha = 1;
	}
}