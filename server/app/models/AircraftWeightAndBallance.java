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
	public Double emptyWeight; //empty_weight
	
	public Double moment; //moment
	
	public Double arm; //arm
	
	public Double newCG; //new_cg

	public Double newUsefulLoad; //new_useful_load
	
	public Double grossWeight; //gross_weight
	
	public Double takeoffWeight; //takeoff_weight
	
	public Double baggageWeight; //baggage_weight
	
	public Double fuelBurn; //fuel_burn
	
	public Double fuelTankGallons; //fule_tank_gallons
	
	public byte isCalculated = 0; //is_calculated
	
	public byte isWeighed = 0; //is_weighed
	
	public byte isWithdrawn = 0; //is_withdrawn
	
	@ManyToOne
	public User signed; //signed_id
	
	@ManyToOne
	public Document document; //document_id

	@OneToOne
	public Aircraft aircraft; //FK aircraft_id - Aircraft::wb
	
	@ManyToOne
	public Note notes; //notes_id
}