package controllers;

import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;

import io.ebean.Ebean;
import io.ebean.Query;
import io.ebean.Transaction;
import models.AbstractBase.Short;
import models.FTTableEvent;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.AddressUtils;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.DocumentUtils;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class UserController extends BaseController {

	private static final int ALL_MAX_LIMIT = 10000;

	public Result addUser(Http.Request request) {
		log.debug("UserController::addtUser");
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			JsonNode body = request.body().asJson();
			User user = Json.fromJson(body, User.class);
			NotesUtils.create(user, user);
			DocumentUtils.create(user, user);
			AddressUtils.create(user, user, currentUser);
			user.save(currentUser);
			transaction.commit();
			return okResult(user, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result getUsers(Http.Request request) {
		log.debug("UserController::getUsers");
		try {
			JsonNode body = request.body().asJson();
			FTTableEvent event = new ObjectMapper().readerFor(FTTableEvent.class).readValue(body);
			Query<User> query = Ebean.find(User.class);
			int total = findCount(event, query, User.class);
			Set<String> columns = new LinkedHashSet<>();
			columns.add("id");
			prepareQuery(event, query, columns, User.class);
			query.select(String.join(",", columns));
			if (!StringUtils.isEmpty(event.sortField) && !StringUtils.isEmpty(event.sortOrder)) {
				if ("desc".equals(event.sortOrder)) {
					query.orderBy().desc(event.sortField);
				} else {
					query.orderBy().asc(event.sortField);
				}
			}
			query.setFirstRow(event.first);
			query.setMaxRows(event.total != -1 ? event.total : ALL_MAX_LIMIT);
			FilterProvider filter = new SimpleFilterProvider().addFilter("UserFilter", SimpleBeanPropertyFilter.filterOutAllExcept(columns));
			return okResult(new TableResult(event.first, total, query.findList()), filter);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result getUser(Long userId) {
		log.debug("UserController::getUser = " + userId);
		Query<User> query = Ebean.find(User.class);
		query.where().eq("id", userId);
		User user = query.findOne();
		if (user == null) {
			return createBadRequest("nouser", Constants.Errors.ERROR);
		}
		return okResult(user, Short.class);
	}

	public Result updateUser(Http.Request request, Long userId) {
		log.debug("UserController::updateUser for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			JsonNode body = request.body().asJson();
			User user = Json.fromJson(body, User.class);
			User dbUser = Ebean.find(User.class).where().eq("id", user.id).findOne();
			if (dbUser == null) {
				return createBadRequest("nouser", Constants.Errors.ERROR);
			}
			validateRole(user, currentUser);
			new ObjectMapper().readerForUpdating(dbUser).readValue(body);
			NotesUtils.update(dbUser, user, currentUser);
			DocumentUtils.update(dbUser, user, currentUser);
			AddressUtils.update(dbUser, user, currentUser);
			dbUser.save(currentUser);
			transaction.commit();
			return okResult(dbUser, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result getPassword(Http.Request request, Long userId, String username) {
		log.debug("UserController::getPassword for user=" + userId + ", username=" + username);
		User currentUser = request.attrs().get(User.MODEL);
		if (currentUser.role != Constants.Access.ADMIN) {
			return status(Http.Status.NOT_ACCEPTABLE, Constants.Errors.ACCESS_DENIED.toString());
		}
		User dbUser = Ebean.createNamedQuery(User.class, User.PASSWORD)
				.setParameter("username", username)
				.setParameter("id", userId).findOne();
		if (dbUser == null) {
			return createBadRequest("nouser", Constants.Errors.ERROR);
		}
		return okResult(dbUser.password);
	}

	private void validateRole(User user, User currentUser) {
		if ((user.id == currentUser.id && 
			(user.role != currentUser.role || user.isActive == 0)) || 
			user.role.getType() > currentUser.role.getType()) {
			throw new RuntimeException(Constants.Errors.ACCESS_DENIED.name());
		}
	}
}
