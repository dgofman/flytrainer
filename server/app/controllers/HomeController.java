package controllers;

import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.Ebean;
import models.User;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import utils.AppConfig;
import utils.AuthenticationUtils;

class AppSummary {
	private String content;

	AppSummary(String content) {
		this.content = content;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}

//@BasicAuth()
public class HomeController extends Controller {

	public Result index() {
		User account = new User();
		account.username = "dgofman";
		account.firstname = "David";
		account.lastname = "Gofman";
		account.save();
		try {
			String token = AuthenticationUtils.issueToken(AppConfig.get("issuer").asText(), "dgofman", "pilot");
			return ok(token);
		} catch (Exception e) {
			return forbidden();
		}
	}

	public Result appSummary() {
		JsonNode jsonNode = Json.toJson(new AppSummary("Fly Trainer"));
		return ok(jsonNode).as("application/json");
	}

	public Result postTest() {
		JsonNode jsonNode = Json.toJson(new AppSummary("Post Request Test => Data Sending Success"));
		return ok(jsonNode).as("application/json");
	}
	
	public Result initDatabase() {
		Ebean.find(User.class).findCount();
		return ok("Compiled successfully.");
	}
}
