package controllers;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Query;
import models.BaseModel;
import models.FTTableEvent;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class AdminController extends BaseController {

	private static final int ALL_MAX_LIMIT = 10000;

	public Result users(Http.Request request) {
		log.debug("AdminController::users");
		try {
			JsonNode body = request.body().asJson();
			FTTableEvent event = new ObjectMapper().readerFor(FTTableEvent.class).readValue(body);
			Query<User> query = Ebean.find(User.class);
			fetch(event, query, User.class);
			/*if (!StringUtils.isEmpty(filterColumnName) && !StringUtils.isEmpty(filterColumnName)) {
				query.where().like(filterColumnName, filterQuery);
			}*/
			if (!StringUtils.isEmpty(event.sortField) && !StringUtils.isEmpty(event.sortOrder)) {
				if ("desc".equals(event.sortOrder)) {
					query.orderBy().desc(event.sortField);
				} else {
					query.orderBy().asc(event.sortField);
				}
			}
			query.setFirstRow(event.start);
			query.setMaxRows(event.total != -1 ? event.total : ALL_MAX_LIMIT);
			return okResult(query.findList());
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result userById(Long userId) {
		log.debug("AdminController::userById = " + userId);
		Query<User> query = Ebean.find(User.class);
		query.where().eq("id", userId);
		User user = query.findOne();
		if (user == null) {
			return createBadRequest("nouser", Constants.Errors.ERROR);
		}
		return okResult(user, BaseModel.Short.class);
	}

	public Result saveUser(Http.Request request, Long userId) {
		log.debug("AdminController::saveUser = " + userId);
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
	
	public Result deleteUser(Http.Request request, Long userId) {
		log.debug("AdminController::saveUser = " + userId);
		BaseModel currentUser = request.attrs().get(User.MODEL);
		Query<User> query = Ebean.find(User.class);
		query.where().eq("id", userId);
		User user = query.findOne();
		if (user == null) {
			return createBadRequest("nouser", Constants.Errors.ERROR);
		}
		if (user.id == currentUser.id) {
			return badRequest(Constants.Errors.DELETE_USER.toString());
		}
		user.delete(currentUser);
		return okResult(user, BaseModel.Short.class);
	}
	
	
	private void validateRole(User user, User currentUser) {
		if ((user.id == currentUser.id && 
			(user.role != currentUser.role || user.isActive == 0)) || 
			user.role.getType() > currentUser.role.getType()) {
			throw new RuntimeException(Constants.Errors.ACCESS_DENIED.name());
		}
	}
}
