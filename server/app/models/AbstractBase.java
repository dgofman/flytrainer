package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;

@MappedSuperclass
public abstract class AbstractBase extends Model {
	@Column(name = "id")
	@Id
	public Long id; //id
	
	@Column(name = "version")
	@Version
	public Long version; //version
	
	@JsonIgnore
	@WhenCreated
	public Date createdDate; //created_date
	
	@JsonIgnore
	@WhenModified
	public Date modifiedDate; //modified_date
}
