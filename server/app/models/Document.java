package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.Encrypted;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.DocumentType;

@Entity
@History
@Table(name = "document")
public class Document extends AbstractBase {

	@NotNull
	public DocumentType type = DocumentType.Driverslicense; //type

	@Length(30)
	public String other; //other

	@Length(50)
	public String description; //description

	public Integer pageNumber = 1; //page_number

	public byte isFrontSide = 1; //is_front_side
	
	public byte isSuspended = 0; //is_suspended
	
	public byte isWithdrawn = 0; //is_withdrawn

	@Length(2000)
	public String url; //url

	@Length(25)
	@Encrypted
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password; //password

	@Lob
	public byte[] file; //file

	public Date issuedDate; //issued_date

	public Date expDate; //exp_date
	
	@ManyToOne
	public Document parent; //parent_id

	@ManyToOne
	public User user; //FK user_id - User::documents
}
