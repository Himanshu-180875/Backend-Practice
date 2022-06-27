const express = require('express')
const log4js = require("log4js");
const dotenv = require('dotenv').config();
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const app = express()
const db = require('./config/database');
const allRoutes = require('./Routes/index');
const logger = require('./config/logger')
const savingLogs = require('./controllers/savingLogs');

//used for parsing the incoming requests with JSON,built in middleware
app.use(express.json())
// app.use(log4js.connectLogger(logger, { level: log4js.levels.auto, format: ':method :url' }));
app.use(log4js.connectLogger(logger, { level: 'auto' }));

logger.info(`NODE_ENV=${process.env.NODE_ENV}`);

if(process.env.NODE_ENV=='session'){
var sessionStore = new MySQLStore({
    expiration: 20000,
    clearExpired: true,
    checkExpirationInterval: 1000,
    createDatabaseTable:true,
    schema:{
        tableName:'sessiontable',
        columnNames:{
            session_id:'session_id',
            expires:'expires',
            data:'data'
        }
    }
},db);
app.use(session({
	key: process.env.SESSION_KEY,
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));
}

app.use(allRoutes)
//For starting the server on port
app.listen(process.env.APP_PORT, ()=> logger.info(`APP LISTENING ON http://${process.env.DB_HOST}:${process.env.APP_PORT}`))
