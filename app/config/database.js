const mysql = require('mysql')
const logger = require('./logger');
//Creating the Connection
var options ={
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
var db = mysql.createConnection(options);
db.connect((error)=>{
    if(error){
        logger.error(error)
    }
    else{
        logger.info("MYSQL connected..")
    }
})

module.exports = db; 