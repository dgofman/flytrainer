package models;

import java.io.IOException;

import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@MappedSuperclass
public abstract class DocumentModel extends NoteModel {

	@ManyToOne
	private Document document; //document_id

	public Document getDocument() {
		return this.document;
	}
	public void setDocument(JsonNode body) throws IOException {
		this.document = body != null ? new ObjectMapper().readerFor(Document.class).readValue(body) : null;
	}
}
