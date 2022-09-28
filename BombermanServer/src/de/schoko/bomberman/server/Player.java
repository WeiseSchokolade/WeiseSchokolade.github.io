package de.schoko.bomberman.server;

import java.util.ArrayList;

import org.java_websocket.WebSocket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import de.schoko.bomberman.server.game.Field;
import de.schoko.bomberman.server.game.FieldProperty;
import de.schoko.bomberman.server.game.Game;
import de.schoko.bomberman.server.packets.*;

public class Player {
	private WebSocket conn = null;
	private Game game = null;
	
	private ArrayList<String> unsentPackets;
	private static final int MAXUNSENTPACKETS = 50;

	private int id = -1;
	private String username = "null";
	
	private double x = 1;
	private double vx = 0;
	private double y = 1;
	private double vy = 0;
	private static double sizeFactor = 0.7;
	
	private boolean alive = true;
	
	private int placedBombAmount = 0;
	private int maxBombAmount = 1;
	private int bombStrength = 1;

	private double maxSpeed = 0.002;
	
	private boolean sentStartGame = false;
	
	private boolean connectionComplete = false;
	
	public Player(WebSocket conn) {
		this.conn = conn;
		this.id = (int) (Math.random() * 10000000);
		this.unsentPackets = new ArrayList<>();
		sentStartGame = false;
	}
	
	public void reset() {
		x = 1;
		vx = 0;
		y = 1;
		vy = 0;
		alive = true;
		placedBombAmount = 0;
		maxBombAmount = 1;
		bombStrength = 1;
		maxSpeed = 0.002;
		sentStartGame = false;
	}
	
	public void setPos(double x, double y) {
		this.x = x;
		this.y = y;
		sendPacket(PlayerPosPacket.get(x, y));
	}
	
	public void setGame(Game game) {
		this.game = game;
	}
	
	@Override
	public boolean equals(Object o) {
		if (o == null) return false;
		if (!(o instanceof Player)) return false;
		Player op = (Player) o;
		return op.conn.getRemoteSocketAddress().toString().equals(this.conn.getRemoteSocketAddress().toString());
	}
	
	public static Gson getGson() {
		return new GsonBuilder()
				.registerTypeAdapter(Packet.class, new PacketDeserializer())
				.serializeNulls()
				.create();
	}
	
	public void sendPacket(Packet p) {
		Gson gson = getGson();
		String toSend = gson.toJson(p);
		if (p instanceof StartGame) {
			if (sentStartGame) {
				return;
				//throw new RuntimeException("Yep");
			} else {
				sentStartGame = true;
				//Logging.logInfo("So we sent a start game packet!");
				//new RuntimeException().printStackTrace();
			}
		}
		
		if (conn.isOpen()) {
			if (unsentPackets.size() > 0) {
				if (unsentPackets.size() > MAXUNSENTPACKETS) {
					for (int i = 0; i < unsentPackets.size(); i++) {
						if (i >= MAXUNSENTPACKETS) {
							unsentPackets.remove(i);
							i--;
						}
					}
				}
			}
			
			conn.send(toSend);
		} else {
			this.unsentPackets.add(0, toSend);
		}
	}
	
	public void handlePacket(String jsonPacket) {
		Gson gson = Player.getGson();
		
		Packet p = gson.fromJson(jsonPacket, Packet.class);
		
		if (connectionComplete) {
			return;
		}
		
		if (p == null) {
			sendPacket(ErrorPacket.get("Unknown packet! Unable to interprete '" + jsonPacket + "'"));
			return;
		}
		if (p.type.equals("PingPacket")) {
			sendPacket(new PongPacket());
		} else if (p.type.equals("ClientConnected")) {
			connectionComplete = true;
			ClientConnected pack = (ClientConnected) p;
			this.username = pack.username;
		} else {
			sendPacket(ErrorPacket.get("Unknown packet! Unable to interprete '" + jsonPacket + "'"));
			return;
		}
	}

	public Game getGame() {
		return game;
	}
	
	public int getID() {
		return id;
	}
	
	public double getX() {
		return x;
	}
	
	public double getVX() {
		return vx;
	}
	
	public double getY() {
		return y;
	}
	
	public double getVY() {
		return vy;
	}
	
	public void setPlacedBombAmount(int newPlacedBombAmount) {
		this.placedBombAmount = newPlacedBombAmount;
	}
	
	public int getPlacedBombAmount() {
		return placedBombAmount;
	}
	
	public void update(float deltaTimeMS) {
		// TODO Add simulation of player input
	}
	
	public void update(PlayerUpdate p) {		
		if (Math.abs(p.x - this.x) >= this.maxSpeed * 20) {
			sendPosUpdate();
			return;
		}
		if (Math.abs(p.y - this.y) >= this.maxSpeed * 20) {
			sendPosUpdate();
			return;
		}
		
		try {
			if (this.game.get((int) (p.x + Player.sizeFactor), (int) (p.y + Player.sizeFactor)).is(FieldProperty.SOLID)) {
				sendPosUpdate();
				return;
			}
			if (this.game.get((int) (p.x + Player.sizeFactor), (int) p.y).is(FieldProperty.SOLID)) {
				sendPosUpdate();
				return;
			}
			if (this.game.get((int) p.x, (int) (p.y + Player.sizeFactor)).is(FieldProperty.SOLID)) {
				sendPosUpdate();
				return;
			}
			if (this.game.get((int) p.x, (int) p.y).is(FieldProperty.SOLID)) {
				sendPosUpdate();
				return;
			}
		} catch (ArrayIndexOutOfBoundsException e) {
			sendPosUpdate();
			return;
		}
		
		this.x = p.x;
		this.vx = p.vx;
		this.y = p.y;
		this.vy = p.vy;

		collectItemAt(this.x + Player.sizeFactor, this.y + Player.sizeFactor);
		collectItemAt(this.x + Player.sizeFactor, this.y);
		collectItemAt(this.x, this.y + Player.sizeFactor);
		collectItemAt(this.x, this.y);
		
		game.sendPacketToAllExceptID(OtherPlayerUpdate.get(this), id);
	}
	
	public void collectItemAt(double x, double y) {
		Field field = this.game.get((int) x, (int) y);
		if (field.is(FieldProperty.ITEM)) {
			switch (field) {
			case B:
				this.maxBombAmount++;
				break;
			case R:
				this.bombStrength++;
				break;
			case P:
				this.maxSpeed += 0.00075;
				break;
			default:
				break;
			}
			sendPacket(UpdateStats.get(this));
			this.game.place(Field.E, (int) x, (int) y);
			this.game.sendMapUpdate();
		}
	}
	
	public void sendPosUpdate() {
		sendPacket(PlayerPosPacket.get(this.x, this.y));
	}
	
	public void silSetPos(double x, double y) {
		this.x = x;
		this.y = y;
	}

	public int getBombStrength() {
		return bombStrength;
	}

	public int getMaxBombAmount() {
		return maxBombAmount;
	}
	
	public double getSizeFactor() {
		return sizeFactor;
	}

	public double getMaxSpeed() {
		return maxSpeed;
	}
	
	public boolean isConnectedTo(WebSocket conn) {
		return (this.conn.getRemoteSocketAddress().toString().equals(conn.getRemoteSocketAddress().toString()));
	}

	public String getImg() {
		return "player_img";
	}
	
	public boolean isTouching(int x, int y) {
		return (x < this.x + Player.sizeFactor &&
				x + 1 > this.x &&
				y < this.y + Player.sizeFactor &&
				y + 1 > this.y);
	}

	public void killByBomb(int playerSourceID) {
		if (!alive) {
			return;
		}
		alive = false;
		sendPacket(PlayerDeathPacket.get(playerSourceID, true));
		game.sendPacketToAllExceptID(OtherPlayerDeathPacket.get(playerSourceID, id), id);
	}
	
	public boolean isAlive() {
		return alive;
	}

	public boolean isConnectionComplete() {
		return connectionComplete;
	}
	
	public String getUsername() {
		return username;
	}
}
