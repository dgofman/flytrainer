package controllers;

import org.springframework.util.StringUtils;

import io.ebean.Ebean;
import io.ebean.Query;
import models.BaseModel;
import models.User;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;

@BasicAuth({Access.ADMIN, Access.MANAGER})
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
		return okResult(BaseModel.Full.class, user);
	}
}
