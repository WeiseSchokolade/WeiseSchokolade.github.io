package de.schoko.bomberman.server.game;

import java.util.ArrayList;

import de.schoko.bomberman.server.Player;
import de.schoko.bomberman.server.packets.RemoveBomb;

public class Bomb {
	private int x = 0;
	private int y = 0;
	private int playerSourceID = -1;
	
	private int strength = 1;
	
	private double timeLeft = 2.0;
	
	private boolean isBlownUp = false;
	
	private int id = 0;
	private static int maxID = 0;
	
	public Bomb(int x, int y, int strength, int playerSourceID) {
		this.x = x;
		this.y = y;
		this.strength = strength + 1;
		this.playerSourceID = playerSourceID;
		this.id = maxID++;
	}
	
	public void blowUp(Game game) {
		if (this.isBlownUp) {
			return;
		}
		this.isBlownUp = true;
		
		ArrayList<Integer> removedTiles = new ArrayList<>();
		for (int i = 1; i < this.strength; i++) {
			if (!blowUp(game, x + i, y, removedTiles)) {
				break;
			}
		}
		for (int i = 1; i < this.strength; i++) {
			if (!blowUp(game, x - i, y, removedTiles)) {
				break;
			}
		}
		for (int i = 1; i < this.strength; i++) {
			if (!blowUp(game, x, y + i, removedTiles)) {
				break;
			}
		}
		for (int i = 1; i < this.strength; i++) {
			if (!blowUp(game, x, y - i, removedTiles)) {
				break;
			}
		}
		blowUp(game, x, y, removedTiles);
		
		game.sendMapUpdate();
		
		Player p = game.getPlayer(playerSourceID);
		p.setPlacedBombAmount(p.getPlacedBombAmount() - 1);
		
		game.sendPacketToAll(RemoveBomb.get(id, playerSourceID, removedTiles));
	}
	
	/**
	 * Blows up game's tile at x and y. 
	 * The x and y coordinates are added to the removedTiles
	 * in order to play an animation.
	 * 
	 * @param game Current game
	 * @param x X Position of tile being blown up
	 * @param y Y Position of tile being blown up
	 * @param removedTiles The already removed tiles
	 * @return Whether the explosion should continue past this point
	 */
	private boolean blowUp(Game game, int x, int y, ArrayList<Integer> removedTiles) {
		Field field = game.get(x, y);
		
		Bomb b = game.getBombAt(x, y);
		if (b != null) {
			if (b.getId() != this.getId()) {
				b.blowUp(game);
			}
		}
		
		Field resultField = Field.E;
		
		if (field.is(FieldProperty.DROPPING)) {
			int rn = (int) (Math.random() * 100 + 1);
			if (rn > 90) {
				resultField = Field.P;
			} else if (rn > 80) {
				resultField = Field.B;
			} else if (rn > 70) {
				resultField = Field.R;
			}
		}
		
		if (!field.is(FieldProperty.INDESTRUCTIBLE)) {
			game.place(resultField, x, y);
		}
		
		if (!field.is(FieldProperty.HIDING_EXPLOSION_PARTICLES)) {
			removedTiles.add(x);
			removedTiles.add(y);
		}
		
		if (!field.is(FieldProperty.SOLID)) {
			for (int i = 0; i < game.getPlayers().size(); i++) {
				Player player = game.getPlayers().get(i);
				if (player.isTouching(x, y)) {
					player.killByBomb(playerSourceID);
				}
			}
		}
		
		return !field.is(FieldProperty.BLOCKING);
	}
	
	public void fill(Game game, Field field, int x, int y, int width, int height) {
		for (int i = x; i < x + width; i++) {
			for (int j = y; j < y + height; j++) {
				try {
					Field f = game.get(i, j);
					if (!f.equals(Field.D) && !f.equals(Field.S)) {
						game.place(Field.E, i, j);
					}
				} catch (ArrayIndexOutOfBoundsException e) {};
			}
		}
	}
	
	public int getX() {
		return this.x;
	}
	
	public int getY() {
		return this.y;
	}
	
	public int getStrength() {
		return strength;
	}
	
	public void updateTime(float deltaTime) {
		this.timeLeft -= deltaTime;
	}
	
	public boolean isTimeLeft() {
		return timeLeft > 0;
	}
	
	public double getTimeLeft() {
		return timeLeft;
	}

	public int getPlayerSourceID() {
		return this.playerSourceID;
	}
	
	public boolean isBlownUp() {
		return isBlownUp;
	}
	
	public int getId() {
		return id;
	}
}
