package de.schoko.bomberman.server.packets;

public class Packet {
	public String type = "Unknown";
	
	public Packet() {
		this.type = this.getClass().getSimpleName();
	}
}
