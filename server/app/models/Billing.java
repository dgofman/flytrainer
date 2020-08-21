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
	public ActivityType type;
	
	@Length(30)
	public String other;
	
	@Length(100)
	public String description;
	
	public PaymentPeriod period;

	@NotNull
	public Double amount = 0.0;

	public Double tax = 0.0;
	
	@ManyToOne
	public TierRate tier;

	@OneToMany(mappedBy = "billing")
	public List<Payment> payments = new ArrayList<>();

	@ManyToOne
	public Account account; //FK Account::billing
	
	@ManyToOne
	public Note notes;
}