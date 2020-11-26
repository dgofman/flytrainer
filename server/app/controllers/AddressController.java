package controllers;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Transaction;
import models.AbstractBase.Short;
import models.Address;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.DocumentUtils;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class AddressController extends BaseController {

	public Result getAddress(Long userId) {
		log.debug("AddressController::getAddress for user=" + userId);
		try {
			List<Address> addresses = Ebean.find(Address.class).where().eq("user", new User(userId)).findList();
			return okResult(addresses, Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}
	
	public Result getAddressById(Long id) {
		log.debug("AddressController::getAddressById for id=" + id);
		try {
			Address address = Ebean.find(Address.class).where().eq("id", id).findOne();
			return okResult(address, Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result addAddress(Http.Request request, Long userId) {
		log.debug("AddressController::addAddress for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Address address = Json.fromJson(body, Address.class);
			if (address.isPrimary == 1) {
				Ebean.find(Address.class).asUpdate().set("isPrimary", 0) .where().eq("user", user).update();
			}
			NotesUtils.create(address, user);
			DocumentUtils.create(address, user);
			address.user = user;
			address.save(currentUser);
			transaction.commit();
			return okResult(address, Short.class);
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
			User user = new User(userId);
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
			NotesUtils.update(dbAddress, user, currentUser);
			DocumentUtils.update(dbAddress, user, currentUser);
			dbAddress.save(currentUser);
			transaction.commit();
			return okResult(dbAddress, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result deleteAddress(Http.Request request, Long userId, Long addressId) {
		log.debug("AddressController::deleteAddress id=" + addressId + ", for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Address dbAddress = Ebean.find(Address.class).where().eq("id", addressId).findOne();
			if (dbAddress == null) {
				return createBadRequest("noaddress", Constants.Errors.ERROR);
			}
			if (dbAddress.reference != null) {
				Ebean.find(Class.forName("models." + dbAddress.reference)).asUpdate().set("address", null)
					.where()
					.eq("address", dbAddress)
					.eq("user", dbAddress.user).update();
			}
			dbAddress.delete(currentUser);
			NotesUtils.delete(dbAddress);
			DocumentUtils.delete(dbAddress);
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