package models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.RateType;

@Entity
@History
@Table(name = "rate")
public class Rate extends BaseModel {
	
	public static final int EXCLUDE_ALL_TIERS = -1;

	@NotNull
	public RateType type = RateType.PerHour; //type

	@NotNull
	@Length(50)
	public String name; //name
	
	public Double fee; //fee
	
	@ManyToMany
	public List<TierRate> excludedTiers = new ArrayList<>(); //rate_tier::reate_id

	@ManyToOne
	public Aircraft aircraft; //FK aircraft_id - User::rates
}
