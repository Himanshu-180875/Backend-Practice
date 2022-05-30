Through this application you can perform authentication and Authorization as well as you can encrypt or decrypt your secret message

Setup Requirement
We require below services/software on system for project setup.

Node 16.15.0
GIT
Xampp
Setup Guide (Command line instructions)
git clone <Project_Repo_URL> project cd project

make a file ".env"

APP_PORT=your_port,
DB_PORT=your_DB_port,
DB_HOST=localhost,
DB_USER=your_DB_user_name,
MYSQL_DB=your_DB_name,
DB_PASS=your password,
SECRET_KEY= your_Secret_key,
ENCRYPTION_DECRYPTION_KEY = your_secret_key

and then run

npm install
Open Mysql

Create Database - With the database name specified above
mysql> CREATE DATABASE MYSQL_DB;
Import tables -
$ mysql -u <username> -p<PlainPassword> test < 'path_to_posts.sql'
$ mysql -u <username> -p<PlainPassword> test < 'path_to_user.sql'
and then run npm run start

then your server will start at port you specified and you can see it by typing http://localhost:your_app_port