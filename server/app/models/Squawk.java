package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.SquawksStatus;

@Entity
@History
@Table(name = "squawk")
public class Squawk extends BaseModel {
	
	@NotNull
	public SquawksStatus type = SquawksStatus.Open; //type
	
	@Length(30)
	public String other; //other

	@Length(1000)
	@NotNull
	public String description; //description
	
	@ManyToOne
	public Account reported; //reported_id
	
	@ManyToOne
	public Account corrected; //corrected_id
	
	@ManyToOne
	public Aircraft aircraft; //FK aircraft_id - Aircraft::squawks
}
