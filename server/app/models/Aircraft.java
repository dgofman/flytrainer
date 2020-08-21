package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.AircraftCategory;
import utils.Constants.AircraftCategoryClass;

@Entity
@History
@Table(name = "aircraft")
public class Aircraft extends BaseModel {

	public AircraftCategoryClass cclass;

	public List<AircraftCategory> categories;

	@Length(30)
	public String other;

	@NotNull
	@Length(50)
	public String make;

	@NotNull
	@Length(10)
	public String model;

	@NotNull
	@Length(10)
	public String tailNo;

	@NotNull
	public Integer year;

	@Length(20)
	public String serialNumber;

	public Date regExpDate;

	@ManyToOne
	public User onwer;

	@ManyToOne
	public Address location;

	public Integer seats;

	public byte complex = 0;

	public byte highPerformance = 0;

	public byte experimental = 0;

	public byte lightSport = 0;

	public byte tailWheel = 0;

	public byte pressuarized = 0;

	public byte oxygent = 0;

	public byte certifiedIfr = 0;

	public byte certified141 = 0;

	public byte certifiedNight = 0;

	public byte far91409 = 0;

	public byte part135 = 0;

	public byte forHire = 0;

	public byte maintenanceCheck = 0;

	@OneToOne(mappedBy = "aircraft")
	public AircraftWeightAndBallance wb;
	
	@OneToMany(mappedBy = "aircraft")
	public List<Engine> engines = new ArrayList<>();
	
	@OneToMany(mappedBy = "aircraft")
	public List<Propeller> propellers = new ArrayList<>();

	@OneToMany(mappedBy = "aircraft")
	public List<Maintenance> maintances = new ArrayList<>();

	@OneToMany(mappedBy = "aircraft")
	public List<Insurance> insurance = new ArrayList<>();

	@OneToMany(mappedBy = "aircraft")
	public List<Squawks> squawks = new ArrayList<>();

	@OneToMany(mappedBy = "aircraft")
	public List<Rate> rates = new ArrayList<>();

	@OneToMany(mappedBy = "aircraft")
	public List<Equipment> equipments = new ArrayList<>();
	
	@ManyToOne
	public Document document;

	@ManyToOne
	public Note notes;
}