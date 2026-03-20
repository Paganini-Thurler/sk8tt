const mongoose = require("mongoose")

// Deffines the spot schema
const spotSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    image: String,
    obstacles: String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

// Exports the model 
module.exports = mongoose.model("Spot", spotSchema);