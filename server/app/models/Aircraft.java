package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.AircraftCategory;
import utils.Constants.AircraftCategoryClass;
import utils.Constants.AircraftSpecification;

@Entity
@History
@Table(name = "aircraft")
public class Aircraft extends BaseModel {

	@NotNull
	public AircraftCategoryClass type = AircraftCategoryClass.SingleEngineLand; //type

	public long categories = AircraftCategory.getType(AircraftCategory.Normal); //categories
	
	public long specifications = AircraftSpecification.getType(AircraftSpecification.ForHire); //specifications

	@Length(30)
	public String other; //other

	@NotNull
	@Length(50)
	public String make; //make

	@NotNull
	@Length(10)
	public String model; //model

	@NotNull
	@Length(10)
	public String tailNo; //tail_no

	@NotNull
	public Integer year; //year

	@Length(20)
	public String serialNumber; //serial_number

	public Date regExpDate; //reg_exp_date
	
	public Integer seatsNo; //seats_no

	@ManyToOne
	public User onwer; //onwer_id

	@ManyToOne
	public Address location; //location_id

	@OneToMany(mappedBy = "aircraft")
	public List<AircraftWeightAndBallance> wb = new ArrayList<>(); //AircraftWeightAndBallance::aircraft_id
	
	@OneToMany(mappedBy = "aircraft")
	public List<Engine> engines = new ArrayList<>(); //Engine::aircraft_id
	
	@OneToMany(mappedBy = "aircraft")
	public List<Propeller> propellers = new ArrayList<>(); //Propeller::aircraft_id

	@OneToMany(mappedBy = "aircraft")
	public List<Equipment> equipments = new ArrayList<>(); //Equipment::aircraft_id
	
	@OneToMany(mappedBy = "aircraft")
	public List<Maintenance> maintenances = new ArrayList<>(); //Maintenance::aircraft_id

	@OneToMany(mappedBy = "aircraft")
	public List<Insurance> insurance = new ArrayList<>(); //Insurance::aircraft_id

	@OneToMany(mappedBy = "aircraft")
	public List<Squawk> squawks = new ArrayList<>(); //Squawks::aircraft_id

	@OneToMany(mappedBy = "aircraft")
	public List<Rate> rates = new ArrayList<>(); //Rate::aircraft_id

	@ManyToOne
	public Document document;  //document_id
	
	@ManyToOne
	public Document registration; //registration_id
	
	@ManyToOne
	public Document airworthiness; //airworthiness_id

	@ManyToOne
	public Note notes; //notes_id
}