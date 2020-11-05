package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Query;
import io.ebean.Transaction;
import models.AbstractBase.Short;
import models.Account;
import models.BaseModel;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class AccountController extends BaseController {
	
	public Result getAccounts(Long userId) {
		log.debug("AccountController::getAccounts for user=" + userId);
		try {
			Query<Account> query = Ebean.find(Account.class);
			query.where().eq("user", new User(userId));
			return okResult(query.findList(), BaseModel.Default.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result addAccount(Http.Request request, Long userId) {
		log.debug("AccountController::addAccount for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Account account = Json.fromJson(body, Account.class);
			if (account.accountId == null) {
				Account dbAccount = Ebean.createNamedQuery(Account.class, Account.FIND).findOne();
				account.accountId = (dbAccount.maxAccountId == null ? Account.INITIAL_ACCOUNT_ID : dbAccount.maxAccountId) + 1;
			}
			NotesUtils.create(account, user);
			account.user = user;
			account.save(currentUser);
			transaction.commit();
			return okResult(account, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result updateAccount(Http.Request request, Long userId) {
		log.debug("AccountController::updateAccount for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Account account = Json.fromJson(body, Account.class);
			Account dbAccount = Ebean.find(Account.class).where().eq("id", account.id).findOne();
			if (dbAccount == null) {
				return createBadRequest("noaccount", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbAccount).readValue(body);
			NotesUtils.update(dbAccount, user, currentUser);
			dbAccount.save(currentUser);
			transaction.commit();
			return okResult(dbAccount, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result deleteAccount(Http.Request request, Long userId, Long accountId) {
		log.debug("AccountController::deleteAccount id=" + accountId + ", for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Account dbAccount = Ebean.find(Account.class).where().eq("id", accountId).findOne();
			if (dbAccount == null) {
				return createBadRequest("noaccount", Constants.Errors.ERROR);
			}
			NotesUtils.delete(dbAccount);
			dbAccount.delete(currentUser);
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