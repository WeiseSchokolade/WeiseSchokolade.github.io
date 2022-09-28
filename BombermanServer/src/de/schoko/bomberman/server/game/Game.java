package de.schoko.bomberman.server.game;

import java.util.ArrayList;

import org.java_websocket.WebSocket;

import com.google.gson.Gson;

import de.schoko.bomberman.server.Player;
import de.schoko.bomberman.server.logging.Logging;
import de.schoko.bomberman.server.packets.*;

public class Game {
	private boolean isActive = true;
	private boolean isRunning = false;
	
	private ArrayList<Player> players;
	
	// D = inDestructible E = Empty T = Tile S = Spike P = sPeed item
	private String[] map = {
		"DDDDDDDDDDDDDDD",
		"DEETTTTTTTTTEED",
		"DEDTDTDTDTDTDED",
		"DTTTTTTTTTTTTTD",
		"DTDTDTDTDTDTDTD",
		"DTTTTTTTTTTTTTD",
		"DTDTDTDTDTDTDTD",
		"DTTTTTTTTTTTTTD",
		"DEDTDTDTDTDTDED",
		"DEETTTTTTTTTEED",
		"DDDDDDDDDDDDDDD"
	};
	private final int mapWidth = map[0].length();
	private final int mapHeight = map.length;
	
	private float end_time = 1000;
	private boolean ending = false;
	private int alivePlayerID = -1;
	
	private float start_time = 1000;
	private boolean started = true;
	
	private Field[][] fields;
	private Bomb[][] bombs;
	
	public Game() {
		int mapHeight = map.length;
		int mapWidth = map[0].length();
		players = new ArrayList<>();
		
		fields = new Field[mapHeight][mapWidth];
		for (int y = 0; y < mapHeight; y++) {
			for (int x = 0; x < mapWidth; x++) {
				fields[y][x] = Field.valueOf("" + map[y].charAt(x));
			}
		}
		bombs = new Bomb[mapHeight][mapWidth];
		for (int y = 0; y < mapHeight; y++) {
			bombs[y] = new Bomb[mapWidth];
		}
	}
	
	public void start() {
		isRunning = true;
		Logging.logInfo("Starting game!");
		
		for (int i = 0; i < players.size(); i++) {
			Player player = players.get(i);
			player.sendPacket(StartGame.get(this, player.getID()));
		}
	}
	
	public void stopGame(int winnerID) {
		sendPacketToAll(GameOver.get(winnerID));
		this.isActive = false;
		this.isRunning = false;
		Logging.logInfo("Stopped game!");
	}
	
	long time = 0;
	
	public void tick(float deltaTimeMS) {
		if (!isRunning) {
			if (players.size() >= 2) {
				start();
			}
		} else {
			if (!started) {
				start_time -= deltaTimeMS;
				if (start_time < 0) {
					started = true;
				}
				return;
			}
		}
		
		float deltaTimeS = deltaTimeMS / 1000.0f;
		
		if (ending) {
			end_time -= deltaTimeMS;
			if (end_time < 0) {
				stopGame(alivePlayerID);
			}
			return;
		}
		
		for (int i = 0; i < players.size(); i++) {
			Player player = players.get(i);
			player.update(deltaTimeMS);
		}
		
		for (int i = 0; i < bombs.length; i++) {
			for (int j = 0; j < bombs[i].length; j++) {
				Bomb b = bombs[i][j];
				if (b == null) {
					continue;
				}
				b.updateTime(deltaTimeS);
				if (!b.isTimeLeft()) {
					b.blowUp(this);
				}
			}
		}
		
		for (int i = 0; i < bombs.length; i++) {
			for (int j = 0; j < bombs[i].length; j++) {
				if (bombs[i][j] == null) {
					continue;
				}
				if (bombs[i][j].isBlownUp()) {
					bombs[i][j] = null;
				}
			}
		}
		
		if (isRunning) {
			int alivePlayerAmount = 0;
			for (int i = 0; i < players.size(); i++) {
				Player player = players.get(i);
				if (player.isAlive()) {
					alivePlayerAmount++;
					alivePlayerID = player.getID();
				}
			}
			if (alivePlayerAmount == 1) {
				this.ending = true;
				time = System.currentTimeMillis();
			} else if (alivePlayerAmount == 0) {
				this.isRunning = false;
				this.isActive = false;
			}
		}
	}
	
	public boolean playerJoin(Player player) {
		if (players.size() >= 4) {
			return false;
		}
		
		players.add(player);
		player.setGame(this);
		
		int playerID = players.size();
		double startX = player.getX();
		double startY = player.getY();
		
		switch (playerID) {
		case 1:
			startX = 1;
			startY = 1;
			break;
		case 2:
			startX = mapWidth - 2;
			startY = mapHeight - 2;
			break;
		case 3:
			startX = mapWidth - 2;
			startY = 1;
			break;
		case 4:
			startX = 1;
			startY = mapHeight - 2;
			break;
		default:
			break;
		}
		
		player.silSetPos(startX, startY);
		player.sendPacket(OpenPacket.get(getStringMap(), player.getID(), (int) player.getX(), (int) player.getY()));
		
		if (isRunning) {
			sendPacketToAllExceptID(JoinPlayer.get(player), player.getID());
			player.sendPacket(StartGame.get(this, player.getID()));
		}
		
		return true;
	}
	
	public boolean contains(Player conn) {
		return players.contains(conn);
	}
	
	
	public <T extends Packet> void sendPacketToAll(T p) {
		for (Player player : players) {
			player.sendPacket(p);
		}
	}
	
	public <T extends Packet> void sendPacketToAllExceptID(T p, int id) {
		for (int i = 0; i < players.size(); i++) {
			Player player = players.get(i);
			if (player.getID() == id) continue;
			player.sendPacket(p);
		}
	}
	
	public void handlePacket(Player playerSender, String jsonPacket) {
		Gson gson = Player.getGson();
		
		Packet p = gson.fromJson(jsonPacket, Packet.class);
		
		if (!isRunning) {
			Logging.logInfo("Error packet");
			playerSender.sendPacket(ErrorPacket.get("Cannot send packets since the game is not running yet!"));
			return;
		}
		
		if (p == null) {
			playerSender.sendPacket(ErrorPacket.get("Unknown packet! Unable to interprete '" + jsonPacket + "'"));
			return;
		}
		
		if (p.type.equals("PingPacket")) {
			playerSender.sendPacket(new PongPacket());
		} else if (p.type.equals("SetTile")) {
			playerSender.sendPacket(ErrorPacket.get("Cannot sent 'SetTile' Packet from client."));
			return;
		} else if (p.type.equals("PlayerUpdate")) {
			PlayerUpdate pack = (PlayerUpdate) p;
			for (Player player : players) {
				if (player.getID() == playerSender.getID()) {
					player.update(pack);
					break;
				}
			}
		} else if (p.type.equals("AddBomb")) {
			for (Player player : players) {
				if (player.getID() == playerSender.getID()) {
					if (player.getPlacedBombAmount() >= player.getMaxBombAmount()) {
						player.sendPacket(ErrorPacket.get("Cannot place bomb since player already placed all bombs"));
						return;
					}
					try {
						if (this.bombs[(int) (player.getY())][(int) (player.getX())] != null) {
							return;
						}
					} catch (ArrayIndexOutOfBoundsException e) {
						return;
					}
					
					Bomb b = new Bomb((int) (player.getX() + player.getSizeFactor() / 2), (int) (player.getY() + player.getSizeFactor() / 2), player.getBombStrength(), player.getID());
					
					this.bombs[(int) (player.getY())][(int) (player.getX())] = b;
					player.setPlacedBombAmount(player.getPlacedBombAmount() + 1);
					
					
					
					PlaceBomb placeBombPacket = PlaceBomb.get(b);
					sendPacketToAll(placeBombPacket);
					break;
				}
			}
		} else {
			ErrorPacket pack = new ErrorPacket();
			pack.error = "Unknown packet! Unable to interprete '" + jsonPacket + "'";
			playerSender.sendPacket(pack);
			return;
		}
	}
	
	public void place(Field field, int x, int y) {
		this.fields[y][x] = field;
	}
	
	public Field get(int x, int y) {
		return this.fields[y][x];
	}
	
	public Bomb getBombAt(int x, int y) {
		return this.bombs[y][x];
	}
	
	public void fill(Field field, int x, int y, int width, int height) {
		for (int i = x; i < x + width; i++) {
			for (int j = y; j < y + height; j++) {
				try {
					this.fields[j][i] = field;
				} catch (ArrayIndexOutOfBoundsException e) {};
			}
		}
	}
	
	public void sendMapUpdate() {
		sendPacketToAll(LoadMap.get(getStringMap()));	
	}
	
	public String[] getStringMap() {
		String[] map = new String[this.fields.length];
		
		for (int i = 0; i < map.length; i++) {
			String row = "";
			
			for (int j = 0; j < this.fields[0].length; j++) {
				row += this.fields[i][j];
			}
			
			map[i] = row;
		}
		
		return map;
	}
	
	public Player getPlayer(int id) {
		for (Player p : players) {
			if (p.getID() == id) {
				return p;
			}
		}
		return null;
	}
	
	public boolean isActive() {
		return isActive;
	}
	
	public boolean isRunning() {
		return isRunning;
	}
	
	public ArrayList<Player> getPlayers() {
		return players;
	}

	public Player getPlayer(WebSocket conn) {
		for (Player p : players) {
			if (p.isConnectedTo(conn)) {
				return p;
			}
		}
		return null;
	}

	public void removePlayer(WebSocket conn) {
		for (int i = 0; i < players.size(); i++) {
			Player p = players.get(i);
			if (p.isConnectedTo(conn)) {
				players.remove(i);
				break;
			}
		}
		if (players.size() == 0) {
			this.isActive = false;
		}
	}
}
