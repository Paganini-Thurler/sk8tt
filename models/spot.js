const mongoose = require("mongoose")

// Deffines the spot schema
const spotSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    obstacles: String
});

// Exports the model 
module.exports = mongoose.model("Spot", spotSchema);