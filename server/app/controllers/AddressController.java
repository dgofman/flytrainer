package controllers;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Query;
import models.Address;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class AddressController extends BaseController {

	public Result addAddress(Http.Request request, Long userId) {
		log.debug("AddressController::addAddress for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
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
			address.user = user;
			address.save(currentUser);
			return okResult(address);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

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

	public Result updateAddress(Http.Request request, Long userId) {
		log.debug("AddressController::updateAddress for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		try {
			JsonNode body = request.body().asJson();
			Address address = Json.fromJson(body, Address.class);
			Address dbAddress = Ebean.find(Address.class).where().eq("id", address.id).findOne();
			if (dbAddress == null) {
				return createBadRequest("noaddress", Constants.Errors.ERROR);
			}
			if (address.isPrimary == 1) {
				Ebean.find(Address.class).asUpdate().set("isPrimary", 0) .where().eq("user", dbAddress.user).update();
			}
			new ObjectMapper().readerForUpdating(dbAddress).readValue(body);
			dbAddress.update(currentUser);
			return okResult(dbAddress);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result deleteAddress(Http.Request request, Long userId, Integer addressId) {
		log.debug("AddressController::deleteAddress id=" + addressId + ", for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		try {
			Address address = Ebean.find(Address.class).where().eq("id", addressId).findOne();
			if (address == null) {
				return createBadRequest("noaddress", Constants.Errors.ERROR);
			}
			address.delete(currentUser);
			return ok();
		} catch (Exception e) {
			return badRequest(e);
		}
	}
}