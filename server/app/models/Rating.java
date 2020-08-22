package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.AircraftCategoryClass;

@Entity
@History
@Table(name = "rating")
public class Rating extends BaseModel {

	@NotNull
	public AircraftCategoryClass type = AircraftCategoryClass.SingleEngineLand; //type

	@Length(30)
	public String other; //other

	@Length(10)
	public String number; //number

	@Length(50)
	public String description; //description

	@Length(100)
	public String limitations; //limitations

	@NotNull
	Date issuedDate; //issued_date

	Date renewDate; //renew_date

	public Date expDate; //exp_date

	@NotNull
	public byte isSuspended = 0; //is_suspended

	@ManyToOne
	public Document document; //document_id

	@ManyToOne
	public User user; // FK user_id - User::ratings

	@ManyToOne
	public Note notes; //notes_id
}
