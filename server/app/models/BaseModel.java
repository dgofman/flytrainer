package models;

import java.time.Instant;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import javax.persistence.Version;

import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;

@MappedSuperclass
public abstract class BaseModel extends Model {

	@Version
	long version;

	@Id
	Integer id;

	@WhenCreated
	Instant createdDate;

	@WhenModified
	Instant modifiedDate;

	private Integer whoCreated;
	public Integer getWhoCreated() {
		return whoCreated;
	}

	private Integer whoModified;
	public Integer getWhoModified() {
		return whoModified;
	}

	@Transient
	private Integer currentUserId;
	public void setCurrentUserId(Integer userId) {
		this.currentUserId = userId;
	}
	
	@Override
	public void save() {
		if (currentUserId != null) {
			if (id == null) {
				whoCreated = currentUserId;
			} else {
				whoCreated = whoModified;
			}
		}
		super.save();
	}
}