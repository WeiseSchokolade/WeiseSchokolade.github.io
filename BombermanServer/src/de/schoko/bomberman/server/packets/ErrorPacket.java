package de.schoko.bomberman.server.packets;

public class ErrorPacket extends Packet {
	public String error = "";
	
	public static ErrorPacket get(String error) {
		ErrorPacket pack = new ErrorPacket();
		pack.error = error;
		return pack;
	}
}
