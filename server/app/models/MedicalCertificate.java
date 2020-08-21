package models;

import java.util.Date;

import javax.persistence.Column;
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
	public String number;

	@Length(10)
	@Column(name = "medicalClass")
	public Constants.MedicalCertificate medClass = Constants.MedicalCertificate.ThirdClass;

	@Length(100)
	public String specialIssuance;

	@Length(100)
	public String examiner;

	@NotNull
	Date issuedDate;

	public Date expDate;

	@NotNull
	public byte isSuspended = 0;

	@ManyToOne
	public Document document;

	@ManyToOne
	public User user;

	@ManyToOne
	public Note notes;
}
