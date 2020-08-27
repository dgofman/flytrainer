package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;

@Entity
@History
@Table(name = "filter")
public class Filter extends BaseModel {
	
	@Length(50)
	public String reference2;
	
	@ManyToOne
	public Note notes; //notes_id

	@ManyToOne
	public User user; //FK user_id - User::filters
}
