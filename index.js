// import express and morgan
const express = require("express");
const morgan = require("morgan");

// other dependencies
const db = require("./databasepg.js")
const port = 8000;

// create app
const app = express();

// set all the middlewares
app.use(morgan("tiny"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// routes
app.get("/show", function(req, res) {
    
    let query = "select * from chat";
   db.query(query, function(err, response) {
    if(err) {
        console.log("error while executing query", err);
    }
    else{
        res.json(response.rows);
    }
   }); 
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