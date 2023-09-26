import {Mouse} from "../rrswjs.js";

const words = [
	["je suis", "tu es", "il est", "nous sommes", "vous êtes", "ils sont"],
	["j'ai", "tu as", "il a", "nous avons", "vous avez", "ils ont"],
	["je vais", "tu vas", "il va", "nous allons", "vous allez", "ils vont"],
	["je fais", "tu fais", "il fait", "nous faisons", "vous faites", "ils font"],
	["je cherche", "tu cherches", "il cherche", "nous cherchons", "vous cherchez", "ils cherchent"]
]

export class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.types = ["1. Sg.", "2. Sg.", "3. Sg.", "1. Pl.", "2. Pl.", "3. Pl."]
		this.newTypes = [];
		this.objs = [];
		this.comingObjs = [];
		this.pickNewType();
		this.wordSpeed = 1000;
		this.timeSinceLastWord = 0;
		this.lastG = null;
		this.mouse = new Mouse(canvas, null);
		this.total = 0;
		this.totalCorrect = 0;
		this.totalWrong = 0;
	}

	draw(graph, deltaTime) {
		this.mouse.graph = graph;
		this.lastG = graph;
		if (this.timeSinceLastWord > this.wordSpeed) {
			this.timeSinceLastWord = 0;
			this.addWord();
		} else {
			this.timeSinceLastWord += deltaTime;
		}
		if (this.comingObjs.length > 3 && this.objs.length < 13) {
			let word = this.comingObjs.splice(this.comingObjs.length * Math.random(), 1)[0];
			for (let i = 0; i < 10; i++) {
				let overlaps = false;
				for (let i = 0; i < this.objs.length; i++) {
					if (this.objs[i].overlaps(word)) {
						overlaps = true;
						word.findNewPosition();
						break;
					};
				}
				if (!overlaps) break;
			}
			this.objs.push(word);
		}
		this.mouse.update();
		this.objs.forEach(word => {
			word.update(deltaTime);
		})
		this.objs = this.objs.filter(word => {
			if (word.remove == word.removeTime) {
				this.total++;
				if (word.correct) {
					this.pickNewType();
					this.totalCorrect++;
				} else {
					this.totalWrong++;
				}
			}
			return !word.shouldRemove
		});
		this.objs.forEach(word => {
			word.draw(graph);
		})
		graph.drawPoint(this.mouse.x, this.mouse.y, "darkgreen");

		graph.ctx.font = "30px Segoe UI";
		graph.ctx.textAlign = "center";
		graph.ctx.fillText(this.currentType, graph.canvas.width / 2, 30)
		graph.ctx.font = "15px Segoe UI";
		graph.ctx.textAlign = "center";
		graph.ctx.fillText("Total: " + this.total + " Correct: " + this.totalCorrect + " Faux: " + this.totalWrong, graph.canvas.width / 2, 50);
	}

	addWord() {
		if (this.comingObjs.length > 3) return;
		if (this.newTypes.length == 0) {
			this.newTypes = [0, 1, 2, 3, 4, 5];
			this.newTypes = [...this.newTypes, ...this.newTypes];
		}
		let rn = Math.floor(this.newTypes.length * Math.random());
		let i = this.newTypes.splice(rn, 1)[0];
		let type = this.types[i];
		let word = words[Math.floor(Math.random() * words.length)][i];
		this.comingObjs.push(new Word(this, word, type));
	}

	pickNewType() {
		let possibleTypes = new Set();
		this.objs.forEach(word => {
			possibleTypes.add(word.solution);
		});

		if (possibleTypes.size == 0) {
			this.currentType = this.types[Math.floor(this.types.length * Math.random())];
		} else {
			this.currentType = possibleTypes[Math.floor(possibleTypes.length * Math.random())];
		}
	}
}

class Word {
	constructor(game, text, solution) {
		this.findNewPosition();
		this.game = game;
		this.text = text;
		this.font = "20px serif";
		game.lastG.ctx.font = this.font;
		let textMeasure = game.lastG.ctx.measureText(this.text);
		this.width = game.lastG.convBackFromSW(textMeasure.width) + 0.2;
		this.height = 0.4;
		this.solution = solution;
		this.mouse = game.mouse;
		this.correct = false;
		this.remove = 0;
		this.removeTime = 500;
		this.shouldRemove = false;
	}

	update(deltaTime) {
		if (this.remove > 0) {
			this.remove -= deltaTime;
			if (this.remove <= 0) {
				this.shouldRemove = true;
			}
			return;
		}
		if (this.mouse.x >= this.x && this.mouse.x < this.x + this.width && 
			this.mouse.y >= this.y && this.mouse.y < this.y + this.height) {
			if (this.mouse.pressed) {
				this.remove = this.removeTime;
				if (this.game.currentType == this.solution) {
					this.correct = true;
				} else {
					this.correct = false;
				}
			}
		}
	}

	draw(graph) {
		//graph.drawRect(this.x, this.y, this.x + graph.convBackFromSW(this.width), this.y + graph.convBackFromSH(this.height), "black");
		graph.ctx.font = this.font;
		graph.drawRect(this.x - 0.1, this.y - 0.1, this.x + this.width + 0.2, this.y + this.height, "black");
		graph.fillRect(this.x - 0.1, this.y - 0.1, this.x + this.width + 0.2, this.y + this.height, (this.remove > 0) ? ((this.correct) ? "green" : "red") : "white");
		graph.drawText(this.text, this.x, this.y, "black", "left");
	}

	findNewPosition() {
		this.x = Math.random() * 8 - 4;
		this.y = Math.random() * 8 - 4;
	}

	overlaps(word) {
		return (word.x < this.x + this.width + 0.1 &&
			word.x + word.width + 0.1 > this.x &&
			word.y < this.y + this.height + 0.1 &&
			word.y + word.height + 0.1 > this.y);
	}
}