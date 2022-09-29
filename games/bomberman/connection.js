import { Grid } from "./Grid.js";
import { Player } from "./player.js";
import { ExplosionParticle, OtherPlayer, TextBox } from "./sprite.js";

export class ConnectionHandler {
	constructor(game, ip) {
		this.game = game;
		this.socket = new WebSocket(ip);
		this.socket.onopen = () => {
			this.sendPacket({
				type: "ClientConnected",
				username: this.game.username
			})
		};
		this.socket.onclose = ((event) => {
			console.log("Connection closed! " + event.code);
			if (event.code == 1000 || event.code == 1001) {
				
			} else {
				this.game.connectionFailed();
			}
		});
		this.socket.onmessage = (message) => {
			this.handlePacket(JSON.parse(message.data));
		}
		this.socket.onerror = ((event) => {
			console.log(event);
		});
	}
	sendPacket(packet) {
		if (packet.type != "PlayerUpdate" && packet.type != "AddBomb") {
			console.log(packet);
		}
		const pack = {
			type: packet.type,
			properties: packet
		}
		this.socket.send(JSON.stringify(pack));
	}
	handlePacket(packet) {
		if (packet.type == "OpenPacket") {
			console.log(packet);
			this.game.grid = new Grid(this.game, packet.map);
			this.game.player.id = packet.id;
			this.game.player.x = packet.x;
			this.game.player.y = packet.y;
			this.game.connectionConnected();
		} else if (packet.type == "StartGame") {
			console.log(packet);
			this.game.grid = new Grid(this.game, packet.map);
			
			for (let i = 0; i < packet.players.length; i++) {
				let playerData = packet.players[i];
				this.addPlayer(playerData);
			}

			this.game.startGame();
		} else if (packet.type == "PlayerDeathPacket") {
			this.game.player.alive = false;
			this.game.text.push(new TextBox("You're dead!", this.game.width / 2, 50, 0, 0, 9999999, 50, "#FF0000"));
			
			if (packet.byBomb) {
				let username = "Unknown";
				for (let i = 0; i < this.game.players.length; i++) {
					let p = this.game.players[i];
					if (p.id = packet.killerID) {
						username = p.username;
						break;
					}
				}
				this.game.text.push(new TextBox("You were blown up by " + username + "!", this.game.width / 2, this.game.height - 50, 0, -2, 4000, 40, "#FF0000"));
				console.log("Stay swiftie!")
			}
		} else if (packet.type == "OtherPlayerDeathPacket") {
			for (let i = 0; i < this.game.players.length; i++) {
				let p = this.game.players[i];
				if (p.id == packet.playerID) {
					p.alive = false;
					this.game.text.push(new TextBox("" + p.username + " died!", this.game.width / 2, this.game.height - 50, 0, -5, 2000, 35, "#FF0000"));
				}
			}
		} else if (packet.type == "GameOver") {
			this.game.gameOver(packet.winnerID);
		} else if (packet.type == "PlayerPosPacket") {
			this.game.player.x = packet.x;
			this.game.player.y = packet.y;
		} else if (packet.type == "PlaceBomb") {
			if (packet.playerSourceID == this.game.player.id) {
				this.game.player.bombAmount++;
			}
			this.game.addBomb(packet.x, packet.y, packet.playerSourceID, packet.timeLeft, packet.id);
		} else if (packet.type == "LoadMap") {
			this.game.grid = new Grid(this.game, packet.map);
		} else if (packet.type == "UpdateStats") {
			this.game.player.maxBombAmount = packet.maxBombAmount;
			this.game.player.maxSpeed = packet.maxSpeed;
		} else if (packet.type == "JoinPlayer") {
			console.log(packet);
			this.addPlayer(packet);
			this.game.text.push(new TextBox("" + packet.username + " joined the game!", this.game.width / 2, this.game.height - 50, 0, -5, 2000, 25, "#00AA00"));
		} else if (packet.type == "OtherPlayerUpdate") {
			for (let i = 0; i < this.game.players.length; i++) {
				let otherPlayer = this.game.players[i];
				if (otherPlayer.id == packet.id) {
					otherPlayer.updateFromPacket(packet);
					break;
				}
			}
		} else if (packet.type == "RemoveBomb") {
			if (packet.playerSourceID == this.game.player.id) {
				this.game.player.bombAmount--;
			}
			for (let i = 0; i < this.game.bombs.length; i++) {
				let bomb = this.game.bombs[i];
				if (bomb.id == packet.id) {
					this.game.bombs.splice(i, 1);
					i--;
				}
			}
			for (let i = 0; i < packet.removedTiles.length; i += 2) {
				this.game.particles.push(new ExplosionParticle(this.game, packet.removedTiles[i], packet.removedTiles[i + 1]));
			}
		} else if (packet.type == "ErrorPacket") {
			console.log("An error occured! " + JSON.stringify(packet));
		}
	}
	addBomb(player) {
		this.sendPacket({
			type: "AddBomb"
		});
	}
	addPlayer(playerData) {
		for (let i = 0; i < this.game.players.length; i++) {
			let p = this.game.players[i];
			if (p.id == playerData.id) {
				return;
			}
		}
		this.game.players.push(new OtherPlayer(this.game, playerData));
	}
	updatePlayer(player) {
		this.sendPacket({
			type: "PlayerUpdate",
			x: player.x,
			y: player.y,
			vx: player.vx,
			vy: player.vy
		})
	}
}