import scala.language.postfixOps

name := """FlyTrainer"""
organization := "com.softigent"

version := "0.1"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.13.3"

libraryDependencies ++= Seq(
  guice,
  "com.h2database" % "h2" % "1.4.200"
)