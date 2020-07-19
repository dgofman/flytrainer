package utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import com.fasterxml.jackson.databind.JsonNode;

import play.libs.Json;

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

	public static enum Key {
		SERVER_PORT("server_port"), 
		CLIENT_PORT("client_port"), // client/src/environments/environment.json
		CLIENT_ID("clientId"), // client/src/environments/environment.json
		SECRET_KEY("secretKey"), EXPIRE_TOKEN("expireToken"), ISSUER_TOKEN("issuer"), 
		DEFAULT_PWD("defaultPassword"), ENCRYPT_KEY("encryptKey");

		public final String name;

		private Key(String name) {
			this.name = name;
		}
	}
}
