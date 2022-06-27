const db = require('../config/database')

  
const savingRequestLogs = async(id, request_email, request_url, request_method) => {
    db.query("Insert into request_logs set ?", {id, request_email, request_url, request_method},(err)=>{
        if(err){
        console.log(err);

        }
    })
}
const savingResponseLogs = async(id, response_status, response_message) => {
    db.query("Insert into response_logs set ?", {id,response_status, response_message},(err)=>{
        if(err){
        console.log(err);

        }
    })
}  

module.exports = {savingRequestLogs,
    savingResponseLogs
};