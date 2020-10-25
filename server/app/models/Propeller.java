package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.PositionType;

@Entity
@History
@Table(name = "propeller")
public class Propeller extends BaseModel {

	@NotNull
	public PositionType position = PositionType.Front; //position

	@Length(50)
	public String manufacturer; //manufacturer

	@Length(30)
	public String model; //model

	@Length(30)
	public String serialNumber; //serial_number

	public Date year; //year

	public int bladesNo = 2; //blades_no

	public Date lastTBO; //last_tbo

	public Integer mohInterval; //moh_interval

	@ManyToOne
	public Aircraft aircraft; //FK aircraft_id - Aircraft::propellers
}
