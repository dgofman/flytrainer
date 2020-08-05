package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.AddressType;

@Entity
@History
@Table(name = "address")
public class Address extends BaseModel {

	public AddressType type;
	
	@Length(120)
	@NotNull
	public String address;
	
	@Length(20)
	public String district; //The region of an address, this may be a state, province, prefecture, etc.
	
	@NotNull
	public String city;
	
	@Length(16)
	public String code;  //The postal code or ZIP code of the address (where applicable).
	
	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phone;
	
	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String fax;
	
	@NotNull
	@Length(2)
	public String country = "US";
	
	@Length(100)
	public String description;
	
	@NotNull
	public byte isPrimary = 1;
	
	@ManyToOne()
	public User user;
}