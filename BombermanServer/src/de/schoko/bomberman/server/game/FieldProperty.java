package de.schoko.bomberman.server.game;

public enum FieldProperty {
	/**
	 * This property determines whether the player
	 * stops when touching a field with this property.
	 * 
	 * @see FieldProperty.EMPTY
	 */
	SOLID,
	/**
	 * Determines whether explosions should go past
	 * this field.
	 */
	BLOCKING,
	/**
	 * Determines whether bombs can destroy
	 * this field.
	 */
	INDESTRUCTIBLE,
	/**
	 * Determines whether items should be dropped
	 * when a field with this property is blown up.
	 */
	DROPPING,
	/**
	 * Determines whether a player dies when touching
	 * this tile.
	 */
	KILLING,
	/**
	 * Determines whether explosion particles
	 * shouldn't be shown when a field with this property
	 * is blown up.
	 */
	HIDING_EXPLOSION_PARTICLES,
	/**
	 * Marks items.
	 */
	ITEM;
}
