package de.schoko.bomberman.server.packets;

import de.schoko.bomberman.server.game.Bomb;

public class PlaceBomb extends Packet {
	public int x = 0;
	public int y = 0;
	public int playerSourceID = -1; // ID of player that placed the bomb
	public double timeLeft = 3;
	public int id = 0;
	
	public static PlaceBomb get(Bomb b) {
		PlaceBomb pack = new PlaceBomb();
		pack.x = b.getX();
		pack.y = b.getY();
		pack.playerSourceID = b.getPlayerSourceID();
		pack.timeLeft = b.getTimeLeft();
		pack.id = b.getId();
		return pack;
	}
	
}
