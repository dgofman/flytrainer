package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.InsuranceType;
import utils.Constants.PaymentPeriod;

@Entity
@History
@Table(name = "insurance")
public class Insurance extends BaseModel {
	
	@NotNull
	public InsuranceType type = InsuranceType.Medical; //type
	
	@Length(30)
	public String other; //other

	public PaymentPeriod period; //period

	@NotNull
	@Length(50)
	public String name; //name
	
	@NotNull
	@Length(50)
	public String company; //company
	
	@Length(50)
	public String policyNo; //policy_no
	
	public Double price; //price
	
	public Double discount; //discount
	
	public Date startDate; //start_date

	public Date endDate; //end_date

	@Length(500)
	public String coverages; //coverages
	
	@Length(500)
	public String limitations; //limitations
	
	@ManyToOne
	public Document document; //document_id

	@ManyToOne
	public Aircraft aircraft; //FK aircraft_id - Aircraft::insurances
	
	@ManyToOne
	public Account account; //FK account_id - Account::insurances
	
	@ManyToOne
	public Note notes; //notes_id
}
