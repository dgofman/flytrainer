package models;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.Encrypted;
import io.ebean.annotation.History;
import io.ebean.annotation.Index;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import models.Address.IsAddressable;
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
		@NamedQuery(name = User.FIND_BY_EMAIL, query = "select(isActive) where username = :username and email = :email"),
		@NamedQuery(name = User.PASSWORD, query = "select(password) where username = :username and id = :id") })
@JsonFilter("UserFilter")
public class User extends DocumentModel implements IsAddressable {

	public static final TypedKey<User> MODEL = TypedKey.<User>create("userModel");

	public static final String LOGIN = "User.login";
	public static final String FIND = "User.find";
	public static final String FIND_BY_UUID = "User.findByUuid";
	public static final String FIND_BY_EMAIL = "User.findByEmail";
	public static final String PASSWORD = "User.password";

	private static final String defaultPassword = AppConfig.get(Key.DEFAULT_PWD).asText();
	
	public User() {
		super();
	}

	public User(Long id) {
		super();
		this.id = id;
	}

	@JsonView(Never.class)
	@NotNull
	public UUID uuid = UUID.randomUUID(); //uuid - internal security verification

	@Column(name = "firstname")
	@NotNull
	@Length(50)
	public String first; //firstname

	@Column(name = "middlename")
	@Length(50)
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

	@Column(name = "phone")
	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phone; //phone

	@Column(name = "active")
	@NotNull
	public byte isActive = 0; //is_active

	@Column(name = "resetPassword")
	public byte resetPassword = 1; //reset_password

	@Column(name = "employee")
	public byte isSchoolEmployee = 0; //is_school_employee

	@Column(name = "citizen")
	public byte isCitizen = 0; //is_citizen

	@Column(name = "proficient")
	public byte englishProficient = 0; //english_proficient (AC 60-28)

	@Column(name = "member")
	public byte isMemeber = 1; //is_memeber

	@Column(name = "role")
	@NotNull
	@Enumerated
	public Constants.Access role = Constants.Access.USER; //role

	@Column(name = "birthday")
	public Date birthday; //birthday

	@Column(name = "driver_license")
	@Length(10)
	public String dl; //driver_license

	@Column(name = "driver_license_state")
	@Length(2)
	public String dlState; //driver_license_state

	@Column(name = "driver_license_exp_date")
	public Date dlExpDate; //driver_license_exp_date

	@Column(name = "ssn")
	@Length(10)
	public String ssn; //ssn

	@Column(name = "ftn")
	@Length(10)
	public String ftn; //ftn
	
	@ManyToOne
	private Address address; //address_id

	public Address getAddress() {
		return this.address;
	}
	public void setAddress(JsonNode body) throws IOException {
		this.address = body != null ? new ObjectMapper().readerFor(Address.class).readValue(body) : null;
	}

	@OneToOne
	public Account defaultAccount; //default_account_id

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