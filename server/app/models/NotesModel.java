package models;

import java.io.IOException;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@MappedSuperclass
public abstract class NotesModel extends BaseModel {

	@Column
	@ManyToOne
	private Note notes; //notes_id

	public Note getNotes() {
		return this.notes;
	}

	public void setNotes(Note notes) throws IOException {
		this.notes = notes;
	}

	public void setJsonNotes(JsonNode body) throws IOException {
		this.notes = body != null && !body.get("content").isNull() ? new ObjectMapper().readerFor(Note.class).readValue(body) : null;
	}
}
