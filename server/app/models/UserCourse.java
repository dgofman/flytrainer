package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;

@Entity
@History
@Table(name = "user_course")
public class UserCourse extends AbstractBase {

	public Date issueDate; //issue_date
	
	public Date expDate; //exp_date
	
	@ManyToOne
	public Billing billing; //billing_id
	
	@ManyToOne
	public Course course; // FK course_id - Course::courses

	@ManyToOne
	public User user; // FK user_id - User::courses
}
