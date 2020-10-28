package utils;

import java.io.IOException;

import io.ebean.Ebean;
import models.Address;
import models.Address.IsAddressable;
import models.Aircraft;
import models.User;

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
			} else {
				create(model, ref, currentUser);
			}
		}
	}

	public static void delete(IsAddressable model) throws IOException {
		Address address = model.getAddress();
		if (address != null) {
			Ebean.find(Address.class).where().eq("id", address.id).delete();
		}
		model.setAddress(null);
	}
}