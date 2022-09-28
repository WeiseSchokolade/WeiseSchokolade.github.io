package de.schoko.bomberman.server.packets;

public class OpenPacket extends Packet {
	public String[] map = {};
	public int id = 0;
	public int x = 0;
	public int y = 0;
	
	public static OpenPacket get(String[] map, int id, int x, int y) {
		OpenPacket packet = new OpenPacket();
		packet.map = map;
		packet.id = id;
		packet.x = x;
		packet.y = y;
		
		return packet;
	}
}
