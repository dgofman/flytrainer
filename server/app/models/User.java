package models;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.Encrypted;
import io.ebean.annotation.History;
import io.ebean.annotation.Index;
import io.ebean.annotation.JsonIgnore;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.AppConfig;
import utils.Constants;
import utils.Constants.Key;

@Entity
@History
@NamedQueries(value = { 
	@NamedQuery(name = User.LOGIN, query = "select(uuid, isActive, resetPassword) where username = :username and password = :password"),
	@NamedQuery(name = User.FIND, query = "select(isActive) where username = :username and uuid = :uuid and version = :version")
})
public class User extends BaseModel {
	
	public static final String LOGIN = "User.login";
	public static final String FIND = "User.find";

	private static final String defaultPassword = AppConfig.get(Key.DEFAULT_PWD).asText();

	public UUID uuid = UUID.randomUUID();

	@Column(name = "first")
	@NotNull
	@Length(100)
	public String firstname;

	@Column(name = "last")
	@NotNull
	@Length(100)
	public String lastname;

	@Length(50)
	@NotNull
	@Index(unique = true)
	public String username;

	@NotNull
	@Length(25)
	@Encrypted
	@JsonIgnore
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password = defaultPassword;

	@Length(50)
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
		this.username = body.get("userid").asText();
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