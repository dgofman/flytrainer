package utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import com.fasterxml.jackson.databind.JsonNode;

import play.libs.Json;

public class AppConfig {
	
	private static JsonNode json;

	static {
		try {
			json = Json.parse(new FileInputStream(new File("../environment.json")));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			System.exit(1);
		}
	}

	public static JsonNode get(String name) {
		return json.get(name);
	}
}
