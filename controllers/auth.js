const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/database");

//Registering the User 
exports.register = (req, res) => {
  const { email, password, passwordConfirm } = req.body;

  //Finding the user based on email so that no two person have same email
  db.query(
    "Select email from user where LOWER(email) = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results?.length > 0) {
        return res.status(409).send({
          message: "Already a person with this email exists",
        });
      } else if (password !== passwordConfirm) {
        return res.status(400).send({
          message: "Password and ConfirmPassword do not match",
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
            res.status(201).send({
              message: "User registered",
              
            });
          }
        }
      );
    }
  );
};


//Login Functionality
exports.login = (req,res)=>{
  const { email, password } = req.body;

  //Checking whether the user with the passed email exists or not 
  db.query(
    "Select * from user where LOWER(email) = ?",
  [email],
  (err,result)=>{
    if(err){
      return res.status(400).send({
        message:err
      })
    }
    if(!result.length){
      return res.status(400).send({
        message:'Email is incorrect or does not exists'
      })
    }
    
    //Comparing the password entered by the user and stored password.
    bcrypt.compare(password, result[0]["password"],(Berr, Bresult)=>{
      console.log('Bresult',Bresult)
      
      if(Berr){
        throw Berr
        return res.status(400).send({
          message:'Password is incorrect'
        })
      }

      //If both the passwords are correct then assigning the token.
      if(Bresult){
          const token =  jwt.sign({email:result[0].email, id:result[0].id}, process.env.SECRET_KEY , {expiresIn:"1d"})
          return res.status(200).send({
            message:'Logged In',
            token,
            user:result[0]
          })
      }
      return res.status(400).send({
        message:"Username or Password Incorrect"
      })
    })
  }
  )
}
