package de.schoko.bomberman.server;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import de.schoko.bomberman.server.game.Game;
import de.schoko.bomberman.server.logging.Logging;

public class Server extends WebSocketServer {
	private Game lastGame;
	private ArrayList<Game> games;
	private ArrayList<Player> unadded_players;
	private HashMap<String, Player> players;
	private volatile boolean serverOnline = false;
	
	public Server() {
		super(new InetSocketAddress(2009));
		
		games = new ArrayList<>();
		unadded_players = new ArrayList<>();
		
		this.lastGame = new Game();
		this.games.add(lastGame);
		
		players = new HashMap<>();
	}
	
	public void boot() {
		this.start();
		
		while (true) {
			if (serverOnline) {
				long lastTime = 0;
				long deltaTime = 0;
				while (true) {
					lastTime = System.nanoTime();
					float deltaTimeMS = deltaTime / 1000000.0f;
					try {
						for (int i = 0; i < this.games.size(); i++) {
							Game game = this.games.get(i);
							game.tick(deltaTimeMS);
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
					
					ArrayList<Player> pending_players = new ArrayList<>();
					for (int i = 0; i < this.unadded_players.size(); i++) {
						Player player = this.unadded_players.get(i);
						if (player.isConnectionComplete()) {
							pending_players.add(player);
							unadded_players.remove(i);
							i--;
						}
					}
					for (int i = 0; i < this.games.size(); i++) {
						Game game = this.games.get(i);
						if (!game.isActive()) {
							for (int j = 0; j < game.getPlayers().size(); j++) {
								Player p = game.getPlayers().get(j);
								p.reset();
								pending_players.add(p);
							}
							if (game.equals(lastGame)) {
								lastGame = new Game();
								this.games.add(lastGame);
							}
							this.games.remove(i);
							i--;
						}
					}
					
					if (pending_players.size() >= 1) {
						for (Player p : pending_players) {
							boolean success = lastGame.playerJoin(p);
							if (!success) {
								lastGame = new Game();
								this.games.add(lastGame);
								lastGame.playerJoin(p);
								Logging.logInfo("Added new game!");
							} else {
								Logging.logInfo("Successfully connected player to new game!");
							}
						}
					}
					pending_players.clear();
					
					if (!serverOnline) {
						break;
					}
					
					try {
						Thread.sleep(2);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					
					deltaTime = System.nanoTime() - lastTime;
				}
				Logging.logInfo("Somehow the server main function has ended.");
				serverOnline = false;
				try {
					this.stop();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				break;
			}
		}
		Logging.logInfo("Server complete!");
	}
	
	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		String ip = conn.getRemoteSocketAddress().toString();
		Logging.logInfo("New connection: " + ip);
		
		if (players.containsKey(ip)) {
			return;
		}
		Player player = new Player(conn);
		players.put(ip, player);
		this.unadded_players.add(player);
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
		Logging.logInfo("Closed connection with code " + code + " for '" + reason + "'");
		for (int i = 0; i < this.games.size(); i++) {
			Game game = this.games.get(i);
			if (game.getPlayer(conn) != null) {
				game.removePlayer(conn);
			}
		}
	}

	@Override
	public void onMessage(WebSocket conn, String message) {
		Player player = players.get(conn.getRemoteSocketAddress().toString());
		if (player.isConnectionComplete()) {
			player.getGame().handlePacket(player, message);
		} else {
			player.handlePacket(message);
		}
	}

	@Override
	public void onError(WebSocket conn, Exception ex) {
		System.out.println("We got an exception");
		ex.printStackTrace();
	}

	@Override
	public void onStart() {
		try {
			Logging.logInfo("Started server on address " + InetAddress.getLocalHost().getHostAddress() + " (iA)");
		} catch (UnknownHostException e) {
			Logging.logInfo("Started server on address " + getAddress().getHostName() + " (eA)");
		}
		serverOnline = true;
	}
}
