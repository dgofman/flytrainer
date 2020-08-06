package models;

import java.time.Instant;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonView;

import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;

@MappedSuperclass
public abstract class BaseModel extends Model {

	@Version
	@JsonView(Full.class)
	public long version;

	@Id
	public Integer id;

	@WhenCreated
	@JsonView(Full.class)
	public Instant createdDate;

	@WhenModified
	public Instant modifiedDate;

	@JsonView(Full.class)
	private Integer whoCreated;
	public Integer getWhoCreated() {
		return whoCreated;
	}

	@JsonView(Full.class)
	private Integer whoModified;
	public Integer getWhoModified() {
		return whoModified;
	}

	@Transient
	@JsonView(Never.class)
	public Integer currentUserId;

	@Override
	public void save() {
		if (currentUserId != null) {
			whoCreated = currentUserId;
			whoModified = currentUserId;
		}
		super.save();
		if (currentUserId != null) {
			whoCreated = id;
			whoModified = id;
			super.save();
		}
	}
	
	@Override
	public void update() {
		if (currentUserId != null) {
			whoModified = id;
		} else {
			whoModified = currentUserId;
		}
		super.update();
	}

	public static class Admin {};

	public static class Full {};
	
	public static class Never {};
}