package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFilter;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.CourseType;

@Entity
@History
@Table(name = "course")
@JsonFilter("CourseFilter")
public class Course extends BaseModel {
	
	public Course() {
		super();
	}

	public Course(Long id) {
		super();
		this.id = id;
	}

	@NotNull
	public CourseType type = CourseType.TSA; //type

	@Length(30)
	public String other; //other

	@Length(30)
	public String description; //description
	
	public Date startDate; //start_date
	
	public Date endDate; //end_date

	public Double cost; //cost

	public Double duration; //duration

	public byte isOnline = 0; //is_online

	@Length(100)
	public String credits; //credits

	@ManyToOne
	public Address location; //location_id
}
