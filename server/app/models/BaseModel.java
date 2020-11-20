package models;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonView;

@MappedSuperclass
public abstract class BaseModel extends AbstractBase {

	@JsonView(Short.class)
	@Column(name = "who_created")
	private Long whoCreated; //who_created
	public Long getWhoCreated() {
		return whoCreated;
	}

	@JsonView(Short.class)
	@Column(name = "who_modified")
	private Long whoModified; //who_modified
	public Long getWhoModified() {
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
}