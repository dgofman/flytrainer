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
	public AccountType type = AccountType.Pilot; //type
	
	@Length(30)
	public String other; //other

	@NotNull
	public Integer accountId; //account_id
	
	@NotNull
	public byte isActive = 0; //is_active

	public Date expDate; //exp_date

	@OneToMany(mappedBy = "account")
	public List<Billing> billing = new ArrayList<>(); //Billing::account_id

	@OneToMany(mappedBy = "account")
	public List<Flight> flights = new ArrayList<>(); //Flight::account_id
	
	@OneToMany(mappedBy = "account")
	public List<Insurance> insurances = new ArrayList<>(); //Insurance::account_id
	
	@OneToMany(mappedBy = "account")
	public List<Schedule> schedules = new ArrayList<>(); //Schedule::account_id

	@ManyToOne
	public Payment autoPayment; //auto_payment_id
	
	@ManyToOne
	public TierRate defaultTier; //default_tier_id

	@ManyToOne
	public User user; //FK user_id - User::accounts
	
	@ManyToOne
	public Note notes; //notes_id
}