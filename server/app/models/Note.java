package models;

import javax.persistence.Entity;
import javax.persistence.Table;

import io.ebean.annotation.DbJsonB;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "note")
public class Note extends BaseModel {
	
	@Length(50)
	public String type; //type - RESTRICTION, DEBIT, CREDIT etc.

	@DbJsonB
	@NotNull
	public String content; //content
}