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
public class Course extends BaseModel {

	@NotNull
	public CourseType type = CourseType.TSA; //type

	@Length(30)
	public String other; //other

	@Length(30)
	public String number; //number

	@Length(30)
	public String description; //description

	public Double cost; //cost

	public Double time; //time

	public Date dateCompletion; //date_completion

	public Date expDate; //exp_date

	public byte isOnline = 0; //is_online

	@Length(50)
	public String presentedBy; //presented_by

	@Length(100)
	public String credits; //credits

	@ManyToOne
	public Address location; //location_id

	@ManyToOne
	public Billing billing; //billing_id

	@ManyToOne
	public User user; // FK user_id - User::courses
}
