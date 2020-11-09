package utils;

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
		Other(0),
		Student(1),
		Renter(2),
		Instructor(3),
		Mechanic(4),
		Inspector(5),
		Employee(6),
		Corporate(8),
		Station(9); //repairstation

		private final int type;

		private AccountType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum TierType {
		Other(0),
		Hourly(1),
		Flight(2),
		Fuel(3),
		Shopping(4),
		Training(5);

		private final int type;

		private TierType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum InsuranceType {
		Other(0),
		Rental(1),
		Liability(2),
		Medical(3),
		Life(4),
		Auto(5);
		
		private final int type;

		private InsuranceType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum ActivityType {
		Other(0),
		Credit(1),
		Payment(2),
		Debit(3),
		MembershipDebit(4),
		InsuranceDebit(5),
		LandingDebit(6);

		private final int type;

		private ActivityType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum AircraftCategoryClass {
		Other(0),
		SingleEngineLand(1),
		SingleEngineSea(2),
		MultiengineLand(3),
		MultiengineSea(4),
		Rotorcraft(5),
		Helicopter(6),
		Gyroplane(7),
		Balloon(8),
		Airship(9),
		Glider(10),
		PoweredLift(11),
		WeightShift(12),
		PoweredParachute(13),
		Rocket(14),
		Sim(15),
		UAV(16);

		private final int type;

		private AircraftCategoryClass(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}

	public static enum PaymentPeriod {
		OnTime(0),
		Daily(1),
		Monthly(2),
		Quarterly(3),
		SemiAnnual(4),
		Annual(5);

		private final int type;

		private PaymentPeriod(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum SquawksStatus {
		Other(0),
		Open(1),
		Grounded(2),
		Verified(3),
		Fixed(4),
		Closed(5);

		private final int type;

		private SquawksStatus(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum PositionType {
		Front(0),
		Back(1),
		Left(2),
		Right(3),
		Top(4);

		private final int type;

		private PositionType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum EngineType {
		Other(0),
		Reciprocating(1),
		Rotary(2),
		Turboprop(3),
		Turbofan(4),
		Turbojet(5),
		Turboshaft(6);
		
		private final int type;

		private EngineType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum EquipmentType {
		Other(0),
		Gnss(1),
		Adsb(2),
		Transponder(3),
		PitotStatic(4),
		Radio(5),
		Vor(6),
		Ils(7),
		Mls(8),
		Adf(9),
		Dme(10),
		Loranc(11),
		Tacan(12),
		Autopilot(13),
		FlightStream(14),
		Uhf(15),
		Vhf(16),
		Elt(17),
		Battery(18),
		Nav(19),
		Lights(20),
		Antenna(21),
		Stereo(22);

		private final int type;

		private EquipmentType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum MaintenanceAction {
		Other(0),
		Inspection(1), //25, 50 Hours or Annual Inspection
		Ad(2),
		Sticker(3),
		Repair(4),
		Adjust(5), //Adjust or Calibrate
		Replace(6),
		Grounded(7);

		private final int type;

		private MaintenanceAction(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}

	public static enum RateType {
		PerHour(0),
		PerGallon(1),
		PerFlight(2),
		PerLanding(3),
		DryRate(4);

		private final int type;

		private RateType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum PaymentType {
		Other(0),
		Cash(0),
		Credit(1),
		Debit(2),
		Check(3),
		Moneyorder(4),
		Electronic(5);
		
		private final int type;

		private PaymentType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum DocumentType {
		Other(0),
		Passport(1),
		DriverLicense(2),
		AlienResident(3),
		Endorsement(4),
		Visa(5),
		PilotCertificate(6),
		MedicalCertificate(7),
		BirthCertificate(8),
		TSATrainingCertificate(9),
		TSAFormI20(10),
		TSAPaymentReceived(11),
		RentersInsuranceAgreement(12),
		Finance(13),
		PrivatePilotPermission(14),
		InstrumentRatingPermission(15),
		MultiCommercialPermission(16),
		TrainingRequest(17),
		AircraftCheckoutRecord(18),
		PilotPicture(19),
		AddressProof(20),
		OnlineDocument(21);

		private final int type;

		private DocumentType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum CourseType {
		Other(0),
		Part61(1),
		Part141(2),
		Part147(3),
		FaaSafety(4),
		TSA(5);

		private final int type;

		private CourseType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum MedicalCertificate {
		Other(0),
		ThirdClass(1),
		SecondClass(2),
		FirstClass(3),
		BasicMed(4);

		private final int type;

		private MedicalCertificate(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum EndorsementType {
		Other(0),
		Citizenship(1),
		PreSoloKnowledge(2),
		PreSoloFlight(3),
		PreSoloNight(4),
		FirstSoloFlight(5), 
		SoloFlightEeach(6),
		Solo25NM(7),
		CrossCountryFlight(8),
		CrossCountryPlan(9),
		RepeatedSolo50NM(10),
		SoloClassB(11),
		SoloAirportClassB(12),
		PracticalTest(13),
		KnowledgeTest(14),
		PrivateKnowledgeTest(15),
		PrivatePracticalTest(16),
		CommercialKnowledgeTest(17),
		CommercialPracticalTest(18),
		InstrumentKnowledgeTest(19),
		InstrumentPracticalTest(20),
		PreInstrumentPracticalTest(21),
		WINGS(22),
		FlightReview(23),
		InstrumentProficiency(24),
		Complex(25),
		HighPerformance(26),
		Pressurized(27),
		TailWheel(28),
		Sport(50),
		Recreational(51),
		Instructor(52),
		ATP(53),
		Helicopter(54),
		Glider(55),
		GliderAeroTow(56),
		GliderGroundTow(57),
		GliderSelfLaunch(58),
		TowPilotGlider(59),
		SpinTraining(60),
		HomeStudy(61),
		NVG(62),
		EFVS(63);

		private final int type;

		private EndorsementType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum FlightType {
		Other(0),
		Flight(1),
		Ground(2),
		PrivateTraining(3),
		InstrumentTraining(4),
		CommercialTraining(5),
		InstructorTraining(6),
		MultiTraining(7),
		BusinessFlight(8),
		DiscoveryFlight(9),
		CheckRide(10),
		Charter(11),
		Event(12),
		AircraftMaintenance(13);

		private final int type;

		private FlightType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum CancelationType {
		Other(0),
		Weather(1),
		ScheduleError(2),
		StudentCancel(3),
		InstructorAvailability(4),
		AircraftMaintenanceIssue(5),
		AirportRestriction(6),
		TFR(7);

		private final int type;

		private CancelationType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum CurrencyType {
		Other(0),
		Day(1),
		Night(2),
		Instrument(3),
		Medical(4),
		CFI(5),
		FlightReview(6),
		Part141(7),
		Temporary(8),
		Goggle(9),
		TSATraining(10);
		
		private final int type;

		private CurrencyType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}

	public static enum AddressType {
		Other(0),
		Home(1),
		Business(2),
		Billing(3),
		Shipping(4),
		Contact(5),
		Hangar(6),
		Shelter(7),
		Tiedown(8),
		Mailing(9),
		Physycal(10),
		Electronic(11);

		private final int type;

		private AddressType(int type) {
			this.type = type;
		}
		
		public int getType() {
			return this.type;
		}
	}
	
	public static enum AircraftCategory {
		Other(0),
		Transport(1),
		Normal(2),
		Utility(3),
		Acrobatic(4),
		Limited(5),
		Restricted(6),
		Provisional(7);

		private final long type;

		private AircraftCategory(int type) {
			this.type = (long) Math.pow(2, type);
		}

		public static long  getType(AircraftCategory ...categories) {
			long type = 0;
			for (AircraftCategory category : categories) {
				type |= category.type;
			}
			return type;
		}
	}
	
	public static enum AircraftSpecification {
		Other(0),
		Complex(1),
		HighPerformance(2),
		Experimental(3),
		Acrobatic(4),
		LightSport(5),
		TailWheel(6),
		Pressurized(7),
		Oxygent(8),
		CertifiedIFR(9),
		CertifiedNight(10),
		Certified141(11),
		ForHire(12),
		GliderTow(13),
		Part409(14),
		Part135(15),
		Maintenance(16);

		private final int type;

		private AircraftSpecification(int type) {
			this.type = type;
		}

		public int getType() {
			return this.type;
		}
	}

	public static enum CertificateType {
		Other(0, true),
		StudentPilot(1),
		SportPilot(2),
		RecreationalPilot(3),
		RemotePilot(4),
		PrivatePilot(5),
		CommercialPilot(6),
		AirlineTransportPilot(7),
		MultiCrewPilot(8),
		InstrumentRating(9),
		MultiEngineRating(10),
		FlightInstructor(11, true),
		GoldSealInstructor(12, true),
		BasicGroundInstructor(13, true),
		AdvancedGroundInstructor(14, true),
		InstrumentGroundInstructor(15, true),
		PilotExaminer(16);

		private final int type;
		private final boolean isCFI;

		private CertificateType(int type) {
			this(type, false);
		}

		private CertificateType(int type, boolean isCFI) {
			this.type = type;
			this.isCFI = isCFI;
		}
		
		public int getType() {
			return this.type;
		}
		
		public boolean isCFI() {
			return this.isCFI;
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
		DOCUMENTS_SAVE_PATH("pathSavedDocuments"), CLEANUP_TEMP_TIME("cleanupTempDocuments"),
		ACCOUNT_ACTIVATION("messages->accountActivation"), INITIAL_ACCOUNT_ID("initialAccountId"),
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
