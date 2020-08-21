package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "aircraftWB")
public class AircraftWeightAndBallance extends BaseModel {

	@NotNull
	public Double emptyWeight;
	
	public Double moment;
	
	public Double arm;
	
	public Double newCG;

	public Double newUsefulLoad;
	
	public Double grossWeight;
	
	public Double takeoffWeight;
	
	public Double fuledBurn;
	
	public Double fuleTankGallons;
	
	public Double baggage;

	@ManyToOne
	public Document document;

	@OneToOne
	public Aircraft aircraft; //FK - Aircraft::wb
	
	@ManyToOne
	public Note notes;
}