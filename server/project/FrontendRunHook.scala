import play.sbt.PlayRunHook
import spray.json._
import sbt._

import scala.sys.process.Process

/**
  * Frontend build play run hook.
  * https://www.playframework.com/documentation/2.8.x/SBTCookbook
  */
object FrontendRunHook {
  def apply(base: File): PlayRunHook = {
    object UIBuildHook extends PlayRunHook {

      var process: Option[Process] = None
      var client_dir = base / "../client"

      val configFile = scala.io.Source.fromFile("../environment.json").getLines().mkString
      val jsValues = configFile.parseJson.asJsObject.getFields("sbt_port", "ui_port")

      /**
        * Change the commands in `FrontendCommands.scala` if you want to use Yarn.
        */
      var install: String = "npm install"
      var run: String = "ng serve --open --proxy-config src/proxy.conf.js --port " + jsValues(1).toString()

      // Windows requires npm commands prefixed with cmd /c
      if (System.getProperty("os.name").toLowerCase().contains("win")){
        Process("cmd /c  for /f \"tokens=5\" %a in ('netstat -aon ^| find \"" + jsValues(0).toString() + "\"') do taskkill /f /pid %a").!
        Process("cmd /c  for /f \"tokens=5\" %a in ('netstat -aon ^| find \"" + jsValues(1).toString() + "\"') do taskkill /f /pid %a").!
        install = "cmd /c" + install
        run = "cmd /c" + run
      } else { 
        Process("kill -9 $(lsof -t -i:4200)").!
        Process("kill -9 $(lsof -t -i:9000)").!
      } 

      /**
        * Executed before play run start.
        * Run npm install if node modules are not installed.
        */
      override def beforeStarted(): Unit = {
        if (!(client_dir / "node_modules").exists()) Process(install, client_dir).!
      }

      /**
        * Executed after play run start.
        * Run npm start
        */
      override def afterStarted(): Unit = {
        process = Option(
          Process(run, client_dir).run
        )
      }

      /**
        * Executed after play run stop.
        * Cleanup frontend execution processes.
        */
      override def afterStopped(): Unit = {
        process.foreach(_.destroy())
        process = None
      }

    }

    UIBuildHook
  }
}