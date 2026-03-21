const mongoose = require("mongoose")
const Review = require("./review")

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

// DELETE Mongoose middleware
spotSchema.post("findOneAndDelete", async function (document) {
    if(document){
        await Review.remove(
            {
                _id: {
                    $in: document.reviews
                }
            }
        )
    }
})

// Exports the model 
module.exports = mongoose.model("Spot", spotSchema);