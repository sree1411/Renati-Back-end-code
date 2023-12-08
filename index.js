const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const EmployeeSchema = require('./employee')
const UserSchema = require('./user')


const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Load environment variables from config file
dotenv.config({ path: './config.env' });

// MongoDB connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
 .then(() => console.log('DB connection successful!'))
 .catch((err) => console.error('DB connection error:', err));
 
 
 const jwtSecret = process.env.JWT_SECRET;
 

//register

app.post("/login", (req,res)=>{

    let data={
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password , bcrypt.genSaltSync(10))
    }


 new UserSchema(data).save()
 .then((doc)=>{res.status(200).json({
    success:true,
    message:" registration succesfully",
    data:doc
 })})
 .catch((err)=>{res.status(400).json({
    success:false,
    message:" Not registration succesfully",
    data:err
 })})



})


//Login//


app.post("/signup", (req,res)=>{

    UserSchema.findOne({email:req.body.email}).select("email password").exec()
    .then((doc)=>{
      if(!doc){
        res.status(200).json({success:false, message:"user not available"})
      }else{
        if(bcrypt.compareSync(req.body.password, doc.password)){
            res.status(200).json({
                success:true, 
                message:"found the user",
                id:doc._id,
                token: jwt.sign({ id:doc._id }, jwtSecret)
            
            
            })
        }else{
            res.status(200).json({success:false, message:"invalid TOKEN OR TOken not found data"})
        }
      }
    })
    .catch((err)=>{res.status(400).json({
       success:false,
       message:" Not get the employee succesfully",
       data:err
    })})
   
   
   
   })






//middle wear 



// const myLogger = function (req, res, next) {
//     if(req.headers.authorization){
//         if(jwt.verify(req.headers.authorization, 'MY_KEY')){
//            next()
//         }else(
//         res.status(200).json({success:false, message:"invalid found data"})

//         )
      
//     }else{
//         res.status(200).json({success:false, message:"invalid TOKEN OR TOken not found data"})
//     }
    
//   }
  
//   app.use(myLogger)

const myLogger = function (req, res, next) {
    const token = req.headers.authorization;
  
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Attach user details to the request object
        next();
      } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Token not found' });
    }
  };
  
  module.exports = myLogger;





app.post("/employee", (req,res)=>{

    let data={
        name: req.body.name,
        age: req.body.age,
        email:req.body.email,
        phone: req.body.phone
    }


 new EmployeeSchema(data).save()
 .then((doc)=>{res.status(200).json({
    success:true,
    message:" Created employee succesfully",
    data:doc
 })})
 .catch((err)=>{res.status(400).json({
    success:false,
    message:" Not created employee succesfully",
    data:err
 })})



})


app.get("/employee", (req,res)=>{
 EmployeeSchema.find().select("name age email phone").exec()
 .then((doc)=>{res.status(200).json({
    success:true,
    message:" got the total employee succesfully",
    data:doc
 })})
 .catch((err)=>{res.status(400).json({
    success:false,
    message:" Not get the employee succesfully",
    data:err
 })})



})


 
app.put("/employee/:id", (req,res)=>{
    EmployeeSchema.findByIdAndUpdate(req.params.id, {$set:{name:req.body.name, age:req.body.age, email:req.body.email, password:req.body.password}}).select("name age email phone").exec()
    .then((doc)=>{res.status(200).json({
       success:true,
       message:" got the total employee succesfully",
       data:doc
    })})
    .catch((err)=>{res.status(400).json({
       success:false,
       message:" Not get the employee succesfully",
       data:err
    })})
   
   })



app.delete("/employee/:id", (req,res)=>{
    EmployeeSchema.findByIdAndDelete(req.params.id).select("name age email phone").exec()
    .then((doc)=>{res.status(200).json({
       success:true,
       message:" got the total employee succesfully",
       data:doc
    })})
    .catch((err)=>{res.status(400).json({
       success:false,
       message:" Not get the employee succesfully",
       data:err
    })})
   
   })




app.listen(port, () => {
  console.log(`app is running on localhost:${port}`);
});
