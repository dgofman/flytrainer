package models;

import java.io.IOException;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@MappedSuperclass
public abstract class DocumentModel extends NotesModel {

	@Column
	@ManyToOne
	private Document document; //document_id

	public Document getDocument() {
		return this.document;
	}

	public void setDocument(Document document) throws IOException {
		this.document = document;
	}

	public void setJsonDocument(JsonNode body) throws IOException {
		this.document = body != null ? new ObjectMapper().readerFor(Document.class).readValue(body) : null;
	}
}
