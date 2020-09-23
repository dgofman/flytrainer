package models;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "note")
public class Note extends AbstractBase {
	
	@JsonIgnore
	@Length(50)
	public String type; //type - RESTRICTION, DEBIT, CREDIT etc.

	@Lob
	@NotNull
	public String content; //content
	
	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::addresses
	
	@ManyToOne
	@JsonIgnore
	public Aircraft aircraft; //FK aircraft_id - Aircraft::engines
	
	public Long getVersion() {
		return null;
	}
}