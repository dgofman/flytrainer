package controllers;

import java.util.Calendar;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.JsonNode;

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

	private static final Logger log = LoggerFactory.getLogger(HomeController.class);
	
	public Result login(Http.Request request) {
		JsonNode body = request.body().asJson();
		if (!AuthenticationUtils.validateClientId(body.get("cid").asText())) {
			log.error(body.toPrettyString());
			return forbidden(Constants.Errors.FORBIDDEN.toString());
		}
		String username = body.get("userid").asText();
		String clientIp = body.get("cip").asText() + '/';
		Optional<String> xForward = request.getHeaders().get("X-FORWARDED-FOR");  
		if (xForward.isPresent()) {
			clientIp += xForward.get();
		} else {
			clientIp += request.remoteAddress();
		}
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
		try {
			User user = AuthenticationUtils.authenticate(username, body.get("passwd").asText());
			String authToken = AuthenticationUtils.createToken(user, false);
			if (user.resetPassword == 1) {
				redirect("/reset?t=" + authToken);
			}
			return ok(authToken);
		} catch (IllegalAccessException e) {
			new DDoS(clientIp, username).save();
			log.error("IP Address: " + clientIp + ", UserName: " + username + ", Error: " + e.getMessage());
			return unauthorized(e.getMessage());
		}
	}
	
	public Result reset(Http.Request request) {
		return ok("OK");
	}
	
	public Result create(Http.Request request) {
		User user = new User(request.body().asJson());
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
		String origin = "";
		if (request.getHeaders().get("Origin").isPresent()) {
			origin = request.getHeaders().get("Origin").get();
		}
		String authToken = AuthenticationUtils.createToken(user, true);
		log.debug("Send activatation token: " +user.email + ", authToken=" + authToken);
		String body = String.format(Constants.createAccountMessage, user.firstname, user.lastname, AppConfig.get(Constants.Key.ENDPOINT).asText() + "/activate?user=" + user.username + "&v=" +user. version + "&t=" + authToken + "&redirect=" + origin + "/login");
		MailServer.sendMail(user.email, "Activate your account", body);
		return ok();
	}

	public Result activate(Http.Request request) {
		if (!request.queryString("t").isPresent() && !request.queryString("user").isPresent() || !request.queryString("v").isPresent() || !request.queryString("redirect").isPresent()) {
			log.error("Invalid activation link=" + request.path());
			return forbidden(Constants.Errors.FORBIDDEN.toString());
		}
		DecodedJWT jwt = AuthenticationUtils.validateToken(request.queryString("t").get(), request.queryString("user").get(), request.queryString("v").get());
		if (jwt == null) {
			log.error("Invalid activation link=" + request.path());
			return forbidden(Constants.Errors.FORBIDDEN.toString());
		}
		try {
			User user = Ebean.createNamedQuery(User.class, User.FIND)
					.setParameter("username", jwt.getSubject())
					.setParameter("uuid", jwt.getKeyId())
					.setParameter("version", jwt.getClaim("v").asLong()).findOne();
			if (user == null) {
				return forbidden(Constants.Errors.FORBIDDEN.toString());
			}
			user.isActive = 1;
			user.currentUserId = user.id;
			user.update();
		} catch (Exception ex) {
			return badRequest(Constants.Errors.ERROR.toString());
		}
		return redirect(request.queryString("redirect").get());
	}
	
	public Result initDatabase() {
		Ebean.find(User.class).findCount();
		return ok("Compiled successfully.");
	}
}
