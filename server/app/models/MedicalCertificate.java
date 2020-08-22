package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants;

@Entity
@History
@Table(name = "medical")
public class MedicalCertificate extends BaseModel {

	@Length(10)
	@NotNull
	public Constants.MedicalCertificate type = Constants.MedicalCertificate.ThirdClass; //type
	
	@Length(30)
	public String other; //other

	@Length(10)
	public String number; //nuber

	@Length(100)
	public String specialIssuance; //special_issuance

	@Length(100)
	public String examiner; //examiner

	@NotNull
	Date issuedDate; //issued_date

	public Date expDate; //exp_date

	@NotNull
	public byte isSuspended = 0; //is_suspended

	@ManyToOne
	public Document document; //document_id

	@ManyToOne
	public User user; //FK user_id - User::medicalCertificates

	@ManyToOne
	public Note notes; //notes_id
}
