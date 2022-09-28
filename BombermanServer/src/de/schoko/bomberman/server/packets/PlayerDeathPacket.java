package de.schoko.bomberman.server.packets;

public class PlayerDeathPacket extends Packet {
	public int killerID = -1;
	public boolean byBomb = false;
	
	public static PlayerDeathPacket get(int killerID, boolean byBomb) {
		PlayerDeathPacket pack = new PlayerDeathPacket();
		pack.killerID = killerID;
		pack.byBomb = byBomb;
		return pack;
	}
}
