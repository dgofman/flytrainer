package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import utils.Constants.PaymentType;

/* Credit Card information */
@Entity
@History
@Table(name = "payment")
public class Payment extends BaseModel {

	public PaymentType type;

	@Length(30)
	public String other;

	@Length(50)
	public String description;

	@Length(50)
	public String number;

	@Length(10)
	public String verification;

	public Date expDate;

	public User diffOwner = null;

	@Length(500)
	public String url;

	public byte isDefault = 1;

	@ManyToOne
	public Billing billing; // FK Billing::payments

	@ManyToOne
	public Document document;

	@ManyToOne
	public Note notes;
}
