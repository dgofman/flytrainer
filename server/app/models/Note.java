package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.Model;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@Table(name = "note")
public class Note extends Model {

	@Id
	@Column(name = "id")
	public Long id; //id

	@Length(30)
	public String reference; //Class name

	@Lob
	@NotNull
	public String content; //content
	
	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::addresses
	
	@ManyToOne
	@JsonIgnore
	public Aircraft aircraft; //FK aircraft_id - Aircraft::engines
}