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
	public String subject; //subject
	
	@Length(100)
	public String revision; //revision

	@NotNull
	@Length(20)
	public String part; //part
	
	public Date effectiveDate; //effective_date
	
	public byte recurring = 0; //recurring
	
	public byte isCompliance = 0; //is_compliance
	
	@Length(30)
	public String amendment; //amendment
	
	@ManyToOne
	public Note actions; //action_id
	
	@ManyToOne
	public Maintenance maintenance; //FK maintenance_id - Maintenance::ads
	
	@ManyToOne
	public Note notes; //notes_id
}
