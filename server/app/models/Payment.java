package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.PaymentType;

/* Credit Card information */
@Entity
@History
@Table(name = "payment")
public class Payment extends BaseModel {

	@NotNull
	public PaymentType type = PaymentType.Credit; //type

	@Length(30)
	public String other; //other

	@Length(50)
	public String description; //description

	@Length(50)
	public String number; //number

	@Length(10)
	public String verification; //verification

	public Date expDate; //exp_date

	public byte isDefault = 1; //is_default

	@Length(500)
	public String url; //url

	@ManyToOne
	public User diffOwner = null; //diff_owner_id
	
	@ManyToOne
	public Document document; //document_id
	
	@ManyToOne
	public Billing billing; // FK billing_id - Billing::payments
}
