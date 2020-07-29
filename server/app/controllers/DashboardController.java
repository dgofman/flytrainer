package controllers;

import com.fasterxml.jackson.databind.JsonNode;

import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;

@BasicAuth
public class DashboardController extends BaseController {

	public Result schedule(Http.Request request) {
		JsonNode body = request.body().asJson();

		return ok(body);
	}
}
