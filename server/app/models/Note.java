package models;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import models.BaseModel.Default;
import models.BaseModel.Full;

@Entity
@History
@Table(name = "note")
public class Note extends AbstractBase {

	@Length(50)
	@JsonView(Full.class)
	public String type; //Class name

	@Lob
	@NotNull
	@JsonView(Default.class)
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