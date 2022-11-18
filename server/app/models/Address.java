package models;

import java.io.IOException;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import utils.Constants.AddressType;

@Entity
@History
@Table(name = "address")
public class Address extends DocumentModel {
	
	public Address link;

	public AddressType type; //type
	
	@Length(50)
	public String reference; //Class name

	@Length(30)
	public String other; //other
	
	@Length(30)
	public String description; //description

	@Length(10)
	public String pobox; //number

	@Length(120)
	public String street; //street

	@Length(50)
	public String city; //city

	@Length(16)
	@DbComment("ex: the postal code or ZIP code of the address (where applicable)")
	public String code; //code

	@Length(20)
	@DbComment("ex: state, region, province, prefecture, etc.")
	public String state; //district

	@Length(2)
	public String country; //country

	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String phone; //phone

	@Length(30)
	@DbComment("ex: (+NN) NNN NNN NNN")
	public String fax; //fax
	
	public byte isPrimary; //is_primary
	
	public byte isFavorite; //is_favorite
	
	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::addresses
	
	@ManyToOne
	@JsonIgnore
	public Aircraft aircraft; //FK aircraft_id - Aircraft::location
	
	public static interface IsAddressable {
		Address getAddress();
		void setAddress(JsonNode body) throws IOException;
	}
}