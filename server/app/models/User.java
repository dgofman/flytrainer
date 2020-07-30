package models;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.Encrypted;
import io.ebean.annotation.History;
import io.ebean.annotation.Index;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
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

	public static final String LOGIN = "User.login";
	public static final String FIND = "User.find";
	public static final String FIND_BY_UUID = "User.findByUuid";
	public static final String FIND_BY_EMAIL = "User.findByEmail";

	private static final String defaultPassword = AppConfig.get(Key.DEFAULT_PWD).asText();

	@JsonView(Full.class)
	public UUID uuid = UUID.randomUUID();

	@Column(name = "first")
	@NotNull
	@Length(50)
	public String firstname;

	@Column(name = "last")
	@NotNull
	@Length(50)
	public String lastname;

	@Length(50)
	@NotNull
	@Index(unique = true)
	public String username;

	@NotNull
	@Length(25)
	@Encrypted
	@JsonView(Full.class)
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password = defaultPassword;

	@Length(100)
	@NotNull
	public String email;

	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phonenumber;

	@NotNull
	public byte isActive = 0;

	@NotNull
	public Constants.Access role = Constants.Access.USER;

	@NotNull
	public byte resetPassword = 1;

	@ManyToOne(targetEntity = Account.class, fetch = FetchType.LAZY)
	@JsonBackReference
	private Account account;

	public User() {
	}

	public User(JsonNode body) {
		this.username = body.get("username").asText();
		this.password = body.get("passwd").asText();
		this.firstname = body.get("first").asText();
		this.lastname = body.get("last").asText();
		this.email = body.get("email").asText();
		this.resetPassword = 0;
		if (!body.get("phone").isEmpty()) {
			this.phonenumber = body.get("phone").asText();
		}
	}
}