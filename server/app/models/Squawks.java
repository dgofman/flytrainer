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
@Table(name = "squawks")
public class Squawks extends BaseModel {
	
	@NotNull
	public SquawksStatus status = SquawksStatus.OPEN;
	
	@Length(1000)
	@NotNull
	public String description;
	
	@ManyToOne
	public Document document;
	
	@ManyToOne
	public Account reported;
	
	@ManyToOne
	public Account corrected;
	
	@ManyToOne
	public Aircraft aircraft; //FK - Aircraft::squawks
	
	@ManyToOne
	public Note notes;
}
