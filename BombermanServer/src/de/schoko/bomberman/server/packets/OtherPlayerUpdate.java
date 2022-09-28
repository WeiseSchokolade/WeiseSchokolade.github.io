package de.schoko.bomberman.server.packets;

import de.schoko.bomberman.server.Player;

public class OtherPlayerUpdate extends Packet {
	public double x = 0;
	public double y = 0;
	public double vx = 0;
	public double vy = 0;
	public int id = -1;
	
	public static OtherPlayerUpdate get(Player p) {
		OtherPlayerUpdate playerUpdatePacket = new OtherPlayerUpdate();
		
		playerUpdatePacket.x = p.getX();
		playerUpdatePacket.y = p.getY();
		playerUpdatePacket.vx = p.getVX();
		playerUpdatePacket.vy = p.getVY();
		playerUpdatePacket.id = p.getID();
		
		return playerUpdatePacket;
	}
}
