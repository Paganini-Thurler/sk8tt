// Database
const mongoose = require("mongoose");

// Spot generator variables

const cities = require("./cities");
const {places, descriptors} = require("./spots");

// Model
const Spot = require("../models/spot");

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/sk8tt')
    .then(() => {
        console.log("Connected to the database");
    }).catch( (e) => {
        console.log(e);
    });

// Generate a sample from an array
const sample = array => array[Math.floor(Math.random() * array.length)];

// Populate the database

const populateDatabase = async () => {
    await Spot.deleteMany({});
    for(let i = 0; i < 50; i++){
        const randomCity = Math.floor(Math.random() * 1000);
        const spot = new Spot({
            location: `${cities[randomCity]}, ${cities[randomCity].state}`,
            title : `${sample(descriptors)} ${sample(places)}`
        });
        // Debugg print
        console.log(spot);
        await spot.save();
    }
    // Close the database
    await mongoose.connection.close();
    console.log("Connection closed.");

};

populateDatabase();