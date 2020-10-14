package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.annotation.DbComment;
import io.ebean.annotation.Encrypted;
import io.ebean.annotation.History;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import utils.Constants.DocumentType;

@Entity
@History
@NamedQueries(value = {
		@NamedQuery(name = Document.FIND, query = "select contentType, filePath, file where user = :user and id = :id") })
public class Document extends AbstractBase {

	public static final String FIND = "Document.find";

	@Length(50)
	@JsonView(Full.class)
	public String reference; //Class name

	@NotNull
	@JsonView(Short.class)
	public DocumentType type = DocumentType.DriverLicense;

	@Length(30)
	@JsonView(Full.class)
	public String other; //other

	@Length(50)
	@JsonView(Full.class)
	public String description; //description

	@JsonView(Short.class)
	public Integer pageNumber = 1; //page_number

	@JsonView(Full.class)
	public byte isFrontSide = 1; //is_front_side
	
	@JsonView(Full.class)
	public byte isSuspended = 0; //is_suspended
	
	@JsonView(Full.class)
	public byte isWithdrawn = 0; //is_withdrawn

	@Length(2000)
	@JsonView(Full.class)
	public String url; //url

	@Length(25)
	@Encrypted
	@JsonView(Full.class)
	@DbComment("CONVERT(AES_DECRYPT(password, `environment.json::encryptKey`) USING  UTF8)")
	public String password; //password

	@Lob
	@JsonIgnore
	public byte[] file; //file
	
	@Column(name = "name")
	@Length(100)
	@JsonView(Default.class)
	public String fileName;
	
	@Column(name = "path")
	@Length(500)
	@JsonView(Full.class)
	public String filePath;
	
	@Column(name = "contentType")
	@Length(50)
	@JsonView(Full.class)
	public String contentType;

	@Column(name = "size")
	@JsonView(Default.class)
	public Long size;

	@JsonView(Full.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_FORMAT_PATTERN)
	public Date issuedDate; //issued_date

	@JsonView(Full.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_FORMAT_PATTERN)
	public Date expDate; //exp_date
	
	@ManyToOne
	@JsonView(Short.class)
	public Document parent; //parent_id

	@ManyToOne
	@JsonIgnore
	public User user; // FK user_id - User::addresses
	
	@ManyToOne
	@JsonIgnore
	public Aircraft aircraft; //FK aircraft_id - Aircraft::engines
}
