package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "contact")
public class Contact extends BaseModel {

	@Length(30)
	public String description;

	@Column(name = "firstname")
	@NotNull
	@Length(50)
	public String first;

	@Column(name = "middlename")
	@NotNull
	@Length(50)
	public String middle;

	@Column(name = "lastname")
	@NotNull
	@Length(50)
	public String last;

	@NotNull
	@Length(30)
	public String relationship;

	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phone;

	@ManyToOne
	public Address address;

	@ManyToOne
	public User user; // FK User::contacts

	@ManyToOne
	public Note notes;
}
