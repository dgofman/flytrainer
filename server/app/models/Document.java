package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.Encrypted;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import models.BaseModel.Full;
import utils.Constants.DocumentType;

@Entity
@History
@Table(name = "document")
public class Document extends AbstractBase {
	
	@JsonIgnore
	@Length(50)
	public String type; //Class name

	@NotNull
	public DocumentType category = DocumentType.Driverslicense;

	@Length(30)
	public String other; //other

	@Length(50)
	public String description; //description

	@JsonView(Full.class)
	public Integer pageNumber = 1; //page_number

	@JsonView(Full.class)
	public byte isFrontSide = 1; //is_front_side
	
	@JsonView(Full.class)
	public byte isSuspended = 0; //is_suspended
	
	@JsonView(Full.class)
	public byte isWithdrawn = 0; //is_withdrawn

	@Length(2000)
	public String url; //url

	@Length(25)
	@Encrypted
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password; //password

	@Lob
	@JsonIgnore
	public byte[] file; //file
	
	@Column(name = "name")
	@Length(100)
	public String fileName;
	
	@Column(name = "path")
	@Length(500)
	public String filePath;
	
	@Column(name = "contentType")
	@Length(50)
	public String contentType;

	@Column(name = "size")
	public Long size;

	public Date issuedDate; //issued_date

	public Date expDate; //exp_date
	
	@ManyToOne
	public Document parent; //parent_id

	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::addresses
	
	@ManyToOne
	@JsonIgnore
	public Aircraft aircraft; //FK aircraft_id - Aircraft::engines
	
	public Long getVersion() {
		return null;
	}
}
