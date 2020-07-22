package utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import com.fasterxml.jackson.databind.JsonNode;

import play.libs.Json;
import utils.Constants.Key;

public class AppConfig {

	private static JsonNode server_json;
	private static JsonNode client_json;

	static {
		try {
			server_json = Json.parse(new FileInputStream(new File("../environment.json")));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			System.exit(1);
		}
		try {
			client_json = Json.parse(new FileInputStream(new File("../client/src/environments/environment.json")));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			System.exit(1);
		}
	}

	public static JsonNode get(Key key) {
		JsonNode node = server_json.get(key.name);
		if (node == null) {
			node = client_json.get(key.name);
		}
		return node;
	}
}
