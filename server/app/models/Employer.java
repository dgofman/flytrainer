package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "employer")
public class Employer extends BaseModel {

	@NotNull
	@Length(50)
	public String occupation;

	@NotNull
	@Length(50)
	public String name;

	public Double annualWage;

	public Double hourlyWage;

	public byte isContractor = 0;
	
	@ManyToOne
	public Insurance insurance;
	
	@ManyToOne
	public Document document;

	@ManyToOne
	public Address address;

	@ManyToOne
	public User user; // FK User:employers

	@ManyToOne
	public Note notes;
}
