const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/database");
const logger = require("../config/logger");
const {savingRequestLogs, savingResponseLogs}  = require("./savingLogs");
const registerResponse =  require('../Responses/registerResponses');
const loginResponses = require('../Responses/loginResponses');
const refreshTokenResponses = require('../Responses/refreshTokenResponse');
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
// const database = require("../config-1/database");
// const db = require("../config/knex_database");

//Registering the User


exports.register = (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  var id = uuidv4()

  //Finding the user based on email so that no two person have same email
  db.query(
    "Select email from user where LOWER(email) = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results?.length > 0) {
        savingRequestLogs(id, req.body.email, req.url, req.method)
        savingResponseLogs(id,registerResponse.conflictCode, registerResponse.conflictMessage)
        return res.status(registerResponse.conflictCode).send({
          message: registerResponse.conflictMessage,
        });
      } else if (password !== passwordConfirm) {
        savingRequestLogs(id,req.body.email, req.url, req.method)
        savingResponseLogs(id,registerResponse.badRequestCode, registerResponse.badRequestMessage)
        return res.status(registerResponse.badRequestCode).send({
          message: registerResponse.badRequestMessage,
        });
      }

      //Creating the hash of password using Bcrypt and inserting the hashed password into the database
      let hashedPassword = await bcrypt.hash(password, 12);
      db.query(
        "Insert into user set ?",
        { email, password: hashedPassword },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            savingRequestLogs(id, req.body.email, req.url, req.method)
            savingResponseLogs(id, registerResponse.createdCode, registerResponse.createdMessage)
            res.status(registerResponse.createdCode).send({
              message: registerResponse.createdMessage,
            });
          }
        }
      );
    }
  );
};

//Login Functionality
exports.login = (req, res) => {
  const { email, password } = req.body;
  var id = uuidv4()
  //Checking whether the user with the passed email exists or not
  db.query(
    "Select * from user where LOWER(email) = ?",
    [email],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          message: err,
        });
      }
      if (!result.length) {
        savingRequestLogs(id, req.body.email, req.url, req.method)
        savingResponseLogs(id,loginResponses.badRequestCode, loginResponses.badRequestMessage)
        return res.status(loginResponses.badRequestCode).send({
          message: loginResponses.badRequestMessage,
        });
      }

      //Comparing the password entered by the user and stored password.
      bcrypt.compare(password, result[0]["password"], (Berr, Bresult) => {
        // console.log("Bresult", Bresult);

        if (Berr) {
          throw Berr;
          return res.status(400).send({
            message: "Password is incorrect",
          });
        }

        //If both the passwords are correct then assigning the token.
        if (Bresult) {
          // console.log(result);
          if (process.env.NODE_ENV == "session") {
            var object = result[0];
            req.session.userInfo = [object.id, object.email];
            
            savingRequestLogs(id, req.body.email, req.url, req.method)
            savingResponseLogs(id, loginResponses.successResponse, loginResponses.successMessage)
            return res.status(loginResponses.successResponse).send({
              message: loginResponses.successMessage,
              sessionId: req.sessionID,
              user: result[0],
            });
          } else if (process.env.NODE_ENV == "jwt") {
            const accessToken = jwt.sign(
              { email: result[0].email, id: result[0].id },
              process.env.SECRET_KEY,
              { expiresIn: "3m" }
            );
            const refreshToken = jwt.sign(
              { email: result[0].email, id: result[0].id },
              process.env.REFRESH_SECRET_KEY,
              { expiresIn: "30d" }
            );
            savingRequestLogs(id, req.body.email, req.url, req.method)
            savingResponseLogs(id, loginResponses.successResponse, loginResponses.successMessage)
            return res.status(loginResponses.successResponse).send({
              message: loginResponses.successMessage,
              accessToken,
              refreshToken,
              user: result[0],
            });
          }
          // console.log(req);
        }
        savingRequestLogs(id, req.body.email, req.url, req.method)
        savingResponseLogs(id, loginResponses.failedResponse, loginResponses.failedMessage)
        return res.status(loginResponses.failedResponse).send({
          message: loginResponses.failedMessage,
        });
      });
    }
  );
};

exports.refreshToken = async (req, res) => {
  var uniqueId = uuidv4()

  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      savingRequestLogs(uniqueId,req.body.email? req.body.email : "", req.url, req.method)
      savingResponseLogs(uniqueId,refreshTokenResponses.tokenNotFoundCode, refreshTokenResponses.tokenNotFoundMessgae)
      res.status(refreshTokenResponses.tokenNotFoundCode).send({
        message: refreshTokenResponses.tokenNotFoundMessgae,
      });
    }
    await jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      (err, payload) => {
        if (!err) {
          const { email, id } = payload;
          const accessToken = jwt.sign({ email, id }, process.env.SECRET_KEY, {
            expiresIn: "1m",
          });
          savingRequestLogs(uniqueId,req.body.email, req.url, req.method)
          savingResponseLogs(uniqueId,refreshTokenResponses.tokenVerifiedCode, refreshTokenResponses.tokenVerifiedMessage)
          return res.status(refreshTokenResponses.tokenVerifiedCode).send({
            token: accessToken,
            message: refreshTokenResponses.tokenVerifiedMessage
          });
        } else {
          savingRequestLogs(uniqueId,req.body.email, req.url, req.method)
          savingResponseLogs(uniqueId,refreshTokenResponses.notAuthorizedCode, refreshTokenResponses.notAuthorizedMessage)
          return res.status(refreshTokenResponses.notAuthorizedCode).send({ 
            message: refreshTokenResponses.notAuthorizedMessage
         });
        }
      }
    );
  } catch (err) {
    res.status(500).send({
      err,
    });
  }
};
