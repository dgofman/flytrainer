package models;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.annotation.DbJson;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import models.Address.IsAddressable;
import utils.Constants.AircraftCategory;
import utils.Constants.AircraftCategoryClass;
import utils.Constants.AircraftSpecification;

@Entity
@History
@Table(name = "aircraft")
public class Aircraft extends BaseModel implements IsAddressable {

	@NotNull
	public AircraftCategoryClass type = AircraftCategoryClass.SingleEngineLand; //type

	public long categories = AircraftCategory.getType(AircraftCategory.Normal); //categories
	
	@DbJson
	@Column(name = "spec")
	public Map<AircraftSpecification, Boolean> specifications;

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
	public Address location; //location_id

	@ManyToOne
	public User onwer; //onwer_id
	
	@ManyToOne
	public Document registration; //registration_id
	
	@ManyToOne
	public Document airworthiness; //airworthiness_id
	
	public Address getAddress() {
		return this.location;
	}
	public void setAddress(JsonNode body) throws IOException {
		this.location = body != null ? new ObjectMapper().readerFor(Address.class).readValue(body) : null;
	}
}