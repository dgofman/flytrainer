package utils;

import java.io.IOException;

import io.ebean.Ebean;
import models.Aircraft;
import models.BaseModel;
import models.Note;
import models.User;

public class NotesUtils {

	public static <T> void create(BaseModel model, T ref) throws IOException {
		Note notes = model.getNotes();
		if (notes == null || notes.content == null || notes.content.isBlank()) {
			model.setNotes(null);
		} else {
			if (ref instanceof User) {
				notes.user = (User) ref;
			} else {
				notes.aircraft = (Aircraft) ref;
			}
			notes.type = model.getClass().getSimpleName();
			notes.save();
		}
	}

	public static <T>  void update(BaseModel model, T ref, User currentUser) throws IOException {
		Note notes = model.getNotes();
		if (notes != null) {
			if (notes.id != null) {
				if (notes.content == null || notes.content.isBlank()) {
					model.setNotes(null);
					model.update(currentUser);
					Ebean.find(Note.class).where().eq("id", notes.id).delete();
				} else {
					Ebean.find(Note.class).asUpdate().set("content", notes.content).where().eq("id", notes.id).update();
				}
			} else if (notes.content != null && !notes.content.isBlank()) {
				create(model, ref);
			}
		}
	}

	public static void delete(BaseModel model) throws IOException {
		Note notes = model.getNotes();
		if (notes != null) {
			Ebean.find(Note.class).where().eq("id", notes.id).delete();
		}
		model.setNotes(null);
	}
}