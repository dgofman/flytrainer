import spray.json._
import java.util.Arrays
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import javax.crypto.spec.IvParameterSpec
import java.security.MessageDigest
import java.util.Base64
import java.util.UUID
import DefaultJsonProtocol._

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

val getPWD = settingKey[String]("Encrypt password")
getPWD := {
  if (sys.env.get("PASSWORD") != None) { 
    val password = sys.env.get("PASSWORD").get;
    val encryptKey = jsonProperties.value.fields("encryptKey").convertTo[String]
    val keySpec = new SecretKeySpec(Arrays.copyOf(encryptKey.getBytes("utf-8"), 16), "AES");
    val cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
    cipher.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(Array[Byte](0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)));
    val encVal = cipher.doFinal(password.getBytes("utf-8"));
    Base64.getEncoder().encodeToString(encVal);
  } else {
    "Set 'PASSWORD' environment variable is missing" 
  }
}

lazy val env = taskKey[Unit]("Print environment variables")
lazy val uuid = taskKey[Unit]("Print generated UUID")
lazy val pwd = taskKey[Unit]("Print encrypted password")
lazy val root = (project in file("."))
		.enablePlugins(PlayJava, PlayEbean)
		.settings(
			env := { println( jsonProperties.value.prettyPrint ) },
			uuid := { println( "New ClientID: " + getUUID.value ) },
			pwd :=  { println( "Password: " + getPWD.value ) },
			PlayKeys.playDefaultPort := jsonProperties.value.fields("server_port").convertTo[Int]
		)

scalaVersion := "2.13.3"

libraryDependencies ++= Seq(
  guice,
  jdbc,
  "com.auth0" % "java-jwt" % "3.10.3",
  "mysql" % "mysql-connector-java" % "8.0.20",
  "com.sun.mail" % "javax.mail" % "1.6.2"
)