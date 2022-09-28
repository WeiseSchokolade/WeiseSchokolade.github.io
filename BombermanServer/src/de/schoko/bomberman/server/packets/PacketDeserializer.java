package de.schoko.bomberman.server.packets;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class PacketDeserializer implements JsonSerializer<Packet>, JsonDeserializer<Packet> {
	@Override
	public JsonElement serialize(Packet src, Type typeOfSrc, JsonSerializationContext context) {
		JsonObject result = new JsonObject();
		result.add("type", new JsonPrimitive(src.getClass().getSimpleName()));
		result.add("properties", context.serialize(src, src.getClass()));
		return result;
	}

	@Override
	public Packet deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
			throws JsonParseException {
		JsonObject jsonObject = json.getAsJsonObject();
		String type;
		try {
			type = jsonObject.get("type").getAsString();
		} catch (NullPointerException e) {
			return null;
		}
		JsonElement element = jsonObject.get("properties");
		try {
			Packet deserialized = context.deserialize(element, Class.forName("de.schoko.bomberman.server.packets." + type));
			if (deserialized == null) {
				try {
					return ((Packet) Class.forName("de.schoko.bomberman.server.packets." + type).cast(Class.forName("de.schoko.bomberman.server.packets." + type).getDeclaredConstructor().newInstance()));
				} catch (InstantiationException | IllegalAccessException | IllegalArgumentException
						| InvocationTargetException | NoSuchMethodException | SecurityException e) {
					e.printStackTrace();
				}
			}
			deserialized.type = type;
			return deserialized;
		} catch (ClassNotFoundException e) {
			throw new JsonParseException("Unknown element type: " + type, e);
		}
	}
}