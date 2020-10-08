package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;
import models.BaseModel.Full;

@MappedSuperclass
public abstract class AbstractBase extends Model {
	@Column(name = "id")
	@Id
	public Long id; //id
	
	@Column(name = "version")
	@Version
	public Long version; //version

	@WhenCreated
	@JsonView(Full.class)
	@Column(name = "created_date")
	public Date createdDate; //created_date

	@WhenModified
	@JsonView(Full.class)
	@Column(name = "modified_date")
	public Date modifiedDate; //modified_date
}
