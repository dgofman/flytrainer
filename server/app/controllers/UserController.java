package controllers;

import java.util.LinkedHashSet;
import java.util.Set;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;

import org.springframework.util.StringUtils;

import io.ebean.Ebean;
import io.ebean.Query;
import models.AbstractBase.Short;
import models.AbstractBase.Full;
import models.FTTableEvent;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class UserController extends BaseController {

	private static final int ALL_MAX_LIMIT = 10000;

	public Result addUser(Http.Request request) {
		log.debug("UserController::addtUser");
		Query<User> query = Ebean.find(User.class);
		User user = query.findOne();
		if (user == null) {
			return createBadRequest("nouser", Constants.Errors.ERROR);
		}
		return okResult(user, Short.class);
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
		return okResult(user, Full.class);
	}

	public Result updateUser(Http.Request request, Long userId) {
		log.debug("UserController::updateUser = " + userId);
		User currentUser = request.attrs().get(User.MODEL);
		JsonNode body = request.body().asJson();
		try {
			RequiredField require = requiredFields(body);
			User user;
			if (require.id == -1) { // create
				user = Json.fromJson(body, User.class);
				user.id = null;
				validateRole(user, currentUser);
				user.save(currentUser);
			} else {
				Query<User> query = Ebean.find(User.class);
				query.where().eq("id", require.id).eq("version", require.version);
				user = query.findOne();
				if (user == null) {
					return createBadRequest("nouser", Constants.Errors.ERROR);
				}
				new ObjectMapper().readerForUpdating(user).readValue(body);
				validateRole(user, currentUser);
				user.update(currentUser);
			}
			return okResult(user, User.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	private void validateRole(User user, User currentUser) {
		if ((user.id == currentUser.id && 
			(user.role != currentUser.role || user.isActive == 0)) || 
			user.role.getType() > currentUser.role.getType()) {
			throw new RuntimeException(Constants.Errors.ACCESS_DENIED.name());
		}
	}
}
