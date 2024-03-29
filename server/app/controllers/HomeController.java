package controllers;

import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Joiner;

import io.ebean.DuplicateKeyException;
import io.ebean.Ebean;
import models.AbstractBase.Short;
import models.Address;
import models.DDoS;
import models.Note;
import models.User;
import play.mvc.Http;
import play.mvc.Result;
import utils.AppConfig;
import utils.AuthenticationUtils;
import utils.Constants;
import utils.Constants.AddressType;
import utils.Constants.Errors;
import utils.Constants.Key;
import utils.MailServer;

public class HomeController extends BaseController {

	private static final int LOGIN_ATTEMPTS = AppConfig.get(Key.LOGIN_ATTEMPTS).asInt();
	private static final int LOCKED_TIME = AppConfig.get(Key.LOCKED_TIME).asInt();
	private static final boolean CREATE_ACCOUNT = AppConfig.get(Key.CREATE_ACCOUNT).asBoolean();
	private static final boolean FORGOT_PASSWORD = AppConfig.get(Key.FORGOT_PASSWORD).asBoolean();
	private static final String ACCOUNT_ACTIVATION = AppConfig.join(Key.ACCOUNT_ACTIVATION, "<br>");
	private static final String RESET_PASSWORD = AppConfig.join(Key.RESET_PASSWORD, "<br>");
	
	private static final String COMPANY_NAME = AppConfig.get(Key.COMPANY_NAME).asText();
	private static final String COMPANY_STATE = AppConfig.get(Key.COMPANY_STATE).asText();
	private static final String COMPANY_COUNTRY = AppConfig.get(Key.COMPANY_COUNTRY).asText();
	private static final String COMPANY_PHONE = AppConfig.get(Key.COMPANY_PHONE).asText();

	private static final String USER_ATTR = "u";
	private static final String VERSION_ATTR = "v";
	private static final String TOKEN_ATTR = "t";
	private static final String DATE_ATTR = "d";

	public Result login(Http.Request request) {
		JsonNode body = request.body().asJson();
		DDoS ddos;
		try {
			ddos = new DDoS(request, body, body.get("username").asText());
		} catch (Exception ex) {
			log.error(body.toPrettyString());
			return forbidden(Constants.Errors.FORBIDDEN.toString());
		}
		try {
			Result result = checkDDoS(request, body, ddos.username);
			if (result != null) {
				return result;
			}

			User user = AuthenticationUtils.authenticate(ddos.username, body.get("passwd").asText());
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
			ddos.status = DDoS.LOGGEDIN;
			ddos.save();
			@SuppressWarnings("serial")
			Map<String, Object> params = new LinkedHashMap<String, Object>() {
				{
					put(Constants.CORRELATION_ID, ddos.createdDate.toEpochMilli());
					put("token", authToken);
					put("id", user.id);
					put("firstname", user.first);
					put("lastname", user.last);
					put("role", user.role);
				}
			};
			return ok(Ebean.json().toJson(params));
		} catch (IllegalAccessException ex) {
			ddos.save();
			log.error("IP Address: " + ddos.ipaddress + ", UserName: " + ddos.username, ex);
			return unauthorized(ex.getMessage());
		}
	}

	public Result create(Http.Request request) {
		JsonNode body = request.body().asJson();
		Result result = checkClientId(body);
		if (result != null) {
			return result;
		}
		try {
			User user = new User(body);
			int count = Ebean.find(User.class).findCount();
			if (count == 0) { // allow to register at least one user
				user.role =  Constants.Access.ADMIN;
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
			// Create default address
			if (count == 0) { // allow to register at least one user
				Address address = new Address();
				address.isFavorite = 1;
				address.street = "";
				address.city = "";
				address.state = COMPANY_STATE;
				address.country = COMPANY_COUNTRY;
				address.phone = COMPANY_PHONE;
				address.description = COMPANY_NAME;
				address.type = AddressType.Business;
				address.save();
			}
			Calendar c = Calendar.getInstance();
			c.add(Calendar.MINUTE, AppConfig.get(Key.EXPIRE_TOKEN).asInt());
			String authToken = AuthenticationUtils.createToken(user, c.getTime());
			log.debug("Activatation token: " + user.email + ", authToken=" + authToken);
			String origin = "";
			if (request.getHeaders().get("Origin").isPresent()) {
				origin = request.getHeaders().get("Origin").get();
			}

			@SuppressWarnings("serial")
			Map<String, Object> params = new LinkedHashMap<String, Object>() {
				{
					put(USER_ATTR, user.username);
					put(VERSION_ATTR, user.version);
					put(TOKEN_ATTR, authToken);
					put(DATE_ATTR, user.modifiedDate.getTime());
				}
			};
			String emailBody = String.format(ACCOUNT_ACTIVATION, user.first, user.last,
					origin + request.getHeaders().get("SourceMap").get() + "activate?"
							+ Joiner.on("&").withKeyValueSeparator("=").join(params));
			MailServer.sendMail(user.email, "Activate your account", emailBody);
		} catch (Exception e) {
			return badRequest(Constants.Errors.ERROR.toString());
		}
		return ok();
	}

	public Result activate(Http.Request request) {
		JsonNode body = request.body().asJson();
		Token token = token(body);
		if (token.result != null) {
			return token.result;
		}

		String username = null;
		try {
			body.get(USER_ATTR).asText();
			Result result = checkDDoS(request, body, username);
			if (result != null) {
				return result;
			}

			User user = Ebean.createNamedQuery(User.class, User.FIND).setParameter("username", token.jwt.getSubject())
					.setParameter("uuid", token.jwt.getKeyId()).setParameter("version", body.get(VERSION_ATTR).asLong())
					.setParameter("modifiedDate", new Date(body.get(DATE_ATTR).asLong())).findOne();
			if (user == null) {
				log.error("Invalid version or timestamp=" + body.get(DATE_ATTR).asLong());
				return forbidden(Constants.Errors.FORBIDDEN.toString());
			}
			user.isActive = 1;
			user.modifiedDate = new Date();
			user.update();
		} catch (Exception ex) {
			DDoS ddos = new DDoS(request, body, username);
			ddos.save();
			log.error("IP Address: " + ddos.ipaddress + ", UserName: " + username, ex);
			return badRequest(Constants.Errors.ERROR.toString());
		}
		return ok();
	}

	public Result forgot(Http.Request request) {
		if (!FORGOT_PASSWORD) {
			return notAcceptable(Errors.ACCESS_DENIED.toString());
		}
		JsonNode body = request.body().asJson();
		String username = null, email = null;
		try {
			username = body.get("username").asText();
			email = body.get("email").asText();
			Result result = checkClientId(body);
			if (result != null) {
				return result;
			}
			String origin = "";
			if (request.getHeaders().get("Origin").isPresent()) {
				origin = request.getHeaders().get("Origin").get();
			}

			User user = Ebean.createNamedQuery(User.class, User.FIND_BY_EMAIL).setParameter("username", username)
					.setParameter("email", email).findOne();
			if (user == null) {
				throw new IllegalAccessException(Errors.INVALID_EMAIL.toString());
			}
			Calendar c = Calendar.getInstance();
			c.add(Calendar.MINUTE, AppConfig.get(Key.EXPIRE_TOKEN).asInt());
			String authToken = AuthenticationUtils.createToken(user, c.getTime());
			log.debug("Reset password token: " + user.email + ", authToken=" + authToken);
			@SuppressWarnings("serial")
			Map<String, Object> params = new LinkedHashMap<String, Object>() {
				{
					put(USER_ATTR, user.username);
					put(VERSION_ATTR, user.version);
					put(TOKEN_ATTR, authToken);
					put(DATE_ATTR, user.modifiedDate.getTime());
				}
			};
			String emailBody = String.format(RESET_PASSWORD, origin + request.getHeaders().get("SourceMap").get()
					+ "reset?" + Joiner.on("&").withKeyValueSeparator("=").join(params));
			MailServer.sendMail(user.email, "Password Reset", emailBody);
		} catch (Exception ex) {
			DDoS ddos = new DDoS(request, body, username);
			ddos.save();
			log.error("IP Address: " + ddos.ipaddress + ", UserName: " + username + ", Email: " + email, ex);
			return badRequest(ex.getMessage());
		}
		return ok();
	}

	public Result reset(Http.Request request) {
		JsonNode body = request.body().asJson();
		Token token = token(body);
		if (token.result != null) {
			return token.result;
		}

		String username = null;
		try {
			username = body.get(USER_ATTR).asText();
			Result result = checkDDoS(request, body, username);
			if (result != null) {
				return result;
			}

			User user = Ebean.createNamedQuery(User.class, User.FIND).setParameter("username", token.jwt.getSubject())
					.setParameter("uuid", token.jwt.getKeyId()).setParameter("version", body.get(VERSION_ATTR).asLong())
					.setParameter("modifiedDate", new Date(body.get(DATE_ATTR).asLong())).findOne();
			if (user == null) {
				log.error("Invalid version or timestamp=" + body.get(DATE_ATTR).asLong());
				return forbidden(Constants.Errors.FORBIDDEN.toString());
			}
			user.password = body.get("new_passwd").asText();
			user.modifiedDate = new Date();
			user.update();
		} catch (Exception ex) {
			DDoS ddos = new DDoS(request, body, username);
			ddos.save();
			log.error("IP Address: " + ddos.ipaddress + ", UserName: " + username, ex);
			return badRequest(Constants.Errors.ERROR.toString());
		}
		return ok();
	}

	public Result logout(Http.Request request) {
		JsonNode body = request.body().asJson();
		try {
			String token = body.get("token").asText();
			DecodedJWT jwt = AuthenticationUtils.validateToken(token);
			if (jwt == null) {
				log.error("Invalid token=" + token);
				return forbidden(Constants.Errors.FORBIDDEN.toString());
			}
			DDoS ddos = Ebean.createNamedQuery(DDoS.class, DDoS.VALIDATE).setParameter("username", jwt.getSubject())
					.setParameter("createdDate", new Date(body.get(Constants.CORRELATION_ID).asLong()))
					.findOne();
			if (ddos == null) {
				throw new IllegalAccessException(Errors.FORBIDDEN.toString());
			}
			ddos.status = DDoS.LOGOUT;
			ddos.save();
		} catch (Exception ex) {
			log.error("Parse token", ex);
			return forbidden(Constants.Errors.FORBIDDEN.toString());
		}
		return ok();
	}

	public Token token(JsonNode body) {
		Token token = new Token();
		try {
			String token_attr = body.get(TOKEN_ATTR).asText();
			String user_attr = body.get(USER_ATTR).asText();
			token.jwt = AuthenticationUtils.validateToken(token_attr, user_attr);
			if (token.jwt == null) {
				log.error("Invalid token=" + token_attr + ", username=" + user_attr);
				token.result = forbidden(Constants.Errors.FORBIDDEN.toString());
			}
		} catch (Exception ex) {
			log.error("Parse token", ex);
			token.result = forbidden(Constants.Errors.FORBIDDEN.toString());
		}
		return token;
	}

	public Result initDatabase() {
		Ebean.find(User.class).findCount();
		return ok("Compiled successfully.");
	}
	
	public Result getNotes(Long id) {
		log.debug("HomeController::getNotes for id=" + id);
		try {
			Note note = Ebean.find(Note.class).where().eq("id", id).findOne();
			return okResult(note, Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
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

		String clientIp = AuthenticationUtils.getClientIpAddress(request, body);
		log.debug("IP Address: " + clientIp + ", UserName: " + username);

		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MINUTE, -LOCKED_TIME);
		DDoS ddos = Ebean.createNamedQuery(DDoS.class, DDoS.FIND).setParameter("clientIp", clientIp)
				.setParameter("username", username).setParameter("date", cal.getTime()).findOne();
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

class Token {
	DecodedJWT jwt;
	Result result;
}