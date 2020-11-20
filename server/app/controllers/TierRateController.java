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

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class TierRateController extends BaseController {

	public Result addTier(Http.Request request) {
		log.debug("TierRateController::addtTier");
		User currentTier = request.attrs().get(User.MODEL);
		try {
			JsonNode body = request.body().asJson();
			Tier tier = Json.fromJson(body, Tier.class);
			tier.save(currentTier);
			return okResult(tier, Short.class);
		} catch (Exception e) {
			return badRequest(e);
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
			query.setMaxRows(event.total != -1 ? event.total : Constants.ALL_MAX_LIMIT);
			FilterProvider filter = new SimpleFilterProvider().addFilter("TierFilter", SimpleBeanPropertyFilter.filterOutAllExcept(columns));
			return okResult(new TableResult(event.first, total, query.findList()), filter);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result updateTier(Http.Request request) {
		log.debug("TierRateController::updateTier");
		User currentTier = request.attrs().get(User.MODEL);
		try {
			JsonNode body = request.body().asJson();
			Tier tier = Json.fromJson(body, Tier.class);
			Tier dbTier = Ebean.find(Tier.class).where().eq("id", tier.id).findOne();
			if (dbTier == null) {
				return createBadRequest("notier", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbTier).readValue(body);
			dbTier.save(currentTier);
			return okResult(dbTier, Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}
	
	public Result deleteTier(Http.Request request, Long tierId) {
		log.debug("TierRateController::deleteTier id=" + tierId);
		User currentUser = request.attrs().get(User.MODEL);
		try {
			Tier dbTier = Ebean.find(Tier.class).where().eq("id", tierId).findOne();
			if (dbTier == null) {
				return createBadRequest("notier", Constants.Errors.ERROR);
			}
			dbTier.delete(currentUser);
			return ok();
		} catch (Exception e) {
			return badRequest(e);
		}
	}
}
