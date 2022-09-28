package de.schoko.bomberman.server.packets;

import de.schoko.bomberman.server.Player;

public class PlayerData {
	public double x = -1;
	public double y = -1;
	public int id = -1;
	public String img = "player_img";
	public String username = "null";
	
	public static PlayerData get(Player player) {
		PlayerData pack = new PlayerData();
		pack.x = player.getX();
		pack.y = player.getY();
		pack.id = player.getID();
		pack.img = player.getImg();
		pack.username = player.getUsername();
		return pack;
	}
}
