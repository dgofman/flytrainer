package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "tier")
public class TierRate extends BaseModel {

	@NotNull
	@Length(50)
	public String name; //name
	
	public Double discount = 0.0; //discount
	
	@ManyToOne
	Rate rate; //rate_id
}
