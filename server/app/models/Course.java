package models;

import java.io.IOException;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import models.Address.IsAddressable;
import utils.Constants.CourseType;

@Entity
@History
@Table(name = "course")
@JsonFilter("CourseFilter")
public class Course extends NotesModel implements IsAddressable {
	
	public Course() {
		super();
	}

	public Course(Long id) {
		super();
		this.id = id;
	}

	@NotNull
	@Column
	public CourseType type = CourseType.TSA; //type

	@Length(30)
	@Column
	public String other; //other

	@Length(30)
	@Column
	public String description; //description
	
	@Column
	public Date startDate; //start_date
	
	@Column
	public Date endDate; //end_date

	@Column
	public Double cost; //cost

	@Column
	public Double duration; //duration

	@Column
	public byte isOnline = 0; //is_online

	@Length(100)
	@Column
	public String credits; //credits

	@Column
	@ManyToOne
	public Address location; //location_id
	
	public Address getAddress() {
		return this.location;
	}
	public void setAddress(JsonNode body) throws IOException {
		this.location = body != null ? new ObjectMapper().readerFor(Address.class).readValue(body) : null;
	}
}
