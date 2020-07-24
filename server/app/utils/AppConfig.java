package utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Base64;

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
		JsonNode node = server_json.get(key.toString());
		if (node == null) {
			node = client_json.get(key.toString());
		}
		return node;
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
