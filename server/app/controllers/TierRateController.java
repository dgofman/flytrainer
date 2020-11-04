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
import models.Tier;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class TierRateController extends BaseController {

	private static final int ALL_MAX_LIMIT = 10000;

	public Result addTier(Http.Request request) {
		log.debug("TierRateController::addtTier");
		User currentTier = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			JsonNode body = request.body().asJson();
			Tier user = Json.fromJson(body, Tier.class);
			NotesUtils.create(user, user);
			user.save(currentTier);
			transaction.commit();
			return okResult(user, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result getTiers(Http.Request request) {
		log.debug("TierRateController::getTiers");
		try {
			JsonNode body = request.body().asJson();
			FTTableEvent event = new ObjectMapper().readerFor(FTTableEvent.class).readValue(body);
			Query<Tier> query = Ebean.find(Tier.class);
			int total = findCount(event, query, Tier.class);
			Set<String> columns = new LinkedHashSet<>();
			columns.add("id");
			prepareQuery(event, query, columns, Tier.class);
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
			FilterProvider filter = new SimpleFilterProvider().addFilter("TierFilter", SimpleBeanPropertyFilter.filterOutAllExcept(columns));
			return okResult(new TableResult(event.first, total, query.findList()), filter);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result updateTier(Http.Request request) {
		log.debug("TierRateController::updateTier");
		User currentTier = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			JsonNode body = request.body().asJson();
			Tier user = Json.fromJson(body, Tier.class);
			Tier dbTier = Ebean.find(Tier.class).where().eq("id", user.id).findOne();
			if (dbTier == null) {
				return createBadRequest("notier", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbTier).readValue(body);
			NotesUtils.update(dbTier, user, currentTier);
			dbTier.save(currentTier);
			transaction.commit();
			return okResult(dbTier, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}
	
	public Result deleteTier(Http.Request request, Long tierId) {
		log.debug("TierRateController::deleteTier id=" + tierId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Tier dbTier = Ebean.find(Tier.class).where().eq("id", tierId).findOne();
			if (dbTier == null) {
				return createBadRequest("notier", Constants.Errors.ERROR);
			}
			NotesUtils.delete(dbTier);
			dbTier.delete(currentUser);
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
