package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.CancelationType;
import utils.Constants.FlightType;

@Entity
@History
@Table(name = "flight")
public class Flight extends BaseModel {
	
	@NotNull
	public FlightType type = FlightType.Flight; //type
	
	@Length(30)
	public String other; //other
	
	public Double startHobbs; //start_hobbs
	
	public Double endHobbs; //end_hobbs
	
	public Double startTach; //start_tach
	
	public Double endTach; //end_tach
	
	public Double addedOil; //added_oil
	
	public Double addedFuel; //added_fuel
		
	public CancelationType cancelationType; //cancelation_type
	
	@Length(100)
	public String legs; //legs
	
	@ManyToOne
	public Document document; //document_id

	@NotNull
	@ManyToOne
	public Billing billing; //billing_id

	@ManyToOne
	public Aircraft aircraft; //aircraft_id

	@ManyToOne
	public Account account; //FK account_id - Account::flights
	
	@ManyToOne
	public Note notes; //notes_id
}