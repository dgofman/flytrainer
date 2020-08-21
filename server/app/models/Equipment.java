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
import utils.Constants.EquipmentType;

@Entity
@History
@Table(name = "equipment")
public class Equipment extends BaseModel {
	
	public EquipmentType type;
	
	@Length(30)
	public String other;
	
	@Length(30)
	public String manufacturer;
	
	@Length(30)
	public String model;
	
	@Length(30)
	public String serialNumber;
	
	@Length(30)
	public String code;

	public Double weight;
	
	public Date year;
	
	public Double price;
	
	public Double warrantyExpDate;
	
	public byte inop = 0;
	
	public Double deviation;
	
	public Long inspectionTime;
	
	@ManyToOne
	public Document document;

	@OneToMany(mappedBy = "aircraft")
	public List<Maintenance> maintances = new ArrayList<>();

	@ManyToOne
	public Aircraft aircraft; //FK - Aircraft::equipments
	
	@ManyToOne
	public Note notes;
}
