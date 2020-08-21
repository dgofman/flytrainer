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
import utils.Constants.MaintenanceAction;

@Entity
@History
@Table(name = "maintenance")
public class Maintenance extends BaseModel {
	
	public MaintenanceAction action;
	
	@Length(30)
	public String other;

	@NotNull
	@Length(50)
	public String description;
	
	public Double airframeTime;

	public Double hobbs;
	
	public Double tach;
	
	public Double expHobbs;
	
	public Double expTach;
	
	public Date expDate;
	
	public Double adjustHobbs;
	
	public Double adjustTach;
	
	public byte hours25 = 0;
	
	public byte hours50 = 0;
	
	public byte annual = 0;

	public byte isCritical = 0;
	
	public byte isESign = 0;

	@OneToMany(mappedBy = "maintenance")
	public List<AD> ads = new ArrayList<>();

	@ManyToOne
	public Account inspected;
	
	@ManyToOne
	public Account superviced;

	@ManyToOne
	public Billing billing;

	@ManyToOne
	public Aircraft aircraft; //FK - Aircraft::maintances, Equipment::maintances, Engine::maintances, Propeller::maintances
	
	@ManyToOne
	public Note notes;
}
