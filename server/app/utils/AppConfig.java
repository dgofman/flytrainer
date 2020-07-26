package utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Iterator;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

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
		return get(key.toString(), null);
	}

	public static JsonNode get(String key, JsonNode node) {
		String[] path = key.split("->");
		if (node != null) {
			node = node.get(path[0]);
		} else {
			node = server_json.get(path[0]);
			if (node == null) {
				node = client_json.get(path[0]);
			}
		}
		if (path.length > 1) {
			return get(String.join("->", Arrays.copyOfRange(path, 1, path.length)), node);
		}
		return node;
	}
	
	public static String join(Key key, String delimiter) {
		StringBuilder sb = new StringBuilder();
		JsonNode node = get(key);
		Iterator<JsonNode> iter = node.elements();
		while(iter.hasNext()) {
			sb.append(iter.next().asText());
			if (iter.hasNext()) {
				sb.append(delimiter);
			}
		}
		return sb.toString();
	}

	public static String decrypt(String encyprt) throws Exception {
		String encryptKey = AppConfig.get(Key.ENCRYPT_KEY).asText();
		SecretKeySpec keySpec = new SecretKeySpec(Arrays.copyOf(encryptKey.getBytes("utf-8"), 16), "AES");
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		cipher.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(new byte[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}));
		byte[] decVal = cipher.doFinal(Base64.getDecoder().decode(encyprt.getBytes("utf-8")));
		return  new String(decVal, "utf-8");
	}
}
