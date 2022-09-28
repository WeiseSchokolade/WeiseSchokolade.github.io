package de.schoko.bomberman.server.packets;

import java.util.ArrayList;

public class RemoveBomb extends Packet {
	public int id = -1;
	public int playerSourceID = -1;
	public int[] removedTiles;
	
	public static RemoveBomb get(int id, int playerSourceID, ArrayList<Integer> removedTilesByBomb) {
		RemoveBomb pack = new RemoveBomb();
		pack.id = id;
		pack.playerSourceID = playerSourceID;
		pack.removedTiles = new int[removedTilesByBomb.size()];
		for (int i = 0; i < pack.removedTiles.length; i++) {
			pack.removedTiles[i] = removedTilesByBomb.get(i);
		}
		return pack;
	}
}
