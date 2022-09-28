package de.schoko.bomberman.server.packets;

import java.util.ArrayList;

import de.schoko.bomberman.server.Player;
import de.schoko.bomberman.server.game.Game;

public class StartGame extends Packet {
	public ArrayList<PlayerData> players = new ArrayList<>();
	public String[] map = {};
	
	public static StartGame get(Game game, int playerID) {
		StartGame pack = new StartGame();
		pack.map = game.getStringMap();
		pack.players = new ArrayList<>();
		
		for (int i = 0; i < game.getPlayers().size(); i++) {
			Player player = game.getPlayers().get(i);
			if (player.getID() == playerID) {
				continue;
			}
			pack.players.add(PlayerData.get(player));
		}
		
		return pack;
	}
}
