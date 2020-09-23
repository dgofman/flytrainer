package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;
import play.libs.Json;

@MappedSuperclass
public abstract class BaseModel extends Model {

	@Column(name = "id")
	@Id
	public Long id; //id
	
	@Column(name = "version")
	@Version
	public long version; //version

	@JsonView(Short.class)
	@WhenCreated
	public Date createdDate; //created_date

	@WhenModified
	public Date modifiedDate; //modified_date

	@JsonView(Short.class)
	private Long whoCreated; //who_created
	public Long getWhoCreated() {
		return whoCreated;
	}

	@JsonView(Short.class)
	private Long whoModified; //who_modified
	public Long getWhoModified() {
		return whoModified;
	}

	@ManyToOne
	@JsonView(Full.class)
	private Note notes; //notes_id

	public Note getNotes() {
		return this.notes;
	}
	public void setNotes(JsonNode body) {
		this.notes = Json.fromJson(body, Note.class);
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