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
@Table(name = "rates")
public class Rate extends BaseModel {
	
	public static final int EXCLUDE_ALL_TIERS = -1;
	
	@NotNull
	@Length(50)
	public String name;

	public RateType type;
	
	public Double fee;
	
	@ManyToMany
	public List<TierRate> excludedTiers = new ArrayList<>();

	@ManyToOne
	public Aircraft aircraft; //FK - User::rates

	@ManyToOne
	public Note notes;
}
