// import express and morgan
const express = require("express");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("./auth.js");


// other dependencies
const  db = require("./databasepg.js");
const {findOne, addOne} = require("./databasepg.js");
const port = 8000;

// create app
const app = express();

// set all the middlewares
app.use(morgan("tiny"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// routes
app.post("/register", async (req, res) => {
    // Get User Input
    const {username, email, password } = req.body;

    if(!username || !email || !password) {
        res.status(400).send("all input are required");
    }
    const hasUser = await findOne(username);
    console.log("has User ", hasUser);
    if(hasUser){
        res.status(409).send("user already exists");
        return ;
    }

    // encrypt password
    const hashedPass = await bcrypt.hash(password, 10);

    const userAdded = await addOne(username, email, hashedPass);
    console.log("user Added", userAdded);
    if(!userAdded){ 
        res.status(400).send("user not added");
    }
    console.log("jwt private key", process.env.JWT_KEY);
    const user = {username, email, password : hashedPass};
    const token = await jwt.sign({username: user.username, email: user.email}, process.env.JWT_KEY, {expiresIn : "5h"});
    console.log("jwt token created", token)
    user.token = token;
    res.status(201).json(token);
});

app.post("/login", async (req, res) => {
    // Get User Input
    const {username, password } = req.body;

    if(!username || !password) {
        res.status(400).send("all input are required");
    }


    const user = await findOne(username);
    if(!user || ! await bcrypt.compare(password, user.password) ) {
        res.status(400).send("user does not exists");
    }
    const token = await jwt.sign({username: user.username, email: user.email}, process.env.JWT_KEY, {expiresIn : "5h"});
    user.token = token;
    res.status(200).json(user);

});

app.get("/home", auth, (req, res) => {
    res.status(200).send("home page");
});




// app listner
app.listen(port, function(err) {
    if(err) {
        console.log("error while creating listner", err);
    }
    else{
        console.log("listening to port " + port);
    }
})