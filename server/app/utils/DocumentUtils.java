package utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

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
		if (document.filePath != null && (file = new File(document.filePath)).exists()) {
			if (DocumentController.savedDir != null) {
				File newPath = new File(DocumentController.savedDir, file.getName());
				document.filePath = newPath.getAbsolutePath();
				Files.move(file.toPath(), newPath.toPath());
			} else {
				document.filePath = null;
				document.file = Files.readAllBytes(file.toPath());
				file.delete();
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
			document.reference = model.getClass().getSimpleName();
			document.save();
		}
	}

	public static <T>  void update(BaseModel model, T ref, User currentUser) throws IOException {
		Document document = model.getDocument();
		File file;
		if (document != null) {
			if (document.id == null) {
				create(model, ref);
			} else if (document.fileName == null) {
				model.setDocument(null);
				model.update(currentUser);
				Query<Document> query = Ebean.find(Document.class);
				query.where().eq("id", document.id);
				Document dbDocument = query.findOne();
				if (dbDocument.filePath != null && (file = new File(dbDocument.filePath)).exists()) {
					file.delete();
				}
				query.delete();
			} else {
				Query<Document> query = Ebean.find(Document.class);
				query.where().eq("id", document.id);
				Document dbDocument = query.findOne();
				if (dbDocument == null) {
					create(model, ref);
				} else if (saveFile(document)) {
					if (dbDocument.filePath != null && (file = new File(dbDocument.filePath)).exists()) {
						file.delete();
					}
					dbDocument.filePath = document.filePath;
					dbDocument.file = document.file;
					dbDocument.update();
				}
			}
		}
	}

	public static void delete(BaseModel model) throws IOException {
		Document document = model.getDocument();
		if (document != null) {
			Ebean.find(Document.class).where().eq("id", document.id).delete();
		}
		model.setDocument(null);
	}
}