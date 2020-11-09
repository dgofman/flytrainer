package models;

import java.util.Date;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.annotation.DbJson;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.EndorsementType;

@Entity
@History
@Table(name = "endorsement")
public class Endorsement extends DocumentModel {

	@NotNull
	public EndorsementType type = EndorsementType.Citizenship; //type

	@Length(30)
	public String other; //other

	@Length(30)
	public String description; //description

	@Length(100)
	public String limitations; //limitations
	
	public Date issuedDate; //issued_date 
	
	public Date expDate; //exp_date
	
	public byte isCanceled = 0; //is_canceled

	@DbJson
	public Map<String, Object> signed;

	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::endorsements
}
