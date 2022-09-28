package de.schoko.bomberman.server.packets;

import de.schoko.bomberman.server.Player;

public class JoinPlayer extends Packet {
	public double x = -1;
	public double y = -1;
	public int id = -1;
	public String img = "player_img";
	public String username = "null";
	
	public static JoinPlayer get(Player p) {
		JoinPlayer pack = new JoinPlayer();
		pack.x = p.getX();
		pack.y = p.getY();
		pack.id = p.getID();
		pack.img = p.getImg();
		pack.username = p.getUsername();
		return pack;
	}
}
