package models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.RateType;

@Entity
@History
@Table(name = "rate")
public class Rate extends BaseModel {

	@NotNull
	public RateType type = RateType.PerHour; //type

	@NotNull
	@Length(50)
	public String name; //name
	
	public Double fee; //fee

	public byte excludeAll = 0; //exclude_all (discounts)
	
	@JsonIgnore
	@ManyToMany
	public List<Tier> discounts = new ArrayList<>();
}
