package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.EndorsementType;

@Entity
@History
@Table(name = "endorsement")
public class Endorsement extends BaseModel {

	@NotNull
	public EndorsementType type = EndorsementType.Citizenship; //type

	@Length(30)
	public String other; //other

	@Length(100)
	public String description; //description

	@Length(100)
	public String limitations; //limitations

	@Length(50)
	public String number; //number
	
	public Date expDate; //exp_date

	public Date signedDate; //signed_date

	@ManyToOne
	public User signed; //signed_id

	@ManyToOne
	public User user; // FK user_id - User::endorsements
}
