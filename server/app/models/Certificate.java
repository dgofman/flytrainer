package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
	public CertificateType type;

	@Length(10)
	public String other;

	@NotNull
	public List<AircraftCategoryClass> cclass;

	@Length(10)
	public String number;

	@Length(50)
	public String description;

	@Length(100)
	public List<String> limitations = new ArrayList<>();

	@NotNull
	Date issuedDate;

	Date renewDate;

	Date currentBy; // BFR

	public Date expDate;

	@NotNull
	public byte isSuspended = 0;

	@ManyToOne
	public Document document;

	@ManyToOne
	public User user; // FK User::certificates

	@ManyToOne
	public Note notes;
}
