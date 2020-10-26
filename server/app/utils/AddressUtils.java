package utils;

import java.io.IOException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import models.Address;
import models.Aircraft;
import models.BaseModel;
import models.Address.IsAddressable;
import models.User;
import play.libs.Json;

public class AddressUtils {

	public static <T> void create(IsAddressable model, T ref, User currentUser) throws IOException {
		Address address = model.getAddress();
		if (address != null) {
			if (ref instanceof User) {
				address.user = (User) ref;
			} else {
				address.aircraft = (Aircraft) ref;
			}
			address.reference = model.getClass().getSimpleName();
			address.save(currentUser);
		}
	}

	public static <T> void update(IsAddressable model, T ref, User currentUser) throws IOException {
		Address address = model.getAddress();
		if (address != null) {
			if (address.id != null) {
				Ebean.update(model);
				//new ObjectMapper().readerForUpdating(dbAddress).readValue(body);
				//model.save(currentUser);
				
				/*if (address.content == null || address.content.isBlank()) {
					model.setAddress(null);
					model.update(currentUser);
					Ebean.find(Address.class).where().eq("id", address.id).delete();
				} else {
					Ebean.find(Address.class).asUpdate().set("content", address.content).where().eq("id", address.id).update();
				}*/
			} else {
				create(model, ref, currentUser);
			}
		}
		
		/*Address address = model.getAddress();
		if (address.id != null) {
			Address dbAddress = Ebean.find(Address.class).where().eq("id", address.id).findOne();
			if (dbAddress != null) {
				new ObjectMapper().readerForUpdating(dbAddress).readValue(body);
				dbAddress.save(currentUser);
				return dbAddress;
			}
		}
		return create(model, ref, currentUser);*/
	}

	public static void delete(IsAddressable model) throws IOException {
		Address address = model.getAddress();
		if (address != null) {
			Ebean.find(Address.class).where().eq("id", address.id).delete();
		}
		model.setAddress(null);
	}
}