import spray.json._
import java.security.MessageDigest
import java.util.Base64
import java.util.UUID

name := """FlyTrainer"""
organization := "com.flytrainer"

version := "1.0"

val jsonProperties = settingKey[JsObject]("The environment properties")
jsonProperties := {
  val configFile = scala.io.Source.fromFile("../environment.json").getLines().mkString
  configFile.parseJson.asJsObject
}

val getUUID = settingKey[String]("Generate UUID")
getUUID := {
  val salt = MessageDigest.getInstance("SHA-256");
  salt.update(UUID.randomUUID().toString().getBytes("UTF-8"));
  Base64.getEncoder().encodeToString(salt.digest());
}

lazy val env = taskKey[Unit]("Print environment variables")
lazy val uuid = taskKey[Unit]("Print generated UUID")
lazy val root = (project in file("."))
		.enablePlugins(PlayJava, PlayEbean)
		.settings(
			env := { println( jsonProperties.value.prettyPrint ) },
			uuid := { println( "New ClientID: " + getUUID.value ) },
			PlayKeys.playDefaultPort := jsonProperties.value.getFields("server_port")(0).toString().toInt
		)

scalaVersion := "2.13.3"

libraryDependencies ++= Seq(
  guice,
  jdbc,
  "com.auth0" % "java-jwt" % "3.10.3",
  "mysql" % "mysql-connector-java" % "8.0.20",
  "com.sun.mail" % "javax.mail" % "1.6.2"
)