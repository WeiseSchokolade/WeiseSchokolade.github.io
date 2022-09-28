package de.schoko.bomberman.server.game;

public enum Field {
	/**
	 * inDestructible
	 */
	D(FieldProperty.SOLID, FieldProperty.BLOCKING, FieldProperty.INDESTRUCTIBLE, FieldProperty.HIDING_EXPLOSION_PARTICLES),
	/**
	 * Empty
	 */
	E(),
	/**
	 * Tile
	 */
	T(FieldProperty.SOLID, FieldProperty.BLOCKING, FieldProperty.DROPPING),
	/**
	 * Spike
	 */
	S(FieldProperty.BLOCKING, FieldProperty.INDESTRUCTIBLE, FieldProperty.KILLING, FieldProperty.HIDING_EXPLOSION_PARTICLES),
	/**
	 * more Bombs item
	 */
	B(FieldProperty.INDESTRUCTIBLE, FieldProperty.ITEM),
	/**
	 * higher bomb Range item
	 */
	R(FieldProperty.INDESTRUCTIBLE, FieldProperty.ITEM),
	/**
	 * sPeed item
	 */
	P(FieldProperty.INDESTRUCTIBLE, FieldProperty.ITEM);
	
	private FieldProperty[] fieldProperties;
	
	private Field(FieldProperty... fieldProperties) {
		this.fieldProperties = fieldProperties;
	}
	
	public boolean is(FieldProperty fieldProperty) {
		for (int i = 0; i < fieldProperties.length; i++) {
			if (fieldProperties[i] == fieldProperty) {
				return true;
			}
		}
		return false;
	}
}
