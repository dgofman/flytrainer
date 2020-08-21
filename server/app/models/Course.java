package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import utils.Constants.CourseType;

@Entity
@History
@Table(name = "course")
public class Course extends BaseModel {

	public CourseType type;

	@Length(30)
	public String other;

	@Length(100)
	public String number;

	@Length(100)
	public String decription;

	public Double cost;

	public Double time;

	public Date dateCompletion;

	public Date expDate;

	public byte isOnline = 0;

	@Length(100)
	public String location;

	@Length(100)
	public String presentedBy;

	@Length(100)
	public List<String> credits = new ArrayList<>();

	@ManyToOne
	public Billing billing;

	@ManyToOne
	public Document document;

	@ManyToOne
	public User user; // FK User::courses

	@ManyToOne
	public Note notes;
}
