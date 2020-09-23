package controllers;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Query;
import io.ebean.Transaction;
import models.Address;
import models.Note;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class AddressController extends BaseController {

	public Result getAddress(Long userId) {
		log.debug("AddressController::getAddress for user=" + userId);
		try {
			List<Address> addresses = Ebean.createNamedQuery(Address.class, Address.FIND_BY_USERID)
					.setParameter("userId", userId).findList();
			return okResult(addresses);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result addAddress(Http.Request request, Long userId) {
		log.debug("AddressController::addAddress for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Query<User> query = Ebean.find(User.class);
			query.where().eq("id", userId);
			User user = query.findOne();
			if (user == null) {
				return createBadRequest("nouser", Constants.Errors.ERROR);
			}
			JsonNode body = request.body().asJson();
			Address address = Json.fromJson(body, Address.class);
			if (address.isPrimary == 1) {
				Ebean.find(Address.class).asUpdate().set("isPrimary", 0) .where().eq("user", user).update();
			}
			saveNotes(address, user, null);
			address.user = user;
			address.save(currentUser);
			transaction.commit();
			return okResult(address);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result updateAddress(Http.Request request, Long userId) {
		log.debug("AddressController::updateAddress for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			JsonNode body = request.body().asJson();
			Address address = Json.fromJson(body, Address.class);
			Address dbAddress = Ebean.find(Address.class).where().eq("id", address.id).findOne();
			if (dbAddress == null) {
				return createBadRequest("noaddress", Constants.Errors.ERROR);
			}
			if (dbAddress.isPrimary == 0 && address.isPrimary == 1) {
				Ebean.find(Address.class).asUpdate().set("isPrimary", 0).where().eq("user", dbAddress.user).update();
			}
			new ObjectMapper().readerForUpdating(dbAddress).readValue(body);
			boolean deleteNotes = isDeleteNotes(dbAddress);
			if (deleteNotes) {
				dbAddress.update(currentUser);
				saveNotes(address.getNotes(), deleteNotes);
			} else {
				saveNotes(dbAddress.getNotes(), deleteNotes);
				dbAddress.update(currentUser);
			}
			transaction.commit();
			return okResult(dbAddress);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result deleteAddress(Http.Request request, Long userId, Integer addressId) {
		log.debug("AddressController::deleteAddress id=" + addressId + ", for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Address address = Ebean.find(Address.class).where().eq("id", addressId).findOne();
			if (address == null) {
				return createBadRequest("noaddress", Constants.Errors.ERROR);
			}
			Note notes = address.getNotes();
			address.setNotes(null);
			address.delete(currentUser);
			saveNotes(notes, true);
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