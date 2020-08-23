import play.sbt.PlayRunHook
import scala.io.Source
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
      var client_dir = base / ".." / "client"

      val jsServerValues = Source.fromFile("../environment.json").getLines().mkString.parseJson.asJsObject.getFields("server_port")
      val jsClientValues = Source.fromFile("../client/src/environments/environment.json").getLines().mkString.parseJson.asJsObject.getFields("client_port")

      /**
        * Change the commands in `FrontendCommands.scala` if you want to use Yarn.
        */
      var install: String = "npm install"
      var run: String = "ng serve --open --proxy-config src/proxy.conf.js --port " + jsClientValues(0).toString()

      // Windows requires npm commands prefixed with cmd /c
      // for /f "tokens=5" %a in ('netstat -aon ^| find "9999"') do taskkill /f /pid %a
      if (System.getProperty("os.name").toLowerCase().contains("win")){
        Process("cmd /c  for /f \"tokens=5\" %a in ('netstat -aon ^| find \"" + jsServerValues(0).toString() + "\"') do taskkill /f /pid %a").!
        Process("cmd /c  for /f \"tokens=5\" %a in ('netstat -aon ^| find \"" + jsClientValues(0).toString() + "\"') do taskkill /f /pid %a").!
        install = "cmd /c" + install
        run = "cmd /c" + run
      } else {
        Process("sh -c kill -9 $(lsof -t -i:" + jsServerValues(0).toString() + ")").!
        Process("sh -c kill -9 $(lsof -t -i:" + jsClientValues(0).toString() + ")").!
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
