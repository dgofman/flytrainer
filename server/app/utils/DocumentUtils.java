package utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import com.fasterxml.jackson.databind.JsonNode;

import controllers.DocumentController;
import io.ebean.Ebean;
import io.ebean.Query;
import models.Aircraft;
import models.BaseModel;
import models.Document;
import models.User;

public class DocumentUtils {
	
	public static boolean saveFile(Document document) throws IOException {
		File file;
		if ((file = new File(document.filePath)).exists()) {
			if (DocumentController.savedDir != null) {
				Files.move(file.toPath(), new File(DocumentController.savedDir, document.fileName).toPath());
			} else {
				document.file = Files.readAllBytes(file.toPath());
			}
			return true;
		}
		return false;
	}

	public static <T> void create(BaseModel model, T ref) throws IOException {
		Document document = model.getDocument();
		if (document != null && document.filePath != null && saveFile(document)) {
			if (ref instanceof User) {
				document.user = (User) ref;
			} else {
				document.aircraft = (Aircraft) ref;
			}
			document.type = model.getClass().getSimpleName();
			document.save();
		}
	}

	public static <T>  void update(BaseModel model, T ref, User currentUser) throws IOException {
		Document document = model.getDocument();
		if (document != null) {
			if (document.id == null) {
				create(model, ref);
			} else if (document.filePath == null) {
				model.setDocument(null);
				model.update(currentUser);
				Ebean.find(Document.class).where().eq("id", document.id).delete();
			} else {
				Query<Document> query = Ebean.find(Document.class);
				query.where().eq("id", document.id);
				Document dbDocument = query.findOne();
				if (dbDocument == null) {
					create(model, ref);
				} else if (!dbDocument.filePath.equals(document.filePath) && saveFile(document)) {
					dbDocument.file = document.file;
					dbDocument.update();
				}
			}
		}
	}

	public static JsonNode delete(BaseModel model) {
		Document document = model.getDocument();
		if (document != null) {
			Ebean.find(Document.class).where().eq("id", document.id).delete();
		}
		return null;
	}
}