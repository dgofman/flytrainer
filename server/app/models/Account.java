package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import io.ebean.annotation.History;
import io.ebean.annotation.NotNull;

@Entity
@History
@Table(name = "accounts")
public class Account extends BaseModel {

	@NotNull
	public Double balance = 0.0;

	public Date dueDate;
}