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
	public String occupation; //occupation

	@NotNull
	@Length(50)
	public String name; //name

	public Double annualWage; //annual_wage

	public Double hourlyWage; //hourly_wage

	public byte isContractor = 0; //is_contractor
	
	@ManyToOne
	public Insurance insurance; //insurance_id

	@ManyToOne
	public Address address; //address_id

	@ManyToOne
	public User user; // FK user_id - User::employers
}
