package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.Length;

@Entity
@History
@Table(name = "filter")
public class Filter extends AbstractBase {

	@Length(50)
	public String reference;

	@ManyToOne
	public User user; //FK user_id - User::filters
}
