package controllers;
import models.*;
import play.mvc.Controller;
import play.mvc.Result;

public class InitDatabaseController  extends Controller{

    public Result index(){
        Account.find.all();
        return ok("Compiled successfully.");
    }
}