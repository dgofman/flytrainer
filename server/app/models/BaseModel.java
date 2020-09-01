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

@MappedSuperclass
public abstract class BaseModel extends Model {

	@Id
	public Integer id; //id
	
	@Column(name = "version")
	@Version
	public long version; //version

	@Column(name = "created_date")
	@WhenCreated
	@JsonView(Short.class)
	public Date createdDate; //created_date

	@Column(name = "modified_date")
	@WhenModified
	public Date modifiedDate; //modified_date

	@Column(name = "who_created")
	@JsonView(Short.class)
	private Integer whoCreated; //who_created
	public Integer getWhoCreated() {
		return whoCreated;
	}

	@Column(name = "who_modified")
	@JsonView(Short.class)
	private Integer whoModified; //who_modified
	public Integer getWhoModified() {
		return whoModified;
	}


	public void save(BaseModel currentUser) {
		whoCreated = currentUser.id;
		whoModified = currentUser.id;
		super.save();
	}
	
	public void update(BaseModel currentUser) {
		whoModified = currentUser.id;
		super.update();
	}
	
	public void delete(BaseModel currentUser) {
		whoModified = currentUser.id;
		super.delete();
	}

	public static class Admin {};

	public static class Short {};
	
	public static class Full {};
	
	public static class Never {};
}