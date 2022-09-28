package de.schoko.bomberman.server.packets;

public class PlayerPosPacket extends Packet {
	public double x = 0;
	public double y = 0;
	
	public static PlayerPosPacket get(double x, double y) {
		PlayerPosPacket p = new PlayerPosPacket();
		p.x = x;
		p.y = y;
		return p;
	}
}
