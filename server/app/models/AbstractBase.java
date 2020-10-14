package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;

@MappedSuperclass
public abstract class AbstractBase extends Model {
	
	public static final String DATE_FORMAT_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

	@Id
	@Column(name = "id")
	public Long id; //id
	
	@Version
	@Column(name = "version")
	@JsonView(Short.class)
	public Long version; //version

	@WhenCreated
	@JsonView(Full.class)
	@Column(name = "created_date")
	@JsonProperty(access = Access.READ_ONLY)
	public Date createdDate; //created_date

	@WhenModified
	@JsonView(Full.class)
	@Column(name = "modified_date")
	@JsonProperty(access = Access.READ_ONLY)
	public Date modifiedDate; //modified_date
	
	public static class Default {};

	public static class Short extends Default {};
	
	public static class Full extends Short {};
	
	public static class Admin extends Full {};
	
	public static class Never {};
}
