package controllers;

import java.util.Map;

import io.ebean.Ebean;
import models.User;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import utils.AuthenticationUtils;

//@BasicAuth()
public class HomeController extends Controller {

	public Result login(Http.Request request) {
		Map<String, String[]> body = request.body().asFormUrlEncoded();
		if (!AuthenticationUtils.validateClientId(body.get("cid")[0])) {
			return forbidden();
		}
		try {
			String token = AuthenticationUtils.issueToken(body.get("userid")[0], body.get("passwd")[0]);
			return ok(token);
		} catch (Exception e) {
			return unauthorized();
		}
	}
	
	public Result initDatabase() {
		Ebean.find(User.class).findCount();
		return ok("Compiled successfully.");
	}
}
