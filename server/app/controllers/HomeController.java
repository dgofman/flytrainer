package controllers;

import java.util.Calendar;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.DB;
import io.ebean.Ebean;
import models.DDoS;
import models.User;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import utils.AppConfig;
import utils.AuthenticationUtils;
import utils.MailServer;
import utils.Constants.Errors;
import utils.Constants.Key;

//@BasicAuth()
public class HomeController extends Controller {
	
	private static final int LOGIN_ATTEMPTS = AppConfig.get(Key.LOGIN_ATTEMPTS).asInt();
	private static final int LOCKED_TIME = AppConfig.get(Key.LOCKED_TIME).asInt();

	private static final Logger log = LoggerFactory.getLogger(HomeController.class);
	
	public Result login(Http.Request request) {
		MailServer.sendMail("dgofman@gmail.com", "test", "<b>Test</b> <a href='http://localhost:8080/reset?token=123' target='_blank'>Click Here</a>");
		JsonNode body = request.body().asJson();
		if (!AuthenticationUtils.validateClientId(body.get("cid").asText())) {
			log.error(body.toPrettyString());
			return forbidden();
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
		
		DDoS ddos = DB.createNamedQuery(DDoS.class, DDoS.FIND)
				.setParameter("clientIp", clientIp)
				.setParameter("date", cal.getTime()).findOne();
		if (ddos != null) {
			if (ddos.totalCount >= LOGIN_ATTEMPTS) { // count(*)
				return status(LOCKED, String.format(Errors.LOCKED.error, LOCKED_TIME));
			}
			if (ddos.maxPermanently != null && ddos.maxPermanently != 0) { // count(*)
				return status(LOCKED, Errors.DISABLED.error);
			}
		}
		try {
			User user = AuthenticationUtils.authenticate(username, body.get("passwd").asText());
			if (user.resetPassword) {
				return status(NON_AUTHORITATIVE_INFORMATION, user.authToken);
			}
			return ok(user.authToken);
		} catch (IllegalAccessException e) {
			new DDoS(clientIp, username).save();
			log.error("IP Address: " + clientIp + ", UserName: " + username + ", Error: " + e.getMessage());
			return unauthorized(e.getMessage());
		}
	}
	
	public Result initDatabase() {
		Ebean.find(User.class).findCount();
		return ok("Compiled successfully.");
	}
}
