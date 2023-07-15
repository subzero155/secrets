require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 30;
const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB').then(() => console.log('meow'));;
app.get("/",(req,res) => {
    res.render("home");

});

   

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});




const User = new mongoose.model("User",userSchema);

app.post("/register",(req,res)=> {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
            
        });
        
        newUser.save().then(() => {
            console.log('User saved!');
            res.render("secrets");
            })
    .catch(function (err) {
            console.log(err);
          });
    });

    
    });
    
    app.post("/login",(req,res)=> {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}).then(function (foundUser) {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result) {
                        res.render("\secrets");
                        console.log(foundUser.password);
                        console.log(password);
                    }
                });
   
                
            }
             
            }).catch(function (err) {
                console.log(err);
            }
          );



    });
        


app.get("/login",(req,res) => {
    res.render("login");
});

app.get("/register",(req,res) => {
    res.render("register");
});



app.listen(3000,()=> {
    console.log("Server started at port 3000!");
});