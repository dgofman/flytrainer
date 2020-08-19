package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

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
	@NamedQuery(name = User.FIND_BY_EMAIL, query = "select(isActive) where username = :username and email = :email")
})
public class User extends BaseModel {
	
	public static final TypedKey<User> MODEL = TypedKey.<User>create("userModel");

	public static final String LOGIN = "User.login";
	public static final String FIND = "User.find";
	public static final String FIND_BY_UUID = "User.findByUuid";
	public static final String FIND_BY_EMAIL = "User.findByEmail";

	private static final String defaultPassword = AppConfig.get(Key.DEFAULT_PWD).asText();

	@JsonView(Never.class)
	public UUID uuid = UUID.randomUUID(); //internal security verification

	@Column(name = "firstname")
	@NotNull
	@Length(50)
	public String first;

	@Column(name = "middlename")
	@Length(50)
	@JsonView(Short.class)
	public String middle;

	@Column(name = "lastname")
	@NotNull
	@Length(50)
	public String last;

	@Length(50)
	@NotNull
	@Index(unique = true)
	public String username;

	@NotNull
	@Length(25)
	@Encrypted
	@JsonView(Admin.class)
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password = defaultPassword;

	@Length(100)
	@NotNull
	public String email;

	@Length(30)
	@Column(name = "cellphone")
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phone;

	@NotNull
	public byte isActive = 0;
	
	@NotNull
	@JsonView(Short.class)
	public byte isSchoolEmployee = 0;

	@NotNull
	public Constants.Access role = Constants.Access.USER;

	@NotNull
	@JsonView(Short.class)
	public byte resetPassword = 1;

	@JsonView(Short.class)
	public Date birthday;
	
	@Length(10)
	@Column(name = "driverLicense")
	@JsonView(Short.class)
	public String dl;
	
	@Length(2)
	@Column(name = "driverLicenseState")
	@JsonView(Short.class)
	public String dlState;
	
	@Column(name = "driverLicenseExpirationDate")
	@JsonView(Short.class)
	public Date dlExpDate;
	
	@Length(10)
	@JsonView(Admin.class)
	public String ssn;

	@Length(10)
	@JsonView(Short.class)
	public String ftn;
	
	@OneToOne
	public Account defaultAccount;
	
	@JsonView(Full.class)
	@OneToMany(targetEntity = Account.class, fetch = FetchType.LAZY, mappedBy = "user")
	public List<Account> accounts = new ArrayList<>();
	
	@JsonView(Full.class)
	@OneToMany(targetEntity = Certificate.class, fetch = FetchType.LAZY, mappedBy = "user")
	public List<Certificate> certificates = new ArrayList<>();
	
	@JsonView(Full.class)
	@OneToMany(targetEntity = MedicalCertificate.class, fetch = FetchType.LAZY, mappedBy = "user")
	public List<MedicalCertificate> medicalCertificates = new ArrayList<>();

	@JsonView(Full.class)
	@OneToMany(targetEntity = Address.class, fetch = FetchType.LAZY, mappedBy = "user")
	public List<Address> addresses = new ArrayList<>();
	
	@JsonView(Full.class)
	@OneToMany(targetEntity = Contact.class, fetch = FetchType.LAZY, mappedBy = "user")
	public List<Contact> contacts = new ArrayList<>();

	@JsonView(Full.class)
	@OneToMany(targetEntity = Employer.class, fetch = FetchType.LAZY, mappedBy = "user")
	public List<Employer> employers = new ArrayList<>();
	
	@JsonView(Full.class)
	@OneToMany(targetEntity = Note.class, fetch = FetchType.LAZY, mappedBy = "user")
	public List<Note> notes = new ArrayList<>();

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