package models;

import java.util.Date;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.annotation.DbJson;
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
	public CertificateType type = CertificateType.PrivatePilot; //certificates

	@Length(30)
	public String other; //other

	@DbJson
	@Column(name = "class")
	public Map<AircraftCategoryClass, Boolean> aircraftClass;

	@Length(10)
	public String number; //number

	@Length(50)
	public String description; //description

	@Length(100)
	public String limitations; //limitations

	public Date issuedDate; //issued_date

	public Date renewDate; //renew_date

	public Date currentBy; // current_by (BFR)

	public Date expDate; //exp_date

	public byte isSuspended = 0; //is_suspended
	
	public byte isWithdrawn = 0; //is_withdrawn
	
	public Integer monthInterval; //month_interval

	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::certificates
}
