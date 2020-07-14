# Eclipse configuration

1). Open External Tools Configuration*
*Name*: soars-sbt-launch
*Location*: C:\jdk1.8.0_171\bin\java.exe
*Working Directory*: ${workspace_loc:/FlyTrainerApp/server}

-Dfile.encoding=UTF8 
-Djline.terminal=none 
-Dsbt.log.noformat=true 
-Dsbt.global.base=${env_var:TEMP}\sbt-global-pluginstub -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=9999 -Xms512M -Xmx1024M -Xss1M -XX:+CMSClassUnloadingEnabled 
-DappTop=.
-Ddb.flytrainer.username=flytrainer
-Ddb.flytrainer.password=**********
-Dplay.temporaryFile.dir=./server/target -jar "${env_var:SBT_HOME}bin\sbt-launch.jar" run

2) Open Debug Configuration:*

*Name*: FlyTrainer
*Project*: FlyTrainerApp
*Host*: localhost
*Port*: 9999


# Create database
SET DB_USERNAME=flytrainer
SET DB_PASSWORD=**********
SET PATH=%PATH%;"C:\Program Files\MySQL\MySQL Server 8.0\bin"
CD flytrainerapp/database
mysql -u root -p -e"SET @UserName := '%DB_USERNAME%'; SET @Password := '%DB_PASSWORD%'; \. createdatabase.sql"

# Compile client
cd ./client
npm install -g @angular/cli
npm install

# Create server
cd ./server
sbt update
sbt makePom

sbt uuid
sbt env
sbt -Ddb.flytrainer.username=flytrainer -Ddb.flytrainer.password=********** run

# Initialisation database tables
http://localhost:8080/init


# Troubleshooting 
%USERPROFILE%/.ivy2