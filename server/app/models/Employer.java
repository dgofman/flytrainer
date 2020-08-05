package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "employer")
public class Employer extends BaseModel {

	@OneToOne
	public Address address;

	@NotNull
	@Length(50)
	public String occupation;

	@NotNull
	@Length(50)
	public String name;
	
	@ManyToOne()
	public User user;
}
