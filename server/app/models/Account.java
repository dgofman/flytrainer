package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.annotation.Aggregation;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.AppConfig;
import utils.Constants.AccountType;
import utils.Constants.Key;

@Entity
@History
@Table(name = "account")
@NamedQueries(value = { 
	@NamedQuery(name = Account.FIND, query = "select maxAccountId"),
})
public class Account extends BaseModel {
	
	public static final String FIND = "Account.find";

	public static final long INITIAL_ACCOUNT_ID = AppConfig.get(Key.INITIAL_ACCOUNT_ID).asLong();
	
	@Length(30)
	public String description; //description

	@NotNull
	public AccountType type = AccountType.Renter; //type
	
	@Length(30)
	public String other; //other

	public Long accountId; //account_id
	
	@Aggregation("max(accountId)")
	public Long maxAccountId;
	
	@NotNull
	public byte isActive = 0; //is_active

	public Date expDate; //exp_date

	@ManyToOne
	public Payment autoPayment; //auto_payment_id
	
	@ManyToOne
	public Tier defaultTier; //default_tier_id

	@ManyToOne
	@JsonIgnore
	public User user; //FK user_id - User::accounts
}