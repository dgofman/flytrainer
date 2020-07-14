package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import io.ebean.Finder;
import io.ebean.Model;
import play.data.format.Formats;
import play.data.validation.Constraints;

@Entity
@Table(name = "accounts")
public class Account extends Model {

	@Id
	@Constraints.Required
	public Integer id;

	@Constraints.Required
	@Constraints.MaxLength(50)
	@Constraints.MinLength(1)
	public String firstname;

	@Constraints.Required
	@Constraints.MaxLength(1)
	@Constraints.MinLength(50)
	public String lastname;

	@Constraints.Required
	public Double balance;

	@Formats.DateTime(pattern = "dd/MM/yyyy")
	public Date dueDate = new Date();

	public static Finder<Integer, Account> find = new Finder<>(Account.class);
}