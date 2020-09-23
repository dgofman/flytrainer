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
import utils.Constants.EquipmentType;

@Entity
@History
@Table(name = "equipment")
public class Equipment extends BaseModel {
	
	@NotNull
	public EquipmentType type = EquipmentType.Gnss; //type
	
	@Length(30)
	public String other; //other
	
	@Length(30)
	public String manufacturer; //manufacturer
	
	@Length(30)
	public String model; //model
	
	@Length(30)
	public String serialNumber; //serial_number
	
	@Length(30)
	public String code; //code

	public Double weight; //weight
	
	public Date year; //year
	
	public Double price; //price
	
	public Double warrantyExpDate; //warranty_exp_date
	
	public byte inop = 0; //inop
	
	public Double deviation; //deviation
	
	public Long inspectionTime; //inspection_time
	
	@ManyToOne
	public Document document; //document_id

	@OneToMany(mappedBy = "aircraft")
	public List<Maintenance> maintances = new ArrayList<>();  //Maintenance::aircraft_id

	@ManyToOne
	public Aircraft aircraft; //FK aircraft_id - Aircraft::equipments
}
