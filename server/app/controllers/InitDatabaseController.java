package controllers;

import java.util.StringJoiner;

import io.ebean.Ebean;
import play.mvc.Controller;
import play.mvc.Result;

import models.*;

public class InitDatabaseController extends Controller {

	public Result index() {
		StringJoiner sj = new StringJoiner("\n");
		sj.add("Compiled successfully.");
		sj.add("User: " + Ebean.find(User.class).findCount());
		sj.add("Account: " + Ebean.find(Account.class).findCount());
		return ok(sj.toString());
	}
}