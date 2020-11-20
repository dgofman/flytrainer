package models;

import java.io.IOException;

import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@MappedSuperclass
public abstract class NoteModel extends BaseModel {

	@ManyToOne
	private Note notes; //notes_id

	public Note getNotes() {
		return this.notes;
	}
	public void setNotes(JsonNode body) throws IOException {
		this.notes = body != null && !body.get("content").isNull() ? new ObjectMapper().readerFor(Note.class).readValue(body) : null;
	}
}
