package controllers;

import java.time.Instant;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Joiner;

import io.ebean.DuplicateKeyException;
import io.ebean.Ebean;
import models.DDoS;
import models.User;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import utils.AppConfig;
import utils.AuthenticationUtils;
import utils.Constants;
import utils.Constants.Errors;
import utils.Constants.Key;
import utils.MailServer;

//@BasicAuth()
public class HomeController extends Controller {
	
	private static final int LOGIN_ATTEMPTS = AppConfig.get(Key.LOGIN_ATTEMPTS).asInt();
	private static final int LOCKED_TIME = AppConfig.get(Key.LOCKED_TIME).asInt();
	private static final boolean CREATE_ACCOUNT = AppConfig.get(Key.CREATE_ACCOUNT).asBoolean();
	private static final boolean RESET_PASSWORD = AppConfig.get(Key.RESET_PASSWORD).asBoolean();

	private static final String USER_ATTR = "u";
	private static final String VERSION_ATTR = "v";
	private static final String TOKEN_ATTR = "t";
	private static final String DATE_ATTR = "d";

	private static final Logger log = LoggerFactory.getLogger(HomeController.class);
	
	public Result login(Http.Request request) {
		JsonNode body = request.body().asJson();
		String username = body.get("userid").asText();
		Result result = checkDDoS(request, body, username);
		if (result != null) {
			return result;
		}

		try {
			User user = AuthenticationUtils.authenticate(username, body.get("passwd").asText());
			if (user.resetPassword == 1) {
				JsonNode pwd = body.get("new_passwd");
				if (pwd == null || pwd.asText().isEmpty()) {
					return status(ACCEPTED, "{\"token\": null}");
				} else {
					user.password = pwd.asText();
					user.resetPassword = 0;
					user.save();
				}
			}
			Calendar c = Calendar.getInstance();
			c.add(Calendar.HOUR, AppConfig.get(Key.EXPIRE_ACTIVATION).asInt());
			String authToken = AuthenticationUtils.createToken(user, c.getTime());
			return ok("{\"token\":\"" + authToken + "\"}");
		} catch (IllegalAccessException e) {
			DDoS ddos = new DDoS(request, body, username).commit();
			log.error("IP Address: " + ddos.ipaddress + ", UserName: " + username + ", Error: " + e.getMessage());
			return unauthorized(e.getMessage());
		}
	}

	public Result reset(Http.Request request) {
		JsonNode body = request.body().asJson();
		Result result = checkClientId(body);
		if (result != null) {
			return result;
		}
		return ok("OK");
	}

	public Result create(Http.Request request) {
		JsonNode body = request.body().asJson();
		Result result = checkClientId(body);
		if (result != null) {
			return result;
		}
		User user = new User(body);
		int count = Ebean.find(User.class).findCount();
		if (count == 0) {
			user.role = Constants.Access.ADMIN;
		} else if (!CREATE_ACCOUNT) {
			return notAcceptable(Errors.ACCESS_DENIED.toString());
		}
		try {
			user.save();
		} catch (Exception ex) {
			if (ex instanceof DuplicateKeyException) {
				return badRequest(Constants.Errors.USERNAME.toString());
			} else {
				return badRequest(Constants.Errors.ERROR.toString());
			}
		}
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MINUTE, AppConfig.get(Key.EXPIRE_TOKEN).asInt());
		String authToken = AuthenticationUtils.createToken(user, c.getTime());
		log.debug("Send activatation token: " +user.email + ", authToken=" + authToken);
		String origin = "";
		if (request.getHeaders().get("Origin").isPresent()) {
			origin = request.getHeaders().get("Origin").get();
		}
		try {
			@SuppressWarnings("serial")
			Map<String, Object> params = new LinkedHashMap<String, Object>(){{
				put(USER_ATTR, user.username);
				put(VERSION_ATTR, user.version);
				put(TOKEN_ATTR, authToken);
				put(DATE_ATTR, user.modifiedDate.toEpochMilli());
			}};
			String emailBody = String.format(Constants.createAccountMessage, user.firstname, user.lastname, origin + "/activate?" + Joiner.on("&").withKeyValueSeparator("=").join(params));
			MailServer.sendMail(user.email, "Activate your account", emailBody);
		} catch (Exception e) {
			return badRequest(Constants.Errors.ERROR.toString());
		}
		return ok();
	}

	public Result activate(Http.Request request) {
		JsonNode body = request.body().asJson();
		DecodedJWT jwt = AuthenticationUtils.validateToken(body.get(TOKEN_ATTR).asText(), body.get(USER_ATTR).asText());
		if (jwt == null) {
			log.error("Invalid token=" + request.path());
			return forbidden(Constants.Errors.FORBIDDEN.toString());
		}

		String username = body.get(USER_ATTR).asText();
		try {
			Result result = checkDDoS(request, body, username);
			if (result != null) {
				return result;
			}

			User user = Ebean.createNamedQuery(User.class, User.FIND)
					.setParameter("username", jwt.getSubject())
					.setParameter("uuid", jwt.getKeyId())
					.setParameter("version", jwt.getClaim(VERSION_ATTR).asLong())
					.setParameter("modifiedDate", Instant.ofEpochMilli(body.get(DATE_ATTR).asLong())).findOne();
			if (user == null) {
				log.error("Invalid version or timestamp=" + body.get(DATE_ATTR).asLong());
				return forbidden(Constants.Errors.FORBIDDEN.toString());
			}
			user.isActive = 1;
			user.currentUserId = user.id;
			user.update();
		} catch (Exception ex) {
			DDoS ddos = new DDoS(request, body,  username).commit();
			log.error("IP Address: " + ddos.ipaddress + ", UserName: " + username + ", Error: " + ex.getMessage());
			return badRequest(Constants.Errors.ERROR.toString());
		}
		return ok();
	}

	public Result initDatabase() {
		Ebean.find(User.class).findCount();
		return ok("Compiled successfully.");
	}
	
	private Result checkClientId(JsonNode body) {
		if (!AuthenticationUtils.validateClientId(body.get("cid").asText())) {
			log.error(body.toPrettyString());
			return forbidden(Constants.Errors.FORBIDDEN.toString());
		}
		return null;
	}

	private Result checkDDoS(Http.Request request, JsonNode body, String username) {
		Result result = checkClientId(body);
		if (result != null) {
			return result;
		}

		String clientIp = AuthenticationUtils.getClientIpAddress(request,body);
		log.debug("IP Address: " + clientIp + ", UserName: " + username);

		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MINUTE, -LOCKED_TIME);
		DDoS ddos = Ebean.createNamedQuery(DDoS.class, DDoS.FIND)
				.setParameter("clientIp", clientIp)
				.setParameter("username", username)
				.setParameter("date", cal.getTime()).findOne();
		if (ddos != null) {
			if (ddos.totalCount >= LOGIN_ATTEMPTS) { // count(*)
				return status(LOCKED, String.format(Errors.LOCKED.toString(), LOCKED_TIME));
			}
			if (ddos.maxPermanently != null && ddos.maxPermanently != 0) { // count(*)
				return status(LOCKED, Errors.DISABLED.toString());
			}
		}
		return null;
	}
}