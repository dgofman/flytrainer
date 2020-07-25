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
	public long version;

	@Id
	public Integer id;

	@WhenCreated
	public Instant createdDate;

	@WhenModified
	public Instant modifiedDate;

	private Integer whoCreated;
	public Integer getWhoCreated() {
		return whoCreated;
	}

	private Integer whoModified;
	public Integer getWhoModified() {
		return whoModified;
	}

	@Transient
	public Integer currentUserId;

	@Override
	public void save() {
		if (currentUserId != null) {
			if (id == null) {
				whoCreated = currentUserId;
			} else {
				whoModified = currentUserId;
			}
		}
		super.save();
	}
	
	@Override
	public void update() {
		if (currentUserId != null) {
			if (id == null) {
				whoCreated = currentUserId;
			} else {
				whoModified = currentUserId;
			}
		}
		super.update();
	}
}