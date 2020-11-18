package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.CourseType;

@Entity
@History
@Table(name = "course")
public class Course extends DocumentModel {

	@NotNull
	public CourseType type = CourseType.TSA; //type

	@Length(30)
	public String other; //other

	@Length(30)
	public String description; //description
	
	public Date startDate; //start_date
	
	public Date endDate; //end_date

	public Double cost; //cost

	public Double time; //time

	public byte isOnline = 0; //is_online

	@Length(100)
	public String credits; //credits

	@ManyToOne
	public Address location; //location_id
}
