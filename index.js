// Express server
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;

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
const Review = require("./models/review");
const { request } = require("http");

// Joi Js Validators
const Joi = require("joi");
const {spotSchema, reviewSchema} = require("./validators/joiSchemas")
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

// Home (GET) 
app.get("/", (request, response) =>{
    response.render("sk8tt.ejs");
});
// (GET) all Spots endpoint
app.get("/spots", async (request, response, next) =>{
    //Async functions require next() in order to work properly 
    try{
        const spots = await Spot.find({});
        response.render("spots/spots.ejs", {spots});
    }catch(error){
        next(error);
    }
  
});
// (GET) Create a spot form endpoint
app.get("/spots/new", (request, response) =>{
    response.render("spots/newSpot.ejs");
}); 

// Joi validation middleware 

const validateSpot = (request, response, next) => {
    // joi validation
    const { error } = spotSchema.validate(request.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",");
        throw new EndpointError(message, 400);
    } else {
        next(); // Move on to the actual route handler
    }
};

// (POST) Spots endpoint
// validateSpot is a middleware 
app.post("/spots", validateSpot, async (request, response,next) =>{
    try{
        const spot = new Spot(request.body.spot);
        await spot.save();
        response.redirect(`/spots/${spot._id}`);
    }catch(error){
        next(error);
    }
});
// (GET) Spot by ID endpoint
app.get("/spots/:id", async (request, response, next) =>{
    try{
        const spot = await Spot.findById(request.params.id);
        if(!spot){
            throw new EndpointError("Spot not found ", 404);
        }
        console.log(spot);
        response.render("spots/showSpots.ejs", {spot});
    }catch(error){
        next(error);
    }
});
// (GE Form to edit an Spot by ID endpoint
app.get("/spots/:id/edit", async (request, response, next) =>{
    try{
        const spot = await Spot.findById(request.params.id);
        console.log(spot);
        response.render("spots/editSpot.ejs", {spot});
    }catch (error){
        next(error);
    }
});
// (PUT) Update a spot by ID endpoint
app.put("/spots/:id", validateSpot, async (request, response, next) =>{
    try{
        const {id} = request.params;
        const spot = await Spot.findByIdAndUpdate(id, { ...request.body.spot }, { new: true });
        response.redirect(`/spots/${spot._id}`);
    }catch(error){
        next(error);
    }
});

// (DELETE) Delete spot by ID endpoint
app.delete("/spots/:id", async (request, response, next) =>{
    try{
        const {id} = request.params;
        const spot = await Spot.findByIdAndDelete(id);
        response.redirect("/spots/");
    }catch(error){
        next(error);
    }
});

// Joi validation middleware for Reviews
const validateReview = (request, response, next) => {
    const { error } = reviewSchema.validate(request.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",");
        throw new EndpointError(message, 400);
    } else {
        next();
    }
};

// (POST) Review for a spot endpoint
// validateReview is a middleware
app.post("/spots/:id/reviews",validateReview, async (request, response, next) =>{
    try{
        // Find the spot first
        const spot = await Spot.findById(request.params.id);
        // Create a review
        const review = new Review(request.body.review);
        // Add the review to the Spot
        spot.reviews.push(review);
        await review.save();
        await spot.save();
        
        // Redirect to the spot page
        response.redirect(`/spots/${spot._id}`);
    }catch(error){
        console.log(error)
    }
});

// Default response
app.all("/{*path}", (request, response, next) =>{
    next(new EndpointError("Page not found", 404));
});

// Error handler middleware
app.use((error, request, response, next) =>{
    const {statusCode = 500} = error;
    if(!error.message){
        error.message = "Something is wrong";
    }
    response.status(statusCode).render("error.ejs", {error});
});


// Chosen port for the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});