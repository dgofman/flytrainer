package controllers;

import java.util.LinkedHashSet;
import java.util.List;
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
import models.BaseModel;
import models.Course;
import models.FTTableEvent;
import models.User;
import models.UserCourse;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.DocumentUtils;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class CourseController extends BaseController {

	public Result getCourses(Http.Request request) {
		log.debug("CourseController::getCourses");
		try {
			JsonNode body = request.body().asJson();
			FTTableEvent event = new ObjectMapper().readerFor(FTTableEvent.class).readValue(body);
			Query<Course> query = Ebean.find(Course.class);
			int total = findCount(event, query, Course.class);
			Set<String> columns = new LinkedHashSet<>();
			columns.add("id");
			prepareQuery(event, query, columns, Course.class);
			query.select(String.join(",", columns));
			if (!StringUtils.isEmpty(event.sortField) && !StringUtils.isEmpty(event.sortOrder)) {
				if ("desc".equals(event.sortOrder)) {
					query.orderBy().desc(event.sortField);
				} else {
					query.orderBy().asc(event.sortField);
				}
			}
			query.setFirstRow(event.first);
			query.setMaxRows(event.total != -1 ? event.total : Constants.ALL_MAX_LIMIT);
			FilterProvider filter = new SimpleFilterProvider().addFilter("CourseFilter",
					SimpleBeanPropertyFilter.filterOutAllExcept(columns));
			return okResult(new TableResult(event.first, total, query.findList()), filter);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result getUserCourses(Long userId, Integer offset, Integer rows) {
		log.debug("CourseController::getUserCourses for user=" + userId);
		try {
			Query<UserCourse> query = Ebean.find(UserCourse.class);
			query.where().eq("user", new User(userId));
			int total = query.findCount();
			List<UserCourse> contacts = query.setFirstRow(offset).setMaxRows(rows).findList();
			return okResult(new TableResult(offset, total, contacts), BaseModel.Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result createCourse(Http.Request request) {
		log.debug("CourseController::createCourse");
		User currentUser = request.attrs().get(User.MODEL);
		try {
			JsonNode body = request.body().asJson();
			Course course = Json.fromJson(body, Course.class);
			course.save(currentUser);
			return okResult(course, Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result addUserCourse(Http.Request request, Long userId, Long courseId) {
		log.debug("CourseController::addCourse for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			UserCourse course = Json.fromJson(body, UserCourse.class);
			NotesUtils.create(course, user);
			DocumentUtils.create(course, user);
			course.course = new Course(courseId);
			course.user = user;
			course.save(currentUser);
			transaction.commit();
			return okResult(course, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			transaction.end();
		}
	}

	public Result updateCourse(Http.Request request) {
		log.debug("CourseController::updateCourse");
		User currentUser = request.attrs().get(User.MODEL);
		try {
			JsonNode body = request.body().asJson();
			Course course = Json.fromJson(body, Course.class);
			Course dbCourse = Ebean.find(Course.class).where().eq("id", course.id).findOne();
			if (dbCourse == null) {
				return createBadRequest("nocourse", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbCourse).readValue(body);
			dbCourse.save(currentUser);
			return okResult(dbCourse, Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result updateUserCourse(Http.Request request, Long userId, Long courseId) {
		log.debug("CourseController::updateCourse for user=" + userId + ", courseId=" + courseId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			UserCourse dbCourse = Ebean.find(UserCourse.class).where().eq("user", user).eq("id", courseId).findOne();
			if (dbCourse == null) {
				return createBadRequest("nocourse", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbCourse).readValue(body);
			NotesUtils.update(dbCourse, user, currentUser);
			DocumentUtils.update(dbCourse, user, currentUser);
			dbCourse.save(currentUser);
			transaction.commit();
			return okResult(dbCourse, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			transaction.end();
		}
	}

	public Result deleteCourse(Http.Request request, Long courseId) {
		log.debug("CourseController::deleteCourse id=" + courseId);
		User currentUser = request.attrs().get(User.MODEL);
		try {
			Course dbCourse = Ebean.find(Course.class).where().eq("id", courseId).findOne();
			if (dbCourse == null) {
				return createBadRequest("nocourse", Constants.Errors.ERROR);
			}
			dbCourse.delete(currentUser);
			return ok();
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result deleteUserCourse(Http.Request request, Long userId, Long courseId) {
		log.debug("CourseController::deleteUserCourse for user=" + userId + ", courseId=" + courseId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			UserCourse dbCourse = Ebean.find(UserCourse.class).where().eq("user", new User(userId)).eq("id", courseId)
					.findOne();
			if (dbCourse == null) {
				return createBadRequest("nocourse", Constants.Errors.ERROR);
			}
			NotesUtils.delete(dbCourse);
			DocumentUtils.delete(dbCourse);
			dbCourse.delete(currentUser);
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