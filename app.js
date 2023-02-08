//jshint esversion:6
require('dotenv').config();
const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose= require("mongoose");
var encrypt = require("mongoose-encryption");

const app= express();

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});


app.use(express.static("public"));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));


//create new schema for user database
const userSchema= new mongoose.Schema({
    email: String,
    password:String
});

const secret=process.env.SECRET; 
userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema)


app.get("/", function(req,res){
    res.render("home")
})

app.get("/register", function(req,res){
    res.render("register")
})

app.get("/login", function(req,res){
    res.render("login")
})

app.post("/register", function(req,res){
    const newUser= new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
        }
    })

})

app.post("/login", function(req,res){
    const username= req.body.username;
    const password = req.body.password;
    
    User.findOne({email:username},function(err, foundUser){
        if (err){
            console.log(err)
        }else{
            if (foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }else{
                    console.log("Username or password is not valid")
                }
            }
        }
    })
})



app.listen(3000,function(){
    console.log("Server has started on port 3000")
})