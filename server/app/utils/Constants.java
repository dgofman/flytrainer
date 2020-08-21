package utils;

import io.ebean.annotation.Length;

public class Constants {
	
	public static final String AUTHORIZATION = "Authorization";
	public static final String TOKEN_FORMAT = "Bearer";
	public static final String CORRELATION_ID = "correlationId";

	public static enum Access {
		USER(0),
		ASSISTANT(1),
		MANAGER(2),
		ADMIN(3);
		
		private final int type;

		private Access(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum AccountType {
		STUDENT(0),
		PILOT(1),
		INSTRUCTOR(2),
		MECHANIC(3),
		INSPECTOR(4),
		STATION(5), //RepairStation
		OTHER(50);

		private final int type;

		private AccountType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum InsuranceType {
		RENTAL(0),
		LIABILITY(1),
		MEDICAL(2),
		LIFE(3),
		AUTO(4),
		OTHER(50);
		
		private final int type;

		private InsuranceType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum ActivityType {
		CREDIT(0),
		PAYMENT(1),
		DEBIT(2),
		MEMBERSHIP_DEBIT(3),
		INSURANCE_DEBIT(4),
		LANDING_DEBIT(5),
		OTHER(50);

		private final int type;

		private ActivityType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum AircraftCategory {
		Transport(0),
		Normal(1),
		Utility(2),
		Acrobatic(3),
		Limited(4),
		Restricted(5),
		Provisional(6);

		private final int type;

		private AircraftCategory(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum AircraftCategoryClass {
		SingleEngineLand("ASEL"),
		SingleEngineSea("ASES"),
		MultiengineLand("AMEL"),
		MultiengineSea("AMES"),
		Rotorcraft("RCFT"),
		Helicopter("HLCR"),
		Gyroplane("GYRO"),
		Balloon("BALL"),
		Airship("AIR"),
		Glider("GLDR"),
		LightSportAircraft("LSA"),
		PoweredLift("PWRL"),
		WeightShift("WSFT"),
		PoweredParachute("PPCT"),
		Rocket("RCKT"),
		Sim("SIM"),
		UAV("UAV"),
		Other("OTHER");

		@Length(5)
		private final String type;

		private AircraftCategoryClass(String type) {
			this.type = type;
		}
		
		public String getType() {
			return this.type;
		}
	}

	public static enum PaymentPeriod {
		ONTIME(0),
		DAILY(1),
		MONTHLY(2),
		QUARTERLY(3),
		SEMIANNUAL(4),
		ANNUAL(5);

		private final int type;

		private PaymentPeriod(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum SquawksStatus {
		OPEN(0),
		GROUNDED(1),
		VERIFIED(2),
		FIXED(3),
		CLOSED(4);

		private final int type;

		private SquawksStatus(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum EnginePosition {
		FRONT(0),
		BACK(1),
		LEFT(2),
		RIGHT(3),
		TOP(4);

		private final int type;

		private EnginePosition(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum EngineType {
		RECIPROCATING(0),
		ROTARY(1),
		TURBOPROP(2),
		TURBOFAN(3),
		TURBOJET(4),
		TURBOSHAFT(5),
		OTHER(50);

		private final int type;

		private EngineType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum EquipmentType {
		GNSS(0),
		ADSB(1),
		TRANSPONDER(2),
		PITOT_STATIC(3),
		RADIO(4),
		VOR(5),
		ILS(6),
		MLS(7),
		ADF(8),
		DME(9),
		LORANC(10),
		TACAN(11),
		AUTOPILOT(12),
		FLIGHTSTREAM(13),
		UHF(14),
		VHF(15),
		ELT(16),
		BATTERY(17),
		NAV(18),
		LIGHTS(19),
		ANTENNA(20),
		STEREO(21),
		OTHER(50);
		
		private final int type;

		private EquipmentType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum MaintenanceAction {
		INSPECT(0), //25, 50 hours or annual inspection
		AD(1),
		STICKER(2),
		REPAIR(3),
		ADJUST(4), //adjust or calibrate
		REPLACE(5),
		GROUNDED(6),
		OTHER(50);

		private final int type;

		private MaintenanceAction(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}

	public static enum RateType {
		PER_HOUR(0),
		PER_GALLON(1),
		PER_FLIGHT(2),
		PER_LANDING(3),
		DRY_RATE(4);

		private final int type;

		private RateType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum PaymentType {
		CASH(0),
		CREDIT(1),
		DEBIT(2),
		CHECK(3),
		MONEYORDER(4),
		ELECTRONIC(5),
		OTHER(50);

		private final int type;

		private PaymentType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum DocumentType {
		Driverslicense(0),
		PilotsCertificate(1),
		MedicalCertificate(2),
		Passport(3),
		Birthcertificate(4),
		TSAFormI20(5),
		TSAAwarenessTrainingCertificate(6),
		TSAPaymentReceived(7),
		RentersInsuranceAgreement(8),
		Visa(9),
		AlienResidentDocument(10),
		Finance(11),
		PrivatePilotPermission(12),
		InstrumentRatingPermission(13),
		MultiCommercialPermission(14),
		TrainingRequest(15),
		AircraftCheckoutRecord(16),
		PilotPicture(17),
		OnlineDocument(18),
		Other(50);

		private final int type;

		private DocumentType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum CourseType {
		Part61(0),
		Part141(1),
		Part147(2),
		FaaSafety(3),
		TSA(4),
		Other(50);

		private final int type;

		private CourseType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum MedicalCertificate {
		ThirdClass(0),
		SecondClass(1),
		FirstClass(2),
		BasicMed(3);

		private final int type;

		private MedicalCertificate(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum EndorsementType {
		Solo(0),
		CrossCountry(1),
		Solo90Days(2),
		Solo25NM(3),
		Solo50NM(4),
		SoloNight(5),
		SoloBravo(6),
		KnowledgeTest(7),
		PracticalTest(8),
		ProficiencyTest(9),
		Private(10),
		Sport(11),
		Recreational(12),
		Instrument(13),
		Commercial(14),
		Instructor(15),
		Complex(16),
		HighPerformance(17),
		HighAltitude(18),
		Pressurization(19),
		TailWheel(20),
		Rating(21),
		FlightReview(22),
		Helicopter(23),
		Glider(24),
		GliderAeroTow(25),
		GliderGroundTow(26),
		GliderSelfLaunch(27),
		TowGliderPilot(28),
		Other(50);

		private final int type;

		private EndorsementType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum FlightType {
		Flight(0),
		Ground(1),
		PrivateTraining(2),
		InstrumentTraining(3),
		CommercialTraining(4),
		InstructorTraining(5),
		MultiTraining(6),
		BusinessFlight(7),
		DiscoveryFlight(8),
		CheckRide(9),
		Charter(10),
		Event(11),
		AircraftMaintenance(12),
		Other(50);

		private final int type;

		private FlightType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum CancelationType {
		Weather(0),
		ScheduleError(1),
		StudentCancel(2),
		InstructorAvailability(3),
		AircraftMaintenanceIssue(4),
		AirportRestriction(5),
		TFR(6),
		Other(50);

		private final int type;

		private CancelationType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum CertificateType {
		StudentPilot("STD"),
		SportPilot("SPL"),
		RecreationalPilot("RPL"),
		RemotePilot("RP"),
		PrivatePilot("PPL"),
		InstrumentRating("IR"),
		CommercialPilot("CPL"),
		AirlineTransportPilot("ATP"),
		MultiCrewPilot("MCP"),
		FlightInstructor("CFI"),
		BasicGroundInstructor("BGI"),
		AdvancedGroundInstructor("AGI"),
		InstrumentGroundInstructor("IGI"),
		MultiEngineRating("ME"),
		PilotExaminer("DPE"),
		Other("OTHER");

		@Length(5)
		private final String key;

		private CertificateType(String key) {
			this.key = key;
		}

		@Override
		public String toString() {
			return key;
		}
	}

	public static enum AddressType {
		HOME(0),
		BUSINESS(1),
		BILLING(2),
		SHIPPING(3),
		CONTRACT(4),
		HANGAR(5),
		SHELTER(6),
		TIEDOWN(7),
		OTHER(50);

		private final int type;

		private AddressType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
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
}
