package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.AircraftCategoryClass;
import utils.Constants.CertificateType;

@Entity
@History
@Table(name = "certificate")
public class Certificate extends BaseModel {

	@NotNull
	public AircraftCategoryClass type = AircraftCategoryClass.SingleEngineLand; //type

	@Length(30)
	public String other; //other

	@NotNull
	public long certificates = CertificateType.getType(CertificateType.PrivatePilot); //certificates

	@Length(10)
	public String number; //number

	@Length(50)
	public String description; //description

	@Length(100)
	public String limitations; //limitations

	@NotNull
	public Date issuedDate; //issued_date

	public Date renewDate; //renew_date

	public Date currentBy; // current_by (BFR)

	public Date expDate; //exp_date

	public byte isSuspended = 0; //is_suspended
	
	public byte isWithdrawn = 0; //is_withdrawn

	@ManyToOne
	public User user; // FK user_id - User::certificates
}
