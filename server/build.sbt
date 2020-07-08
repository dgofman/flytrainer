import spray.json._

name := """FlyTrainer"""
organization := "com.flytrainer"

version := "1.0"

val jsonProperties = settingKey[JsObject]("The environment properties")
jsonProperties := {
  val configFile = scala.io.Source.fromFile("../environment.json").getLines().mkString
  configFile.parseJson.asJsObject
}

lazy val env = taskKey[Unit]("Print environment variables")
lazy val root = (project in file("."))
		.enablePlugins(PlayJava)
		.settings(
			env := { println( jsonProperties.value.prettyPrint ) },
			PlayKeys.playDefaultPort := jsonProperties.value.getFields("sbt_port")(0).toString().toInt
		)

scalaVersion := "2.13.3"

libraryDependencies ++= Seq(
  guice,
  "com.h2database" % "h2" % "1.4.200"
)