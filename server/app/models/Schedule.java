package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "schedule")
public class Schedule extends BaseModel {

	public Date startDate; //start_date
	
	public Date endDate; //end_date
	
	public byte notifyEmail = 1; //notify_email
	
	public byte notifySMS = 1; //notify_sms
	
	@ManyToOne
	public Flight flight; //flight_id

	@ManyToOne
	public Account account; //FK account_id - Account::schedules
	
	@ManyToOne
	public Account instructor; //instructor_id
}
