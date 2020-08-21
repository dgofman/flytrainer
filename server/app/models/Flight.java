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
import utils.Constants.CancelationType;
import utils.Constants.FlightType;

@Entity
@History
@Table(name = "flight")
public class Flight extends BaseModel {
	
	public FlightType type;
	
	@Length(30)
	public String other;
	
	public Double startHobbs;
	
	public Double endHobbs;
	
	public Double startTach;
	
	public Double endTach;
	
	public Double addedOil;
	
	public Double addedFuel;
		
	public CancelationType cancelationType;
	
	@ManyToOne
	public Document document;
	
	public List<String> legs = new ArrayList<>();

	@NotNull
	@OneToMany
	public Billing billing;

	@OneToMany
	public Aircraft aircraft;

	@ManyToOne
	public Account account; //FK - Account::flights
	
	@ManyToOne
	public Note notes;
}