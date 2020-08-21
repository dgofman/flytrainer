package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
	
	public InsuranceType type;
	
	@Length(30)
	public String other;

	public PaymentPeriod period;

	@NotNull
	@Length(50)
	public String name;
	
	@NotNull
	@Length(50)
	public String company;
	
	@Length(50)
	public String policy; //Policy Number
	
	public Double price;
	
	public Double discount;
	
	public Date startDate;

	public Date endDate;

	public List<String> coverages = new ArrayList<>();
	
	public List<String> limits = new ArrayList<>();
	
	@ManyToOne
	public Document document;

	@ManyToOne
	public Aircraft aircraft; //FK - Aircraft::insurances
	
	@ManyToOne
	public Account account; //FK - Account::insurances
	
	@ManyToOne
	public Note notes;
}
