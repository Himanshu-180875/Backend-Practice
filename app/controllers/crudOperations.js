const db = require('../config/database')
const index = require('../index')
// const db = require("../config/knex_database");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const bcrypt = require("bcryptjs");
const encryptResponses = require('../Responses/crudResponses');
const {savingRequestLogs,savingResponseLogs} = require("./savingLogs");
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');


//Encrypting the message and storing the password into the database.
exports.encrypt = async (req, res) => {
  var id = uuidv4()
  const { message, password } = req.body;
  // console.log(req);

  //Creating the Initialization vector
  const iv = crypto.randomBytes(16);

  //Creating the cipher
  const cipher = crypto.createCipheriv(
    algorithm,
    process.env.ENCRYPTION_DECRYPTION_KEY,
    iv
  );
  // console.log("cipher", cipher);

  //Encrypting the plain text message into hexadecimal
  let encryptedData = cipher.update(message, "utf-8", "hex");

  //Coverting the cipher into hexadecimal and concatenating with encrypted message
  encryptedData += cipher.final("hex");
  // console.log(encryptedData);
  // console.log(iv);

  //As our buffer is in binary so for storing, converting it into base64
  const base64iv = Buffer.from(iv, "binary").toString("base64");

  //Also hashing the password entered by user
  const hashedPassword = await bcrypt.hash(password, 12);
  // console.log(hashedPassword);

  //Storing the message, password, iv
  // console.log(req)
  db.query(
    "Insert into posts set ?",
    {
      message: encryptedData,
      password: hashedPassword,
      iv: base64iv,
      user_id: req.id,
    },
    (error, result) => {
      if (error) {
        console.log(req)
        savingRequestLogs(id,req.email, req.url, req.method)
        savingResponseLogs(id,encryptResponses.internalServerCode, encryptResponses.failedResponse)
        return res.status(encryptResponses.internalServerCode).send({
          status: error,
          message: encryptResponses.failedResponse
        });
      }
      // console.log(req)
        savingRequestLogs(id, req.email, req.url, req.method)
        savingResponseLogs(id,encryptResponses.postCreatedCode, encryptedData)
      return res.status(encryptResponses.postCreatedCode).send({
        message: encryptResponses.postCreatedMessage,
        data: encryptedData,
      });
    }
  );

//By Knex Configuration
// db('posts').insert({
//       message: encryptedData,
//       password: hashedPassword,
//       iv: base64iv,
//       user_id: req.id,
// }).then(
              
              
//                res.status(201).send({
//                 status: "Post Created Successfully",
//                 // message: data,
//               })
//             )
};

//for getting all the encrypted data stored in the database
exports.getAllData = (req, res) => {
  var id = uuidv4()

  db.query("Select * from posts", (err, result)=>{
      if(err){
        savingRequestLogs(id, req.email, req.url, req.method)
        savingResponseLogs(id, encryptResponses.postCreatedCode, encryptResponses.postCreatedMessage)
          return res.status(encryptResponses.internalServerCode).send({
              message: encryptResponses.failedResponse,
              status:err

          })
      }
      // console.log(result)
      savingRequestLogs(id, req.email, req.url, req.method)
      savingResponseLogs(id, encryptResponses.successCode, JSON.stringify(result))
      return res.status(encryptResponses.successCode).send({
          message:encryptResponses.Successmessage,
          data: result
      })
  })

  // By Knex Configuration
  // db.select()
  //   .from("posts")
  //   .then((result, err) => {
  //     if (err) {
  //       return res.status(500).send({
  //         message: err,
  //       });
  //     }
  //     return res.status(200).send({
  //       data: result,
  //     });
  //   });
};

exports.getDataOfUserById = (req, res) => {
  const id = req.params.id;
  var uniqueId = uuidv4()
  db.query("Select * from posts where user_id=?", [id], (err, result) => {
    if (err) {
      savingRequestLogs(uniqueId, req.email, req.url, req.method)
      savingResponseLogs(uniqueId, encryptResponses.internalServerCode, encryptResponses.failedResponse)
      return res.status(encryptResponses.internalServerCode).send({
        status: err,
        message:encryptResponses.failedResponse
      });
    }
    savingRequestLogs(uniqueId, req.email, req.url, req.method)
    savingResponseLogs(uniqueId, encryptResponses.successCode, JSON.stringify(result))
    return res.status(encryptResponses.successCode).send({
      data: result
    });
  });

  // By Knex Configuration

  // db.select().from('posts').where('user_id', id).then(result => {
  //   return res.status(200).send({
  //         data: result,
  //       });
  // })
};

// For those who want to see their message in decrypted format
exports.decrypt = (req, res) => {
  const { password } = req.body;
  var id = uuidv4()
  const message = req.params.message;

  //Find the message based on the encrypted message
  db.query(
    "Select * from posts where message = ?",
    [message],
    (error, result) => {
      if (error) {
        savingRequestLogs(id, req.email, req.url, req.method)
        savingResponseLogs(id, encryptResponses.badRequestCode, encryptResponses.failedResponse)
        
        return res.status(encryptResponses.badRequestCode).send({
          status: error,
          message:encryptResponses.failedResponse
        });
      }
      // console.log(result);

      //Extracting the object from the array
      const obj = result[0];
      //converting Initialize vector from base64 to buffer

      //As we stored the buffer in base64 format so finally converting it back to the binary
      const originalData = Buffer.from(obj.iv, "base64");
      // console.log(originalData);
      // console.log("obj", obj);

      //Before giving the plain message, First checking the password entered by the user
      bcrypt.compare(password, obj.password, (Berr, Bresult) => {
        if (Berr) {
          savingRequestLogs(id, req.email, req.url, req.method)
          savingResponseLogs(id, encryptResponses.badRequestCode, encryptResponses.failedResponse )
          return res.status(encryptResponses.badRequestCode).send({
            status: Berr,
            message:encryptResponses.failedResponse
          });
        }
        //If password matches
        if (Bresult) {
          const decipher = crypto.createDecipheriv(
            algorithm,
            process.env.ENCRYPTION_DECRYPTION_KEY,
            originalData
          );

          //getting the decryptedData from hexadecimal to utf 8
          let decryptedData = decipher.update(obj.message, "hex", "utf-8");

          //Getting the message in user understanding format
          decryptedData += decipher.final("utf-8");
          savingRequestLogs(id, req.email, req.url, req.method)
          savingResponseLogs(id,encryptResponses.successCode, encryptResponses.Successmessage )
          return res.status(encryptResponses.successCode).send({
            data: decryptedData,
            message:encryptResponses.Successmessage
          });
        }
          savingRequestLogs(id, req.email, req.url, req.method)
          savingResponseLogs(id, encryptResponses.badRequestCode, encryptResponses.incorrectPassword)

        return res.status(encryptResponses.badRequestCode).send({
          message: encryptResponses.incorrectPassword,
        });
      });
    }
  );
};
