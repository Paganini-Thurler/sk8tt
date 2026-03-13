// Express server
const express = require("express");
const app = express();
const path = require("path");
const port = 8081;

// Method override
const methodOverride = require("method-override");

// Express middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine" ,"ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Mongoose/Mongo database
const mongoose = require("mongoose");
// Schemas
const Product = require("./models/products.js");
const { request } = require("http");

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("Connected to the database");
    }).catch( (e) => {
        console.log(e);
    });