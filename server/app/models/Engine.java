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
import utils.Constants.PositionType;
import utils.Constants.EngineType;

@Entity
@History
@Table(name = "engine")
public class Engine extends BaseModel {

	@NotNull
	public EngineType type = EngineType.Reciprocating; //type

	@Length(30)
	public String other; //other

	public PositionType position; //position

	@Length(50)
	public String manufacturer; //manufacturer

	@Length(30)
	public String model; //model

	@Length(30)
	public String serialNumber; //serial_number

	public Date year; //year

	public Double hobbs; //hobbs

	public Double tach; //tach

	public Date lastTBO; //last_tbo

	public Integer mohInterval; //moh_interval

	@OneToMany(mappedBy = "aircraft")
	public List<Maintenance> maintances = new ArrayList<>(); //Maintenance::aircraft_id
	
	@ManyToOne
	public Document document; //document_id

	@ManyToOne
	public Aircraft aircraft; //FK aircraft_id - Aircraft::engines

	@ManyToOne
	public Note notes; //notes_id
}
