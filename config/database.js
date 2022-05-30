const mysql = require('mysql')

//Creating the Connection
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.MYSQL_DB
})

db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("MYSQL connected..")
    }
})

module.exports = db; 