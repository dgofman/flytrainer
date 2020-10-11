package models;

import java.io.IOException;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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

	@ManyToOne
	private Note notes; //notes_id

	public Note getNotes() {
		return this.notes;
	}
	public void setNotes(JsonNode body) throws IOException {
		this.notes = body != null ? new ObjectMapper().readerFor(Note.class).readValue(body) : null;
	}
	
	@ManyToOne
	private Document document; //document_id

	public Document getDocument() {
		return this.document;
	}
	public void setDocument(JsonNode body) throws IOException {
		this.document = body != null ? new ObjectMapper().readerFor(Document.class).readValue(body) : null;
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
	
	public static class Default {};

	public static class Short extends Default {};
	
	public static class Full extends Short {};
	
	public static class Admin extends Full {};
	
	public static class Never {};
}