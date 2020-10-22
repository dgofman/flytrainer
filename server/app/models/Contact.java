package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "contact")
public class Contact extends BaseModel {

	@Length(30)
	@JsonView(Full.class)
	public String description; //description

	@Column(name = "firstname")
	@NotNull
	@Length(50)
	@JsonView(Default.class)
	public String first; //firstname

	@Column(name = "middlename")
	@Length(50)
	@JsonView(Full.class)
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
	@JsonView(Full.class)
	public String phone; //phone

	@ManyToOne
	public Address address; //address_id

	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::contacts
}
