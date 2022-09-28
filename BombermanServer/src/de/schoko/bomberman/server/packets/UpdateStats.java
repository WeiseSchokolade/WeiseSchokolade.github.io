package de.schoko.bomberman.server.packets;

import de.schoko.bomberman.server.Player;

public class UpdateStats extends Packet {
	public int maxBombAmount = -1;
	public int bombStrength = -1;
	public double maxSpeed = -1;
	
	public static UpdateStats get(Player p) {
		UpdateStats updateStats = new UpdateStats();
		updateStats.maxBombAmount = p.getMaxBombAmount();
		updateStats.bombStrength = p.getBombStrength();
		updateStats.maxSpeed = p.getMaxSpeed();
		
		return updateStats;
	}
}
