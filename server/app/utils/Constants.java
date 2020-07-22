package utils;

public class Constants {
	
	public static final String AUTHORIZATION = "Authorization";
	public static final String TOKEN_FORMAT = "Bearer";

	public static enum Access {
		USER,
		MECHANIC,
		MANAGER,
		ADMIN
	}
	
	public static enum Errors {
		LOCKED("Your account is locked for %s minutes due to many failed login attempts."),
		DISABLED("Your account has been permanently disabled."),
		INVALID_LOGIN("Invalid username or password");
		
		public final String error;

		private Errors(String error) {
			this.error = error;
		}
	}
	
	public static enum Key {
		SERVER_PORT("server_port"), 
		CLIENT_PORT("client_port"), // client/src/environments/environment.json
		CLIENT_ID("clientId"), // client/src/environments/environment.json
		SECRET_KEY("secretKey"), EXPIRE_TOKEN("expireToken"), ISSUER_TOKEN("issuer"), 
		DEFAULT_PWD("defaultPassword"), ENCRYPT_KEY("encryptKey"),
		LOGIN_ATTEMPTS("maxLoginAttempts"), LOCKED_TIME("maxLockedTime"),
		EMAIL("email");

		public final String name;

		private Key(String name) {
			this.name = name;
		}
	}
}
