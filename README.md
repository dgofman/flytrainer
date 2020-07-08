https://fireship.io/lessons/desktop-apps-with-electron-and-angular/

1) Optional delete:
%USERPROFILE%/.ivy2

2) Run commands:
sbt update
sbt makePom

3). Open External Tools Configuration*
*Name*: soars-sbt-launch
*Location*: C:\jdk1.8.0_171\bin\java.exe
*Working Directory*: ${workspace_loc:/FlyTrainerApp/server}

-Dfile.encoding=UTF8 
-Djline.terminal=none 
-Dsbt.log.noformat=true 
-Dsbt.global.base=${env_var:TEMP}\sbt-global-pluginstub -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=9999 -Xms512M -Xmx1024M -Xss1M -XX:+CMSClassUnloadingEnabled 
-DappTop=. 
-Dplay.temporaryFile.dir=./server/target -jar "${env_var:SBT_HOME}bin\sbt-launch.jar" run

4) Open Debug Configuration:*

*Name*: FlyTrainer
*Project*: FlyTrainerApp
*Host*: localhost
*Port*: 9999



npm install -g @angular/cli
npm install