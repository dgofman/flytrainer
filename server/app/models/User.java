package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.Encrypted;
import io.ebean.annotation.History;
import io.ebean.annotation.Index;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import play.libs.typedmap.TypedKey;
import utils.AppConfig;
import utils.Constants;
import utils.Constants.Key;

@Entity
@History
@NamedQueries(value = {
		@NamedQuery(name = User.LOGIN, query = "select(uuid, isActive, resetPassword) where username = :username and password = :password"),
		@NamedQuery(name = User.FIND, query = "select(isActive) where username = :username and uuid = :uuid and version = :version and modifiedDate =:modifiedDate"),
		@NamedQuery(name = User.FIND_BY_UUID, query = "select(role) where username = :username and uuid = :uuid"),
		@NamedQuery(name = User.FIND_BY_EMAIL, query = "select(isActive) where username = :username and email = :email") })
@JsonFilter("UserFilter")
public class User extends BaseModel {

	public static final TypedKey<User> MODEL = TypedKey.<User>create("userModel");

	public static final String LOGIN = "User.login";
	public static final String FIND = "User.find";
	public static final String FIND_BY_UUID = "User.findByUuid";
	public static final String FIND_BY_EMAIL = "User.findByEmail";

	private static final String defaultPassword = AppConfig.get(Key.DEFAULT_PWD).asText();

	@JsonView(Never.class)
	public UUID uuid = UUID.randomUUID(); //uuid - internal security verification

	@Column(name = "firstname")
	@NotNull
	@Length(50)
	public String first; //firstname

	@Column(name = "middlename")
	@Length(50)
	@JsonView(Short.class)
	public String middle; //middlename

	@Column(name = "lastname")
	@NotNull
	@Length(50)
	public String last; //lastname

	@Column(name = "username")
	@Length(50)
	@NotNull
	@Index(unique = true)
	public String username; //username

	@NotNull
	@Length(25)
	@Encrypted
	@JsonView(Admin.class)
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password = defaultPassword; //password

	@Column(name = "email")
	@Length(100)
	@NotNull
	public String email; //email

	@Column(name = "cellphone")
	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phone; //cellphone

	@Column(name = "active")
	@NotNull
	public byte isActive = 0; //is_active

	@Column(name = "resetPassword")
	@NotNull
	@JsonView(Short.class)
	public byte resetPassword = 1; //reset_password

	@Column(name = "employee")
	@NotNull
	@JsonView(Short.class)
	public byte isSchoolEmployee = 0; //is_school_employee

	@Column(name = "citizen")
	@NotNull
	@JsonView(Short.class)
	public byte isCitizen = 0; //is_citizen

	@Column(name = "proficient")
	@NotNull
	@JsonView(Short.class)
	public byte englishProficient = 0; //english_proficient (AC 60-28)

	@Column(name = "member")
	@NotNull
	@JsonView(Short.class)
	public byte isMemeber = 1; //is_memeber

	@Column(name = "role")
	@NotNull
	@Enumerated
	public Constants.Access role = Constants.Access.USER; //role

	@Column(name = "birthday")
	@JsonView(Short.class)
	public Date birthday; //birthday

	@Column(name = "driver_license")
	@Length(10)
	@JsonView(Short.class)
	public String dl; //driver_license

	@Column(name = "driver_license_state")
	@Length(2)
	@JsonView(Short.class)
	public String dlState; //driver_license_state

	@Column(name = "driver_license_exp_date")
	@JsonView(Short.class)
	public Date dlExpDate; //driver_license_exp_date

	@Column(name = "ssn")
	@Length(10)
	@JsonView(Admin.class)
	public String ssn; //ssn

	@Column(name = "ftn")
	@Length(10)
	@JsonView(Short.class)
	public String ftn; //ftn

	@OneToOne
	public Account defaultAccount; //default_account_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Account> accounts = new ArrayList<>(); //Account::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Certificate> certificates = new ArrayList<>(); //Certificate::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Rating> ratings = new ArrayList<>(); //Rating::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<MedicalCertificate> medicalCertificates = new ArrayList<>(); //MedicalCertificate::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Address> addresses = new ArrayList<>(); //Address::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Course> courses = new ArrayList<>(); //Course::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Endorsement> endorsements = new ArrayList<>(); //Endorsement::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Contact> contacts = new ArrayList<>(); //Contact::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Employer> employers = new ArrayList<>(); //Employer::user_id

	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Document> documents = new ArrayList<>(); //Document::user_id
	
	@JsonView(Full.class)
	@OneToMany(mappedBy = "user")
	public List<Filter> filters = new ArrayList<>(); //Filter::user_id

	public User() {
	}

	public User(JsonNode body) {
		this.username = body.get("username").asText();
		this.password = body.get("passwd").asText();
		this.first = body.get("first").asText();
		this.middle = body.get("middle").asText();
		this.last = body.get("last").asText();
		this.email = body.get("email").asText();
		this.resetPassword = 0;
		if (!body.get("phone").isEmpty()) {
			this.phone = body.get("phone").asText();
		}
	}
}