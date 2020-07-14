--    SET DB_USERNAME=flytrainer
--    SET DB_PASSWORD=**********
--    SET PATH=%PATH%;"C:\Program Files\MySQL\MySQL Server 8.0\bin"
--    CD flytrainerapp/database
--    mysql -u root -p -e"SET @UserName := '%DB_USERNAME%'; SET @Password := '%DB_PASSWORD%'; \. createdatabase.sql"

SET @Database := 'flytrainer';

SET @sqlStr = CONCAT('CREATE DATABASE ',@Database);
PREPARE sqlStatment FROM @sqlStr;
EXECUTE sqlStatment;

SET @sqlStr = CONCAT('CREATE USER "',@UserName,'"@"%" IDENTIFIED BY "',@Password,'"');
PREPARE sqlStatment FROM @sqlStr;
EXECUTE sqlStatment;

SET @sqlStr = CONCAT('GRANT ALL PRIVILEGES ON ',@Database,'.* TO "',@UserName,'"@"%"');
PREPARE sqlStatment FROM @sqlStr;
EXECUTE sqlStatment;

SET @sqlStr = CONCAT('SHOW GRANTS FOR "',@UserName,'"');
PREPARE sqlStatment FROM @sqlStr;
EXECUTE sqlStatment;

FLUSH PRIVILEGES;
SELECT user FROM mysql.user;
SHOW DATABASES;

DEALLOCATE PREPARE sqlStatment;