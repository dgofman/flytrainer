package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.AircraftCategoryClass;
import utils.Constants.CurrencyType;

@Entity
@History
@Table(name = "currency")
public class Currency extends BaseModel {

	@NotNull
	public CurrencyType type = CurrencyType.FlightReview;

	@Length(30)
	public String other; //other

	@Column(name = "class")
	public AircraftCategoryClass aclass;

	@Length(30)
	public String description; //description

	public byte isSuperseded  = 0; //is_superseded

	public Date issuedDate; //issued_date
	
	public Date dueDate; //due_date
	
	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::currencies
}
