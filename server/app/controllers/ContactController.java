package controllers;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Query;
import io.ebean.Transaction;
import models.AbstractBase.Short;
import models.BaseModel;
import models.Contact;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.AddressUtils;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class ContactController extends BaseController {
	
	public Result getContacts(Long userId, Integer offset, Integer rows) {
		log.debug("ContactController::getContacts for user=" + userId);
		try {
			Query<Contact> query = Ebean.find(Contact.class);
			query.where().eq("user", new User(userId));
			int total = query.findCount();
			List<Contact> contacts = query.setFirstRow(offset).setMaxRows(rows).findList();
			return okResult(new TableResult(offset, total, contacts), BaseModel.Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result addContact(Http.Request request, Long userId) {
		log.debug("ContactController::addContact for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Contact contact = Json.fromJson(body, Contact.class);
			NotesUtils.create(contact, user);
			AddressUtils.create(contact, user, currentUser);
			contact.user = user;
			contact.save(currentUser);
			transaction.commit();
			return okResult(contact, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result updateContact(Http.Request request, Long userId) {
		log.debug("ContactController::updateContact for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Contact contact = Json.fromJson(body, Contact.class);
			Contact dbContact = Ebean.find(Contact.class).where().eq("id", contact.id).findOne();
			if (dbContact == null) {
				return createBadRequest("nocontact", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbContact).readValue(body);
			NotesUtils.update(dbContact, user, currentUser);
			AddressUtils.update(dbContact, user, currentUser);
			dbContact.save(currentUser);
			transaction.commit();
			return okResult(dbContact, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result deleteContact(Http.Request request, Long userId, Long contactId) {
		log.debug("ContactController::deleteContact id=" + contactId + ", for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Contact dbContact = Ebean.find(Contact.class).where().eq("id", contactId).findOne();
			if (dbContact == null) {
				return createBadRequest("nocontact", Constants.Errors.ERROR);
			}
			dbContact.delete(currentUser);
			AddressUtils.delete(dbContact);
			NotesUtils.delete(dbContact);
			transaction.commit();
			return ok();
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}
}