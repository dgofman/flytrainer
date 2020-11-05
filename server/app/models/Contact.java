package models;

import java.io.IOException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import models.Address.IsAddressable;

@Entity
@History
@Table(name = "contact")
public class Contact extends BaseModel implements IsAddressable {

	@Length(30)
	@JsonView(Short.class)
	public String description; //description

	@Column(name = "firstname")
	@NotNull
	@Length(50)
	@JsonView(Default.class)
	public String first; //firstname

	@Column(name = "middlename")
	@Length(50)
	@JsonView(Short.class)
	public String middle; //middlename

	@Column(name = "lastname")
	@NotNull
	@Length(50)
	@JsonView(Default.class)
	public String last; //lastname

	@NotNull
	@Length(30)
	@JsonView(Default.class)
	public String relationship; //relationship

	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	@JsonView(Short.class)
	public String phone; //phone

	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::contacts

	@ManyToOne
	private Address address; //address_id

	public Address getAddress() {
		return this.address;
	}
	public void setAddress(JsonNode body) throws IOException {
		this.address = body != null ? new ObjectMapper().readerFor(Address.class).readValue(body) : null;
	}
}
