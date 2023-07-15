require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret: secret, encryptedFields:['password']});



const User = new mongoose.model("User",userSchema);

app.post("/register",(req,res)=> {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    
    newUser.save().then(() => {
        console.log('User saved!');
        res.render("secrets");
        })
.catch(function (err) {
        console.log(err);
      });
    
    });
    
    app.post("/login",(req,res)=> {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}).then(function (foundUser) {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("\secrets");
                    console.log(foundUser.password);
                }
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