import { ConnectionHandler } from "./connection.js";
import { InputHandler } from "./input.js";
import { Player } from "./player.js";
import { Bomb } from "./sprite.js";

window.addEventListener("load", function () {
	const init_button = document.getElementById("init_btn");

	init_button.addEventListener("click", function () {
		const username = document.getElementById("name_field").value;
		if (!username) {
			return;
		}
		const init_box = document.getElementById("init_box");
		init_box.hidden = true;

		const status_box = document.getElementById("status_box");
		const status_text_element = document.getElementById("status_text");
		let status_text = "Connecting to server"
		const status_info_element = document.getElementById("status_info");
		const game_box = document.getElementById("game_box");
		const canvas = document.getElementById("canvas1");
		const ctx = canvas.getContext("2d");
		canvas.width = 1024;
		canvas.height = 1024;

		let game = null;

		let connectionTimerId = 0;
		let connectionTextFrame = 0;
		function animateConnectionText() {
			let s = "";
			connectionTextFrame++;
			if (connectionTextFrame > 3) {
				connectionTextFrame = 1;
			}
			s = ".".repeat(connectionTextFrame);
			status_text_element.textContent = status_text + s;
		}
		connectionTimerId = setInterval(animateConnectionText, 500);

		let lastTime = 0;
		function animate(timeStamp) {
			const deltaTime = timeStamp - lastTime;
			lastTime = timeStamp;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			game.update(deltaTime);
			game.draw(ctx);
			if (game.running) {
				requestAnimationFrame(animate);
			}
		}

		class Game {
			constructor(width, height, username) {
				this.width = width;
				this.height = height;
				this.username = username;
				this.tileSize = 64;
				this.resizeFactor = this.width / this.tileSize;
				this.input = new InputHandler(this);
				this.connection = new ConnectionHandler(this, "ws://45.131.111.244:2009");
				this.grid = false;
				this.player = new Player(this);
				this.players = [];
				this.bombs = [];
				this.particles = [];
				this.text = [];
				this.running = false;
			}
			update(deltaTime) {
				this.player.update(deltaTime);
				this.players.forEach((p) => {
					p.update(deltaTime);
				})

				this.bombs.forEach((bomb) => {
					bomb.update(deltaTime);
				})
				this.particles.forEach((particle) => {
					particle.update(deltaTime);
				});
				this.text.forEach((text) => {
					text.update(deltaTime);
				})
				this.particles = this.particles.filter(particle => !particle.markedForDeletion);
				this.text = this.text.filter(text => !text.markedForDeletion);
			}
			draw(context) {
				if (this.grid) {
					this.grid.draw(context);
				}
				this.bombs.forEach((bomb) => {
					bomb.draw(context);
				})
				this.particles.forEach((particle) => {
					particle.draw(context);
				})
				this.players.forEach((p) => {
					p.draw(context);
				});
				this.player.draw(context);
				this.text.forEach((text) => {
					text.draw(context);
				})
			}
			gameOver(winnerID) {
				this.running = false;
				status_box.hidden = false;
				game_box.hidden = true;
				status_text = "Connecting to next game!";
				status_info.textContent = "Player " + winnerID + " won!";
				this.grid = false;
				this.player = new Player(this);
				this.players = [];
				this.bombs = [];
				this.particles = [];
				this.text = [];
				clearInterval(connectionTimerId);
				connectionTimerId = setInterval(animateConnectionText, 500);
			}
			addBomb(x, y, playerSourceID, timeLeft, id) {
				this.bombs.push(new Bomb(this, x, y, playerSourceID, timeLeft, this.tileSize, id));
			}
			startGame() {
				status_box.hidden = true;
				game_box.hidden = false;
				clearInterval(connectionTimerId);
				this.running = true;
				animate(0);
			}
			connectionFailed() {
				clearInterval(connectionTimerId);
				status_box.hidden = false;
				game_box.hidden = true;
				status_text_element.textContent = "Connection to server failed";
				status_info.textContent = "Try again later or contact the owner of this website";
			}
			connectionConnected() {
				status_box.hidden = false;
				game_box.hidden = true;
				status_text = "Finding players";
				status_info.textContent = "Make someone else join since we only need 2 people to play."
			}
			resize(width, height) {
				this.width = width * this.tileSize;
				this.height = height * this.tileSize;
				canvas.width = this.width;
				canvas.height = this.height;
				this.resizeFactor = this.width / this.tileSize;
			}
		}

		game = new Game(canvas.width, canvas.height, username);
	}
	);
});
