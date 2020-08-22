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
	
	@NotNull
	public MaintenanceAction type = MaintenanceAction.Inspection; //type
	
	@Length(30)
	public String other; //other

	@NotNull
	@Length(50)
	public String description; //description
	
	public Double airframeTime; //airframe_time

	public Double hobbs; //hobbs
	
	public Double tach; //tach
	
	public Double expHobbs; //exp_hobbs
	
	public Double expTach; //exp_tach
	
	public Date expDate; //exp_date
	
	public Double adjustHobbs; //adjust_hobbs
	
	public Double adjustTach; //adjust_tach
	
	public byte isHours25 = 0; //is_hours25
	
	public byte isHours50 = 0; //is_hours50
	
	public byte isAnnual = 0; //is_annual

	public byte isCritical = 0; //is_critical
	
	public byte isESign = 0; //is_esign

	@OneToMany(mappedBy = "maintenance")
	public List<AD> ads = new ArrayList<>(); //AD::maintenance_id

	@ManyToOne
	public Account mechanic; //mechanic_id
	
	@ManyToOne
	public Account supervisor;  //supervisor_id

	@ManyToOne
	public Billing billing; //billing_id

	@ManyToOne
	public Aircraft aircraft; //FK aircraft_id - Aircraft::maintenances
	
	@ManyToOne
	public Note notes; //notes_id
}
