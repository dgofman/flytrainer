package models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.ActivityType;
import utils.Constants.PaymentPeriod;

@Entity
@History
@Table(name = "billing")
public class Billing extends BaseModel {

	@NotNull
	public ActivityType type = ActivityType.Debit; //type
	
	@Length(30)
	public String other; //other
	
	@Length(100)
	public String description; //description
	
	@NotNull
	public Double amount = 0.0; //amount

	public Double tax = 0.0; //tax

	@ManyToOne
	public PaymentPeriod period; //period
	
	@ManyToOne
	public TierRate tier; //tier_id

	@OneToMany(mappedBy = "billing")
	public List<Payment> payments = new ArrayList<>(); //Payment::billing_id

	@ManyToOne
	public Account account; //FK account_id - Account::billing
	
	@ManyToOne
	public Note notes; //notes_id
}