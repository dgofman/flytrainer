package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

/* Airworthiness Directive */

@Entity
@History
@Table(name = "ad")
public class AD extends BaseModel {
	
	@NotNull
	@Length(100)
	public String subject;

	@NotNull
	@Length(20)
	public String part;
	
	@Length(30)
	public String amendment;
	
	public byte recurring = 0;
	
	public Date effectiveDate;
	
	@ManyToOne
	public Maintenance maintenance; //FK - Maintenance::maintenances
	
	@ManyToOne
	public Note notes;
}
