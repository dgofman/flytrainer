package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.AccountType;

@Entity
@History
@Table(name = "account")
public class Account extends BaseModel {
	
	@NotNull
	public AccountType type = AccountType.PILOT;
	
	@Length(30)
	public String other;

	@NotNull
	public Integer accountId;
	
	@NotNull
	public byte isActive = 0;

	public Date expDate;

	@OneToMany(mappedBy = "account")
	public List<Billing> billing = new ArrayList<>();

	@OneToMany(mappedBy = "account")
	public List<Flight> flights = new ArrayList<>();
	
	@OneToMany(mappedBy = "account")
	public List<Insurance> insurances = new ArrayList<>();
	
	@OneToMany(mappedBy = "account")
	public List<Schedule> schedules = new ArrayList<>();

	@ManyToOne
	public Payment autoPayment;
	
	@ManyToOne
	public TierRate defaultTier;

	@ManyToOne
	public User user; //FK - User::accounts
	
	@ManyToOne
	public Note notes;
}