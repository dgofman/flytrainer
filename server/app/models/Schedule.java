package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "schedule")
public class Schedule extends BaseModel {

	public Date startDate;
	
	public Date endDate;
	
	public byte notifyEmail = 1;
	
	public byte notifySMS = 1;
	
	@ManyToOne
	public Flight flight;

	@ManyToOne
	public Account account; //FK Account::schedules
	
	@ManyToOne
	public Account instructor; //FK Account::schedules

	@ManyToOne
	public Note notes;
}
