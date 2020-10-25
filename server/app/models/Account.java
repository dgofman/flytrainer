package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
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

	@ManyToOne
	public Payment autoPayment; //auto_payment_id
	
	@ManyToOne
	public TierRate defaultTier; //default_tier_id

	@ManyToOne
	public User user; //FK user_id - User::accounts
}