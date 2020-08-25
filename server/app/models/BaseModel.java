package models;

import java.util.Date;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;

@MappedSuperclass
public abstract class BaseModel extends Model {

	@Version
	public long version; //version

	@Id
	public Integer id; //id

	@WhenCreated
	@JsonView(Short.class)
	public Date createdDate; //created_date

	@WhenModified
	public Date modifiedDate; //modified_date

	@JsonView(Short.class)
	private Integer whoCreated; //who_created
	public Integer getWhoCreated() {
		return whoCreated;
	}

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