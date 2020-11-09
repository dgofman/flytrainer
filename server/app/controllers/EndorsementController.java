package controllers;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Query;
import io.ebean.Transaction;
import models.AbstractBase.Short;
import models.BaseModel;
import models.Endorsement;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.DocumentUtils;
import utils.Constants.Access;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class EndorsementController extends BaseController {

	public Result getEndorsements(Long userId, Integer offset, Integer rows) {
		log.debug("EndorsementController::getEndorsements for user=" + userId);
		try {
			Query<Endorsement> query = Ebean.find(Endorsement.class);
			query.where().eq("user", new User(userId));
			int total = query.findCount();
			List<Endorsement> endorsements = query.setFirstRow(offset).setMaxRows(rows).findList();
			return okResult(new TableResult(offset, total, endorsements), BaseModel.Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result addEndorsement(Http.Request request, Long userId) {
		log.debug("EndorsementController::addEndorsement for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Endorsement endorsement = Json.fromJson(body, Endorsement.class);
			NotesUtils.create(endorsement, user);
			DocumentUtils.create(endorsement, user);
			endorsement.user = user;
			endorsement.save(currentUser);
			transaction.commit();
			return okResult(endorsement, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			transaction.end();
		}
	}

	public Result updateEndorsement(Http.Request request, Long userId) {
		log.debug("EndorsementController::updateEndorsement for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Endorsement endorsement = Json.fromJson(body, Endorsement.class);
			Endorsement dbEndorsement = Ebean.find(Endorsement.class).where().eq("id", endorsement.id).findOne();
			if (dbEndorsement == null) {
				return createBadRequest("noendorsement", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbEndorsement).readValue(body);
			NotesUtils.update(dbEndorsement, user, currentUser);
			DocumentUtils.update(dbEndorsement, user, currentUser);
			dbEndorsement.save(currentUser);
			transaction.commit();
			return okResult(dbEndorsement, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			transaction.end();
		}
	}

	public Result deleteEndorsement(Http.Request request, Long userId, Long endorsementId) {
		log.debug("EndorsementController::deleteEndorsement id=" + endorsementId + ", for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Endorsement dbEndorsement = Ebean.find(Endorsement.class).where().eq("id", endorsementId).findOne();
			if (dbEndorsement == null) {
				return createBadRequest("noendorsement", Constants.Errors.ERROR);
			}
			NotesUtils.delete(dbEndorsement);
			DocumentUtils.delete(dbEndorsement);
			dbEndorsement.delete(currentUser);
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