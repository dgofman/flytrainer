package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.NotNull;
import utils.Constants;

@Entity
@History
@Table(name = "account")
public class Account extends BaseModel {

	public Integer accountId; //userId

	@NotNull
	public Double balance = 0.0;

	@Column(name = "expirationDate")
	public Date expDate;
	
	@NotNull
	public byte isActive = 0;
	
	@NotNull
	@Column(name = "accountType")
	public Constants.Access type = Constants.Access.USER;

	@ManyToOne()
	public User user;
}