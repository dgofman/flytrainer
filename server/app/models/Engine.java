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
import utils.Constants.EnginePosition;
import utils.Constants.EngineType;

@Entity
@History
@Table(name = "engine")
public class Engine extends BaseModel {

	public EngineType type;

	@Length(30)
	public String other;

	public EnginePosition position;

	@Length(50)
	public String manufacturer;

	@Length(30)
	public String model;

	@Length(30)
	public String serialNumber;

	public Date year;

	public Double hobbs;

	public Double tach;

	public Date lastTBO;

	public Integer mohInterval;

	@OneToMany(mappedBy = "aircraft")
	public List<Maintenance> maintances = new ArrayList<>();
	
	@ManyToOne
	public Document document;

	@ManyToOne
	public Aircraft aircraft; //FK Aircraft::engines

	@ManyToOne
	public Note notes;
}
