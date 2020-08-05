package models;

import java.util.Date;
import java.util.List;

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
@Table(name = "certificate")
public class Certificate extends BaseModel {

	@Length(10)
	public String number;
	
	@NotNull
	public List<Constants.Certificate> certificates ;
	
	public List<Constants.Ratings> ratings;
	
	@Length(100)
	public List<String> limitations;

	@NotNull
	Date issuedDate;
	
	Date renewDate;
	
	@Column(name = "expirationDate")
	public Date expDate;
	
	@NotNull
	public byte isSuspended = 0;
	
	@ManyToOne()
	public User user;
}
