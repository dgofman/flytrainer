package utils;

public class Constants {
	
	public static final String AUTHORIZATION = "Authorization";
	public static final String TOKEN_FORMAT = "Bearer";
	public static final String CORRELATION_ID = "correlationId";

	public static enum Access {
		USER(0),
		INSTRUCTOR(1),
		MECHANIC(2),
		ASSISTANT(3),
		MANAGER(4),
		ADMIN(5);
		
		private final int level;

		private Access(int level) {
			this.level = level;
		}
		
		public int getLevel() {
			return this.level;
		}
	}
	
	public static enum Errors {
		USERNAME("A user with this username already exists."),
		ERROR("Oops, something went wrong. Please contact our system administrator."),
		LOCKED("Your account is locked for %s minutes due to many failed login attempts."),
		DISABLED("Your account is disabled. Please contact our system administrator."),
		INVALID_LOGIN("Invalid username or password"),
		INVALID_EMAIL("Invalid username or email"),
		ACCESS_DENIED("You do not have enough access privileges for this operation."),
		DELETE_USER("Cannot delete user. It is being used by another person."),
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
	
	public static enum Certificate {
		StudentPilot("Student Pilot", "STD"),
		SportPilot("Sport Pilot", "SPL"),
		RecreationalPilot("Recreational Pilot", "RPL"),
		RemotePilot("Remote Pilot", "RP"),
		PrivatePilot("Private Pilot", "PPL"),
		InstrumentRating("Instrument Rating", "IR"),
		CommercialPilot("Commercial Pilot", "CPL"),
		AirlineTransportPilot("Airline Transport Pilot", "ATP"),
		MultiCrewPilot("Multi-Crew Pilot", "MCP"),
		FlightInstructor("Certified Flight Instructor", "CFI"),
		BasicGroundInstructor("Basic Ground Instructor", "BGI"),
		AdvancedGroundInstructor("Advanced Ground Instructor", "AGI"),
		InstrumentGroundInstructor("Instrument Ground Instructor", "IGI"),
		MultiEngineRating("Multi-Engine Rating", "ME"),
		PilotExaminer("Designated Pilot Examiner", "DPE");

		private final String name;
		private final String key;

		private Certificate(String name, String key) {
			this.name = name;
			this.key = key;
		}

		public String getName() {
			return name;
		}

		@Override
		public String toString() {
			return key;
		}
	}
	
	public static enum Ratings {
		SingleEngineLand("Single-Engine Land", "ASEL"),
		SingleEngineSea("Single-Engine Sea", "ASES"),
		MultiengineLand("Multiengine Land", "AMEL"),
		MultiengineSea("Multiengine Sea", "AMES"),
		PoweredLift("Powered-Lift", "PWRL"),
		Helicopter("Helicopter", "HLCR"),
		Gyroplane("Gyroplane", "GYRO"),
		Balloon("Balloon", "BALL"),
		Airship("Airship", "AIR"),
		Glider("Glider", "GLDR"),
		LightSportAircraft("Light Sport Aircraft", "LSA");

		private final String name;
		private final String key;

		private Ratings(String name, String key) {
			this.name = name;
			this.key = key;
		}

		public String getName() {
			return name;
		}

		@Override
		public String toString() {
			return key;
		}
	}
	
	public static enum MedicalCertificate {
		ThirdClass("Third class"),
		SecondClass("Second class"),
		FirstClass("First class"),
		BasicMed("BasicMed");

		private final String key;

		private MedicalCertificate(String key) {
			this.key = key;
		}

		@Override
		public String toString() {
			return key;
		}
	}
	
	public static enum AddressType {
		HOME,
		BUSINESS,
		BILLING,
		SHIPPING,
		CONTRACT
	}
}
