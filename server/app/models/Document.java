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
public class Document extends BaseModel {

	public DocumentType type;

	@Length(30)
	public Document other;

	@Length(50)
	public Document number;

	@NotNull
	@Length(50)
	public Document description;

	public Integer pageNumber = 1;

	public byte isFronSide = 1;

	@Length(2000)
	public String url;

	@Length(25)
	@Encrypted
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password;

	@Lob
	public byte[] file;

	public Date issuedDate;

	public Date expDate;

	@ManyToOne
	public User user; //FK User::documents
	
	@ManyToOne
	public Note notes;
}
