package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.DbJsonB;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "filter")
public class Filter extends BaseModel {
	
	@NotNull
	@Length(50)
	public String title; //title
	
	@Length(50)
	public String table; //table

	@DbJsonB
	@NotNull
	public String content; //content
	
	@ManyToOne
	public User user; //FK user_id - User::filters
}
