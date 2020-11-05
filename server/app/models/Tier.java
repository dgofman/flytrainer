package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.TierType;

@Entity
@History
@Table(name = "tier")
public class Tier extends BaseModel {
	
	@NotNull
	public TierType type = TierType.Hourly;
	
	@Length(30)
	public String other; //other

	@Length(50)
	public String description; //description
	
	@NotNull
	public Double rate = 0.0; //rate
	
	public byte isPercent = 0; //is_percent
	
	public byte isDiscount = 1; //is_discount
	
	public byte isOverride = 0; //is_override
	
	public byte isDisable = 0; //is_disable
	
	public Double minRate; //min_rate
	
	public Double maxRate; //max_rate
	
	@Column(name = "promotion_code")
	public String code; //promotion_code
	
	@Column(name = "effective_date")
	public Date effectDate; //effective_date
	
	@Column(name = "expiration_date") //expiration_date
	public Date expDate;
}