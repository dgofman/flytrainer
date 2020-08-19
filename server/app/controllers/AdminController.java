package controllers;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Query;
import models.BaseModel;
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

	public Result users(Http.Request request, Integer startIndex, Integer rows, String sortBy, String sortDirection,
			String filterColumnName, String filterQuery) {
		Query<User> query = Ebean.find(User.class);
		if (!StringUtils.isEmpty(filterColumnName) && !StringUtils.isEmpty(filterColumnName)) {
			query.where().like(filterColumnName, filterQuery);
		}
		if (!StringUtils.isEmpty(sortBy) && !StringUtils.isEmpty(sortDirection)) {
			if ("desc".equals(sortDirection)) {
				query.orderBy().desc(sortBy);
			} else {
				query.orderBy().asc(sortBy);
			}
		}
		query.setFirstRow(startIndex);
		query.setMaxRows(rows != -1 ? rows : ALL_MAX_LIMIT);
		return okResult(User.class, query.findList());
	}

	public Result userById(Long userId) {
		Query<User> query = Ebean.find(User.class);
		query.where().eq("id", userId);
		User user = query.findOne();
		if (user == null) {
			return createBadRequest("nouser", Constants.Errors.ERROR);
		}
		return okResult(BaseModel.Short.class, user);
	}

	public Result saveUser(Http.Request request) {
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
			return okResult(User.class, user);
		} catch (Exception e) {
			return badRequest(e);
		}
	}
	
	public Result deleteUser(Http.Request request, Long userId) {
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
		return okResult(BaseModel.Short.class, user);
	}
	
	
	private void validateRole(User user, User currentUser) {
		if (user.role != Constants.Access.ADMIN && 
			(user.id == currentUser.id && user.role != currentUser.role) &&
			(user.role.getLevel() > currentUser.role.getLevel())) {
			throw new RuntimeException(Constants.Errors.ACCESS_DENIED.name());
		}
	}
}
