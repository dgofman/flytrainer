# Eclipse configuration

1). Open External Tools Configuration*
*Name*: soars-sbt-launch
*Location*: C:\jdk-12.0.1\bin\java.exe
*Working Directory*: ${workspace_loc:/FlyTrainerApp/server}

-Dfile.encoding=UTF8 
-Djline.terminal=none 
-Dsbt.log.noformat=true 
-Dsbt.global.base=${env_var:TEMP}\sbt-global-pluginstub --add-opens java.base/java.lang=ALL-UNNAMED -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=9999 -Xms512M -Xmx1024M -Xss1M -XX:+CMSClassUnloadingEnabled 
-DappTop=. 
-Ddb.flytrainer.username=flytrainer
-Ddb.flytrainer.password=f1ytr@n3r
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
SET PASSWORD=********** && sbt pwd

# Update properties:
/environment.json
/client/src/environments/environment.json


# Initialisation database tables
http://localhost:8080/init

1. "An SQL script will be run on your database."
Click button "Apply this script now!"

2. After creation database, copy SQL triggers from server/conf/evolutions/flytrainer/1.sql file and RUN manually. 

3. "An evolution has not been applied properly. Please check the problem and resolve it manually before marking it as resolved."
Click button "Mark it resolved"

# Troubleshooting 
%USERPROFILE%/.ivy2


# Permissions 
ASSISTANT - Access to User records as read only
MANAGER - Access to User records as editor
ADMIN - Access to all records including view user passwords


# Android
https://medium.com/@christof.thalmann/convert-angular-project-to-android-apk-in-10-steps-c49e2fddd29

Donload and Install https://gradle.org/install/

Download Latest Android Studio SDK https://developer.android.com/studio/install

Add System environment variable:
ANDROID_SDK_ROOT=C:\Users\dgofman\AppData\Local\Android\Sdk

System PATH variables add two path:
%ANDROID_SDK_ROOT%\platforms
%ANDROID_SDK_ROOT%\platform-tools
%ANDROID_SDK_ROOT%\tools
C:\softwares\gradle-6.6\bin

%ANDROID_SDK_ROOT%\tools\bin\sdkmanager --licenses
%ANDROID_SDK_ROOT%\tools\bin\sdkmanager --list | findstr system-images
%ANDROID_SDK_ROOT%\tools\bin\sdkmanager --install "system-images;android-29;default;x86_64"

echo "no" | %ANDROID_SDK_ROOT%\tools\bin\avdmanager --verbose create avd --force --name "generic_10" --package "system-images;android-29;default;x86_64" --tag "default" --abi "x86_64"

npm install -g cordova

cordova build android

cordova emulate android

cordova build --release android
