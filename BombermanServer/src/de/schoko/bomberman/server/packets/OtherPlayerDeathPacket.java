package de.schoko.bomberman.server.packets;

public class OtherPlayerDeathPacket extends Packet {
	public int killerID = -1;
	public int playerID = -1;
	
	public static OtherPlayerDeathPacket get(int killerID, int playerID) {
		OtherPlayerDeathPacket pack = new OtherPlayerDeathPacket();
		pack.killerID = killerID;
		pack.playerID = playerID;
		return pack;
	}
}
