package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "tier")
public class Tier extends BaseModel {

	@NotNull
	@Length(50)
	public String name; //name
	
	public Double ammount = 0.0; //ammount
	
	public byte isPercent = 0; //is_percent
	
	public Double minQuantity; //min_quantity
	
	public Double maxQuantity; //max_quantity
	
	@Column(name = "promotion_code")
	public String code; //promotion_code
	
	@Column(name = "effective_date")
	public Date effectDate; //effective_date
	
	@Column(name = "expiration_date") //expiration_date
	public Date expDate;

	@JsonIgnore
	@ManyToMany
	public List<Rate> rates = new ArrayList<>();
}