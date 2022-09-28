const CONTENTS = {
	EMPTY: 0, E: 0,
	TILE: 1, T: 1,
	INDESTRUCTIBLE: 2, D: 2,
	SPIKE: 3, S: 3,
	SPEEDITEM: 4, P: 4
}

export class Grid {
	constructor(game, map) {
		this.game = game;
		this.map = map;
		this.height = map.length;
		this.width = map[0].length;
		this.d_img = document.getElementById("d_field_img");
		this.t_img = document.getElementById("t_field_img");
		this.p_img = document.getElementById("p_field_img");
		this.r_img = document.getElementById("r_field_img");
		this.b_img = document.getElementById("b_field_img");

		this.game.resize(this.width, this.height);
	}
	draw(context) {
		const tileSize = this.game.tileSize;
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let char = this.get(x, y);
				if (char == "E") {
					continue;
				}
				if (char == "T") {
					context.drawImage(this.t_img, x * tileSize, y * tileSize, tileSize, tileSize);
				}
				if (char == "D") {
					context.drawImage(this.d_img, x * tileSize, y * tileSize, tileSize, tileSize);
				}
				if (char == "P") {
					context.drawImage(this.p_img, x * tileSize, y * tileSize, tileSize, tileSize);
				}
				if (char == "R") {
					context.drawImage(this.r_img, x * tileSize, y * tileSize, tileSize, tileSize);
				}
				if (char == "B") {
					context.drawImage(this.b_img, x * tileSize, y * tileSize, tileSize, tileSize);
				}
				
				
			}
		}
	}
	get(x, y) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			return "E";
		}
		return this.map[Math.floor(y)][Math.floor(x)];
	}
}