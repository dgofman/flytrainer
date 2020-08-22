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

	@NotNull
	public AddressType type = AddressType.Home; //type

	@Length(30)
	public String other; //other
	
	@Length(100)
	public String description; //description

	@Length(10)
	public String number; //number

	@Length(120)
	public String street; //street

	@Length(20)
	@DbComment("ex: the region of an address, this may be a state, province, prefecture, etc.")
	public String district; //district

	@NotNull
	public String city; //city

	@Length(16)
	@DbComment("ex: the postal code or ZIP code of the address (where applicable)")
	public String code; //code

	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phone; //phone

	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String fax; //fax

	@NotNull
	@Length(2)
	public String country = "US"; //country

	@NotNull
	public byte isPrimary = 1; //is_primary
	
	@ManyToOne
	public Document document; //document_id

	@ManyToOne
	public User user; // FK user_id - User::addresses

	@ManyToOne
	public Note notes; //notes_id
}