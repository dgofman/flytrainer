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
		USERNAME("A user with this username already exists."),
		ERROR("Oops, something went wrong. Please contact our system administrator."),
		LOCKED("Your account is locked for %s minutes due to many failed login attempts."),
		DISABLED("Your account is disabled. Please contact our system administrator."),
		INVALID_LOGIN("Invalid username or password"),
		INVALID_EMAIL("Invalid username or email"),
		ACCESS_DENIED("You do not have enough access privileges for this operation."),
		UNAUTHORIZED("Needs authorization"),
		FORBIDDEN("Your account access token is not longer valid. Please contact our system administrator."),
		RESET("Required to reset password.");
		
		private final String error;

		private Errors(String error) {
			this.error = error;
		}
		
		@Override
		public String toString() {
			return error;
		}
	}
	
	public static enum Key {
		SERVER_PORT("server_port"), 
		CLIENT_PORT("client_port"), // client/src/environments/environment.json
		CLIENT_ID("clientId"), // client/src/environments/environment.json
		CREATE_ACCOUNT("includeCreateAccount"), // client/src/environments/environment.json
		FORGOT_PASSWORD("includeForgotPassword"), // client/src/environments/environment.json
		SECRET_KEY("secretKey"), EXPIRE_TOKEN("sessionExpireTimeInMinutes"), 
		EXPIRE_ACTIVATION("mailLinkExpireTimeInHours"), ISSUER_TOKEN("issuer"), 
		DEFAULT_PWD("defaultPassword"), ENCRYPT_KEY("encryptKey"), EMAIL("email"),
		LOGIN_ATTEMPTS("maxLoginAttempts"), LOCKED_TIME("maxLockedTime"),
		ACCOUNT_ACTIVATION("messages->accountActivation"),
		RESET_PASSWORD("messages->resetPassword");

		private final String key;

		private Key(String key) {
			this.key = key;
		}
		
		@Override
		public String toString() {
			return key;
		}
	}
}
