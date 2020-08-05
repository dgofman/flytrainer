package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.DbJsonB;

@Entity
@Table(name = "note")
public class Note extends BaseModel {

	@DbJsonB
	public String content;

	@ManyToOne()
	public User user;
}