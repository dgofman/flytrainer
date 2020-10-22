package utils;

import java.io.IOException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import models.Address;
import models.Aircraft;
import models.BaseModel;
import models.User;
import play.libs.Json;

public class AddressUtils {

	public static <T> Address create(BaseModel model, JsonNode body, T ref, User currentUser) throws IOException {
		Address address = null;
		if (body != null && !body.isNull()) {
			address = Json.fromJson(body, Address.class);
			if (ref instanceof User) {
				address.user = (User) ref;
			} else {
				address.aircraft = (Aircraft) ref;
			}
			address.reference = model.getClass().getSimpleName();
			address.save(currentUser);
		}
		return address;
	}

	public static <T> Address update(BaseModel model, JsonNode body,  T ref, User currentUser) throws IOException {
		if (body != null && !body.isNull()) {
			Address address = Json.fromJson(body, Address.class);
			if (address.id != null) {
				Address dbAddress = Ebean.find(Address.class).where().eq("id", address.id).findOne();
				if (dbAddress != null) {
					new ObjectMapper().readerForUpdating(dbAddress).readValue(body);
					dbAddress.save(currentUser);
					return dbAddress;
				}
			}
			return create(model, body, ref, currentUser);
		}
		return null;
	}

	public static void delete(Address address) {
		if (address != null) {
			Ebean.find(Address.class).where().eq("id", address.id).delete();
			address.id = null;
		}
	}
}