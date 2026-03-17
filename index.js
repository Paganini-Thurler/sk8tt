// Express server
const express = require("express");
const app = express();
const path = require("path");
const port = 8081;

// Method override
const methodOverride = require("method-override");

// Express middleware
app.set("views", path.join(__dirname, "views"));

// EJS mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine" ,"ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Mongoose/Mongo database
const mongoose = require("mongoose");
// Schemas
const Spot = require("./models/spot");
const { request } = require("http");

// Endpoint error class
const EndpointError = require("./errors/EndpointError");

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/sk8tt')
    .then(() => {
        console.log("Connected to the database");
    }).catch( (e) => {
        console.log(e);
    });

// Endpoints

// Home 
app.get("/", (request, response) =>{
    response.render("sk8tt.ejs");
});
// Get all Spots 
app.get("/spots", async (request, response, next) =>{
    //Async functions require next() in order to work properly 
    try{
        const spots = await Spot.find({});
        response.render("spots/spots.ejs", {spots});
    }catch(error){
        next(error);
    }
  
});
// Create a spot form
app.get("/spots/new", (request, response) =>{
    response.render("spots/newSpot.ejs");
}); 
// Post route for spots
app.post("/spots", async (request, response,next) =>{
    try{
        const spot = new Spot(request.body.spot);
        await spot.save();
        response.redirect(`/spots/${spot._id}`);
    }catch(error){
        next(error);
    }
});
// Get an Spot by ID
app.get("/spots/:id", async (request, response, next) =>{
    try{
        const spot = await Spot.findById(request.params.id);
        if(!spot){
            throw new EndPointError("Spot not found ", 404);
        }
        console.log(spot);
        response.render("spots/showSpots.ejs", {spot});
    }catch(error){
        next(error);
    }
});
// Get  form to edit an Spot by ID
app.get("/spots/:id/edit", async (request, response, next) =>{
    try{
        const spot = await Spot.findById(request.params.id);
        console.log(spot);
        response.render("spots/editSpot.ejs", {spot});
    }catch (error){
        next(error);
    }
});

app.put("/spots/:id", async (request, response, next) =>{
    try{
        const {id} = request.params;
        const spot = await Spot.findByIdAndUpdate(id, {...request.body.spot});
        response.redirect(`/spots/${spot._id}`);
    }catch(error){
        next(error);
    }
});

app.delete("/spots/:id", async (request, response, next) =>{
    try{
        const {id} = request.params;
        const spot = await Spot.findByIdAndDelete(id);
        response.redirect("/spots/");
    }catch(error){
        next(error);
    }
});
// Chosen port for the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});