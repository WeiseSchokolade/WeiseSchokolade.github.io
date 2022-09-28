package de.schoko.bomberman.server.packets;

public class GameOver extends Packet {
	public int winnerID = -1;
	
	public static GameOver get(int winnerID) {
		GameOver pack = new GameOver();
		
		return pack;
	}
}
