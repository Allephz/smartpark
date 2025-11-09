@echo off
mysql -u root -p < "%~dp0\src\database\schema.sql"
pause