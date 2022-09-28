package de.schoko.bomberman.server.packets;

import de.schoko.bomberman.server.Player;

public class PlayerUpdate extends Packet {
	public double x = 0;
	public double y = 0;
	public double vx = 0;
	public double vy = 0;
	
	public static PlayerUpdate get(Player p) {
		PlayerUpdate playerUpdatePacket = new PlayerUpdate();
		
		playerUpdatePacket.x = p.getX();
		playerUpdatePacket.y = p.getY();
		playerUpdatePacket.vx = p.getVX();
		playerUpdatePacket.vy = p.getVY();
		
		return playerUpdatePacket;
	}
}
