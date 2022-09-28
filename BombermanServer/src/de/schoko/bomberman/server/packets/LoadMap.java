package de.schoko.bomberman.server.packets;

public class LoadMap extends Packet {
	public String[] map = {};
	
	public static LoadMap get(String[] map) {
		LoadMap packet = new LoadMap();
		packet.map = map;
		return packet;
	}
}
