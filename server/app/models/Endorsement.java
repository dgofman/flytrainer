package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import utils.Constants.EndorsementType;

@Entity
@History
@Table(name = "endorsement")
public class Endorsement extends BaseModel {

	public EndorsementType type;

	@Length(30)
	public String other;

	@Length(100)
	public String decription;

	@Length(50)
	public String number;

	public User signed;

	public Date signedDate;

	public Date expDate;

	public List<String> limitations = new ArrayList<>();
	
	@ManyToOne
	public Document document;

	@ManyToOne
	public User user; // FK User::endorsements

	@ManyToOne
	public Note notes;
}
